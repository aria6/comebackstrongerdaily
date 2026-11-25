"""
Hapus cache build (.build-cache) untuk mengosongkan ruang disk.
Build berikutnya akan meng-install ulang dependency secara otomatis.

    python clean_cache.py            # hapus semua (venv + node)
    python clean_cache.py --node     # hapus Node/Remotion saja
    python clean_cache.py --python   # hapus venv Python saja
"""

import shutil
import sys
from pathlib import Path

CACHE = Path(__file__).resolve().parent / ".build-cache"


def size(path: Path) -> int:
    if not path.exists():
        return 0
    return sum(f.stat().st_size for f in path.rglob("*") if f.is_file() and not f.is_symlink())


def main():
    args = set(sys.argv[1:])
    targets = []
    if "--node" in args:
        targets.append(CACHE / "node")
    if "--python" in args:
        targets.append(CACHE / "venv")
    if not targets:
        targets = [CACHE]

    total = 0
    for t in targets:
        if not t.exists():
            print(f"- {t.relative_to(CACHE.parent)} tidak ada, dilewati")
            continue
        s = size(t)
        shutil.rmtree(t, ignore_errors=True)
        total += s
        print(f"✓ Hapus {t.relative_to(CACHE.parent)} ({s / 1e6:.0f} MB)")
    print(f"Total ruang dibebaskan: {total / 1e6:.0f} MB")


if __name__ == "__main__":
    main()
