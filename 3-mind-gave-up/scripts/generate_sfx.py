"""
Generate sound effect pendek untuk transisi & aksen animasi.

Output (public/audio/sfx/):
  whoosh.wav  - transisi antar scene
  impact.wav  - hentakan berat (teks/elemen muncul, coretan)
  tick.wav    - detak jam
  check.wav   - centang checklist
  rise.wav    - tarikan naik sebelum momen bangkit

    python scripts/generate_sfx.py
"""

import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "public" / "audio" / "sfx"
SR = 44100
rng = np.random.default_rng(5)


def save(name, sig):
    sig = sig / (np.max(np.abs(sig)) + 1e-9) * 0.85
    pcm = (sig * 32767).astype(np.int16)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT_DIR / name), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"✓ {name}")


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def band_sweep(dur, f0, f1):
    t = t_axis(dur)
    noise = rng.standard_normal(len(t))
    out = np.zeros_like(noise)
    block = 512
    for i in range(0, len(t), block):
        c = f0 + (f1 - f0) * i / len(t)
        sos = butter(2, [c * 0.6, c * 1.4], btype="band", fs=SR, output="sos")
        out[i:i + block] = sosfilt(sos, noise[i:i + block])
    return t, out


def whoosh():
    t, out = band_sweep(0.6, 300, 2600)
    return out * np.sin(np.pi * t / t[-1]) ** 1.5


def impact():
    t = t_axis(1.4)
    freq = 42 + 110 * np.exp(-t * 14)
    low = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 3.2)
    crack = sosfilt(butter(2, 3000, btype="low", fs=SR, output="sos"), rng.standard_normal(len(t))) * np.exp(-t * 22) * 0.6
    return np.tanh((low + crack) * 1.6)


def tick():
    out = np.zeros(int(1.2 * SR))
    for k, f in enumerate((2400, 2000)):
        t = t_axis(0.03)
        click = np.sin(2 * np.pi * f * t) * np.exp(-t * 180)
        i = int(k * 0.5 * SR)
        out[i:i + len(click)] += click
    return out


def check():
    t = t_axis(0.5)
    tone = (np.sin(2 * np.pi * 880 * t) + 0.5 * np.sin(2 * np.pi * 1320 * t)) * np.exp(-t * 9)
    click = rng.standard_normal(len(t)) * np.exp(-t * 300) * 0.4
    return tone + click


def rise():
    t, out = band_sweep(1.0, 200, 5000)
    tone = np.sin(2 * np.pi * np.cumsum(120 * 2 ** (3 * t / t[-1])) / SR) * 0.4
    return (out + tone) * (t / t[-1]) ** 2


if __name__ == "__main__":
    save("whoosh.wav", whoosh())
    save("impact.wav", impact())
    save("tick.wav", tick())
    save("check.wav", check())
    save("rise.wav", rise())
