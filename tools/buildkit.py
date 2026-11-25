"""
Build kit bersama untuk semua project video.

Alur `python build.py` di tiap project:
  1. Siapkan dependency bersama di <repo>/.build-cache (sekali saja):
     - .build-cache/venv  -> Python (edge-tts, numpy, scipy, mutagen)
     - .build-cache/node  -> Node (remotion, react, Chrome headless)
  2. Generate voiceover, backsound, sfx
  3. Render video (.mp4) ke <output>/, thumbnail (.png) ke <output>/thumbnail/,
     tulis caption siap tempel (.txt) ke <output>/caption/ dan metadata upload (.json:
     judul, caption, hashtag, path video & thumbnail) ke <output>/meta/  (sumber: src/data/caption.json)
     `python build.py --thumbnail` = hanya thumbnail (tanpa audio & render video)
     `python build.py --caption`   = hanya caption (instan, tanpa Node/Python venv)
     `--thumbnail --caption`       = thumbnail + caption
  4. Bersih-bersih: hapus audio, kembalikan timing.json, hapus out/, cache, symlink
     -> yang tersisa hanya file mp4/png/txt/json di folder output.
"""

import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CACHE = REPO / ".build-cache"
VENV = CACHE / "venv"
NODE = CACHE / "node"
PY_REQS = Path(__file__).resolve().parent / "requirements.txt"

NODE_PACKAGE = {
    "name": "video-build-cache",
    "private": True,
    "dependencies": {
        "@remotion/cli": "^4.0.0",
        "@remotion/google-fonts": "^4.0.0",
        "react": "^18.3.1",
        "react-dom": "^18.3.1",
        "remotion": "^4.0.0",
    },
}

IS_WIN = os.name == "nt"


def log(msg):
    print(f"\n\033[1;36m▶ {msg}\033[0m", flush=True)


def run(cmd, cwd=None):
    print("  $ " + " ".join(str(c) for c in cmd), flush=True)
    subprocess.run([str(c) for c in cmd], cwd=cwd, check=True)


def _hash(data: str) -> str:
    return hashlib.sha1(data.encode()).hexdigest()


def venv_python() -> Path:
    return VENV / ("Scripts/python.exe" if IS_WIN else "bin/python")


def ensure_python():
    marker = VENV / ".reqs-hash"
    want = _hash(PY_REQS.read_text())
    if venv_python().exists() and marker.exists() and marker.read_text() == want:
        return
    log("Menyiapkan Python (sekali saja) -> .build-cache/venv")
    if not venv_python().exists():
        run([sys.executable, "-m", "venv", VENV])
    run([venv_python(), "-m", "pip", "install", "-q", "--upgrade", "pip"])
    run([venv_python(), "-m", "pip", "install", "-q", "--no-cache-dir", "-r", PY_REQS])
    marker.write_text(want)


def remotion_bin() -> Path:
    return NODE / "node_modules" / ".bin" / ("remotion.cmd" if IS_WIN else "remotion")


def ensure_node():
    if shutil.which("npm") is None:
        sys.exit("npm tidak ditemukan. Install Node.js 18+ dulu.")
    NODE.mkdir(parents=True, exist_ok=True)
    pkg = json.dumps(NODE_PACKAGE, indent=2)
    marker = NODE / ".pkg-hash"
    if remotion_bin().exists() and marker.exists() and marker.read_text() == _hash(pkg):
        return
    log("Menyiapkan Node/Remotion (sekali saja) -> .build-cache/node")
    (NODE / "package.json").write_text(pkg)
    run(["npm", "install", "--no-audit", "--no-fund", "--loglevel=error"], cwd=NODE)
    marker.write_text(_hash(pkg))


def _rm(path: Path):
    if path.is_symlink() or path.is_file():
        path.unlink()
    elif path.is_dir():
        shutil.rmtree(path, ignore_errors=True)


def clean_shm():
    """Hapus sisa frame shared-memory Remotion (/dev/shm/rmshm-*) milik user ini.
    File ini tertinggal kalau Chrome crash dan memakan RAM (8 MB per frame)."""
    shm = Path("/dev/shm")
    if not shm.is_dir() or not hasattr(os, "getuid"):
        return
    for f in shm.glob("rmshm-*"):
        try:
            if f.stat().st_uid == os.getuid():
                f.unlink()
        except OSError:
            pass


IMAGE_EXT = (".png", ".jpg", ".jpeg")


def is_image(name: str) -> bool:
    return Path(name).suffix.lower() in IMAGE_EXT


def target(project: Path, output_dir: Path, name: str) -> Path:
    """Video -> <output>/<name>; thumbnail -> <output>/thumbnail/<name>"""
    return output_dir / "thumbnail" / name if is_image(name) else output_dir / name


MAX_TITLE = 100  # judul YouTube Shorts
MAX_TAGS = 5  # batas hashtag Instagram (berlaku Des 2025)


def caption_parts(comp: str, c: dict):
    """-> (judul, teks caption + hashtag, list hashtag tanpa '#')"""
    title = c["title"].strip()
    tags = [t.strip().lstrip("#") for t in c["hashtags"]]
    if len(title) > MAX_TITLE:
        sys.exit(f"caption.json [{comp}]: judul {len(title)} karakter (maks {MAX_TITLE}).")
    if len(tags) > MAX_TAGS:
        sys.exit(f"caption.json [{comp}]: {len(tags)} hashtag (maks {MAX_TAGS}).")
    body = c["caption"]
    body = "\n".join(body) if isinstance(body, list) else body.strip()
    text = f"{body}\n\n{' '.join('#' + t for t in tags)}"
    return title, text, tags


def write_captions(project: Path, output_dir: Path, renders) -> list:
    """
    Untuk tiap video yang punya entri di src/data/caption.json:
      <output>/caption/<nama>.txt -> caption + hashtag (siap tempel, tanpa judul)
      <output>/meta/<nama>.json   -> judul, caption, hashtag, path video & thumbnail
    """
    f = project / "src" / "data" / "caption.json"
    if not f.exists():
        return []
    data = json.loads(f.read_text(encoding="utf-8"))
    thumbs = [n for _, n in renders if is_image(n)]
    written = []
    for comp, name in renders:
        if is_image(name) or comp not in data:
            continue
        stem = Path(name).stem
        title, text, tags = caption_parts(comp, data[comp])
        thumb = next((t for t in thumbs if Path(t).stem == stem), None)
        txt = output_dir / "caption" / f"{stem}.txt"
        meta = output_dir / "meta" / f"{stem}.json"
        for p in (txt, meta):
            p.parent.mkdir(parents=True, exist_ok=True)
        txt.write_text(text + "\n", encoding="utf-8")
        meta.write_text(
            json.dumps(
                {
                    "title": title,
                    "caption": text,
                    "hashtags": tags,
                    "video": name,
                    "thumbnail": f"thumbnail/{thumb}" if thumb else None,
                },
                indent=2,
                ensure_ascii=False,
            )
            + "\n",
            encoding="utf-8",
        )
        written += [txt, meta]
    return written


def build(project: Path, output_dir: Path, renders, studio: bool = False, thumb_only: bool = False,
          captions: bool = True):
    """
    project    : folder project (berisi src/, scripts/, remotion.config.ts)
    output_dir : folder output topik (mis. 2-akuaponik/2-output)
    renders    : list (composition_id, nama_file) — .mp4 = video, .png = thumbnail (still frame 0)
    thumb_only : hanya render thumbnail, lewati generate audio & render video
    captions   : tulis caption (.txt) + metadata (.json) juga
    """
    project = project.resolve()
    output_dir = output_dir.resolve()
    cap_files = write_captions(project, output_dir, renders) if captions and not studio else []
    if thumb_only:
        renders = [r for r in renders if is_image(r[1])]
        if not renders:
            sys.exit("Project ini belum punya thumbnail.")
    else:
        ensure_python()
    ensure_node()

    data_dir = project / "src" / "data"
    timing_files = [p for p in data_dir.rglob("timing*.json")]
    backup = {p: p.read_bytes() for p in timing_files}

    nm = project / "node_modules"
    made_link = False
    produced = []
    try:
        if nm.exists() and not nm.is_symlink():
            print("  ! node_modules lokal masih ada di project ini. Dipakai apa adanya;")
            print("    hapus folder itu supaya hemat disk (build cukup pakai .build-cache).")
        elif not nm.exists():
            nm.symlink_to(NODE / "node_modules", target_is_directory=True)
            made_link = True

        if not thumb_only:
            log("Generate voiceover, backsound, sfx")
            run([venv_python(), "scripts/generate_all.py"], cwd=project)

        if studio:
            log("Membuka Remotion Studio (Ctrl+C untuk keluar & bersih-bersih)")
            run([remotion_bin(), "studio"], cwd=project)
            return

        clean_shm()
        for comp, name in renders:
            out = target(project, output_dir, name)
            out.parent.mkdir(parents=True, exist_ok=True)
            log(f"Render {comp} -> {out.relative_to(REPO)}")
            produced.append(out)
            if is_image(name):
                run([remotion_bin(), "still", comp, out, "--frame=0", "--overwrite",
                     "--bundle-cache=false"], cwd=project)
            else:
                run([remotion_bin(), "render", comp, out, "--overwrite", "--bundle-cache=false"],
                    cwd=project)
            produced.remove(out)
        log("Selesai ✓")
        for _, name in renders:
            print(f"  {target(project, output_dir, name).relative_to(REPO)}")
        for p in cap_files:
            print(f"  {p.relative_to(REPO)}")
    except (subprocess.CalledProcessError, KeyboardInterrupt) as e:
        for p in produced:  # hapus video setengah jadi
            _rm(p)
        print(f"\n✗ Build gagal/dihentikan: {e}")
        raise SystemExit(1)
    finally:
        log("Bersih-bersih file hasil build")
        clean_shm()
        for p, content in backup.items():
            p.write_bytes(content)
        _rm(project / "public" / "audio")
        if (project / "public").is_dir() and not any((project / "public").iterdir()):
            _rm(project / "public")
        _rm(project / "out")
        for pc in project.rglob("__pycache__"):
            _rm(pc)
        if made_link:
            _rm(nm)


def main(project_file: str, output_dir: Path, renders):
    studio = "--studio" in sys.argv
    thumb_only = "--thumbnail" in sys.argv
    caption = "--caption" in sys.argv
    project = Path(project_file).resolve().parent
    if caption and not thumb_only and not studio:
        files = write_captions(project, Path(output_dir).resolve(), renders)
        if not files:
            sys.exit("Project ini belum punya src/data/caption.json.")
        log("Caption selesai ✓")
        for p in files:
            print(f"  {p.relative_to(REPO)}")
        return
    build(project, output_dir, renders, studio=studio, thumb_only=thumb_only,
          captions=caption or not thumb_only)
