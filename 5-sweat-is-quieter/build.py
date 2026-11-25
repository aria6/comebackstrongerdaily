"""Satu perintah: generate audio -> render -> bersih-bersih.
Video: output/5-sweat-is-quieter.mp4
Thumbnail: output/thumbnail/5-sweat-is-quieter.png

    python build.py               # build video + thumbnail + caption
    python build.py --thumbnail   # hanya thumbnail (cepat, tanpa audio & video)
    python build.py --caption     # hanya caption .txt + meta .json
    python build.py --studio      # preview di Remotion Studio (tanpa render)
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from buildkit import main  # noqa: E402

main(__file__, ROOT / "output", [("Video", "5-sweat-is-quieter.mp4"), ("Thumb", "5-sweat-is-quieter.png")])
