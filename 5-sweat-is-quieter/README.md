# 5 — Exercise Is the Medicine Nobody Prescribes (60 detik, 9:16)

```bash
python build.py               # video -> output/, thumbnail -> output/thumbnail/, caption -> output/caption/
python build.py --thumbnail   # hanya thumbnail (tanpa audio & render video)
python build.py --caption     # hanya caption (.txt -> caption/) + judul & metadata (.json -> meta/)
python build.py --studio      # preview tanpa render
```

Naskah voiceover: `src/data/narration/part1.json` (suara `en-US-AndrewNeural`). Caption postingan: `src/data/caption.json`. Cache build & `clean_cache.py`: lihat README di root repo.
