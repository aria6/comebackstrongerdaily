# comebackstrongerdaily

Video motivasi pendek (English, 9:16, 60 detik) — Remotion + Edge TTS (`en-US-ChristopherNeural`), subtitle Inggris per kata, backsound & SFX dibuat script.

```
[id]-[topic]/   project video (satu folder per video)
output/         hasil video (.mp4)
output/thumbnail/  hasil thumbnail (.png, 9:16)
output/caption/    caption + hashtag siap tempel (.txt)
output/meta/       judul, caption, hashtag, path video & thumbnail (.json)
tools/          global build kit
clean_cache.py  hapus cache build
```

## Build video

Butuh **Python 3.9+**, **Node.js 18+**, dan internet.

```bash
cd [id]-[topic]
python build.py               # generate audio -> render video + thumbnail -> bersih-bersih
python build.py --thumbnail   # hanya thumbnail 9:16 (cepat, tanpa audio & render video)
python build.py --caption     # hanya caption .txt + meta .json (instan; bisa digabung dengan --thumbnail)
python build.py --studio      # preview di Remotion Studio, tanpa render
```

Yang tersisa setelah build hanya video (.mp4), thumbnail (.png), caption (.txt), dan metadata (.json) di `output/`. Audio, timing, bundle, dan file sementara lain otomatis dihapus.

Dependency (Python venv + Node/Remotion + Chrome headless) di-install **sekali** ke `.build-cache/` di root repo, lalu dipakai bersama oleh semua project.

## clean_cache.py — kosongkan ruang disk

```bash
python clean_cache.py            # hapus semua cache (venv + node)
python clean_cache.py --node     # hapus Node/Remotion saja (bagian terbesar)
python clean_cache.py --python   # hapus venv Python saja
```
