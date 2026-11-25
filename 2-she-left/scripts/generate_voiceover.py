"""
Voiceover Edge TTS per scene untuk tiap part (src/data/narration/*.json)
-> public/audio/vo/<part>/*.mp3 + src/data/timing/<part>.json

    python scripts/generate_voiceover.py            # semua part
    python scripts/generate_voiceover.py part1      # satu part
"""

import asyncio
import json
import math
import sys
from pathlib import Path

try:
    import edge_tts
except ImportError:
    sys.exit("edge-tts belum terinstall. Jalankan: pip install -r scripts/requirements.txt")

try:
    from mutagen.mp3 import MP3
except ImportError:
    MP3 = None

ROOT = Path(__file__).resolve().parent.parent
NARR_DIR = ROOT / "src" / "data" / "narration"
TIMING_DIR = ROOT / "src" / "data" / "timing"
VO_ROOT = ROOT / "public" / "audio" / "vo"

LEAD = 0.25
PAD = 0.45
RATES = ["+0%", "+5%", "+10%", "+15%", "+20%"]
MAX_TRIES = 6
DELAY_BETWEEN = 1.0


def mp3_duration(path: Path, words):
    if MP3 is not None:
        return MP3(str(path)).info.length
    return words[-1]["end"] + 0.15 if words else 3.0


async def _synth_once(text, path, voice, rate):
    kwargs = dict(voice=voice, rate=rate, pitch="+0Hz")
    try:
        comm = edge_tts.Communicate(text, boundary="WordBoundary", **kwargs)
    except TypeError:
        comm = edge_tts.Communicate(text, **kwargs)
    words = []
    with open(path, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = chunk["offset"] / 1e7
                dur = chunk["duration"] / 1e7
                words.append({"text": chunk["text"], "start": round(start, 3), "end": round(start + dur, 3)})
    if path.stat().st_size == 0:
        raise RuntimeError("file audio kosong")
    return mp3_duration(path, words), words


async def synth(text, path, voice, rate):
    last_err = None
    for attempt in range(1, MAX_TRIES + 1):
        try:
            result = await _synth_once(text, path, voice, rate)
            await asyncio.sleep(DELAY_BETWEEN)
            return result
        except Exception as e:
            last_err = e
            try:
                path.unlink()
            except FileNotFoundError:
                pass
            wait = min(2 ** attempt, 20)
            print(f"    ! gagal ({type(e).__name__}: {e}), coba lagi {attempt}/{MAX_TRIES} dalam {wait}s...")
            await asyncio.sleep(wait)
    raise RuntimeError(f"Edge TTS gagal {MAX_TRIES}x untuk: {path.name}") from last_err


def _norm(s):
    return "".join(ch for ch in s.lower() if ch.isalnum())


def attach_punct(text, words):
    """Edge TTS mengirim kata tanpa tanda baca. Ambil token asli dari naskah
    (mis. "money." / "back,") supaya caption bisa dipotong per kalimat."""
    tokens = text.split()
    ti = 0
    for w in words:
        nw = _norm(w["text"])
        for j in range(ti, min(ti + 4, len(tokens))):
            if nw and _norm(tokens[j]).startswith(nw):
                w["text"] = tokens[j]
                ti = j + 1
                break
    return words


async def build_part(narr_path: Path):
    part = narr_path.stem
    narr = json.loads(narr_path.read_text(encoding="utf-8"))
    fps, target = narr["fps"], narr["targetSeconds"]
    voice = narr.get("voice", "en-US-AndrewNeural")
    vo_dir = VO_ROOT / part
    vo_dir.mkdir(parents=True, exist_ok=True)

    results, used_rate = None, RATES[0]
    for rate in RATES:
        print(f"> [{part}] voice={voice}, rate={rate}")
        results = []
        for i, sc in enumerate(narr["scenes"]):
            out = vo_dir / f"{i + 1:02d}_{sc['id']}.mp3"
            dur, words = await synth(sc["text"], out, voice, rate)
            words = attach_punct(sc["text"], words)
            results.append((sc, out, dur, words))
            print(f"  - {out.name}: {dur:.2f}s, {len(words)} kata")
        needed = sum(max(sc["minSeconds"], LEAD + dur + PAD) for sc, _, dur, _ in results)
        used_rate = rate
        print(f"  total: {needed:.2f}s (target {target}s)")
        if needed <= target:
            break

    scenes, frame = [], 0
    for sc, out, dur, words in results:
        frames = int(math.ceil(max(sc["minSeconds"], LEAD + dur + PAD) * fps))
        scenes.append({
            "id": sc["id"],
            "text": sc["text"],
            "startFrame": frame,
            "durationInFrames": frames,
            "audio": f"audio/vo/{part}/{out.name}",
            "voDuration": round(dur, 3),
            "words": words,
        })
        frame += frames
    target_frames = int(round(target * fps))
    if frame < target_frames:
        scenes[-1]["durationInFrames"] += target_frames - frame
        frame = target_frames

    TIMING_DIR.mkdir(parents=True, exist_ok=True)
    out_path = TIMING_DIR / f"{part}.json"
    out_path.write_text(json.dumps({
        "generated": True, "fps": fps, "lead": LEAD, "rate": used_rate,
        "totalFrames": frame, "scenes": scenes,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ {out_path.relative_to(ROOT)}: {frame} frame ({frame / fps:.2f}s)")


async def main():
    only = set(sys.argv[1:])
    for p in sorted(NARR_DIR.glob("*.json")):
        if not only or p.stem in only:
            await build_part(p)


if __name__ == "__main__":
    asyncio.run(main())
