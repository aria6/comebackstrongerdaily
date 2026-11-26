"""
Generate backsound sinematik gelap -> bangkit (60+ detik) secara prosedural,
tanpa file eksternal dan bebas hak cipta.

Alur musik (D minor, 70 BPM):
  - awal   : drone rendah + pad + piano tipis (sedih, sepi)
  - tengah : detak jantung + tom ala taiko masuk pelan-pelan
  - akhir  : perkusi pelan-pelan mereda, lalu akor mayor lembut masuk di kata "back" ("get your life back") (tanpa dentuman)
Posisi HIT dibaca dari src/data/timing/part1.json (hasil generate_voiceover.py).

Output: public/audio/backsound.wav (stereo, 44.1 kHz)

    python scripts/generate_backsound.py [--seconds 62] [--bpm 70]
"""

import argparse
import json
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "backsound.wav"
TIMING = ROOT / "src" / "data" / "timing" / "part1.json"
SOFT_END = True  # penutup lembut: tanpa riser & dentuman, perkusi mereda
HIT_SCENE, HIT_WORD = "outro", "back"
SR = 44100
rng = np.random.default_rng(11)


def midi_hz(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def lowpass(x, cutoff, order=4):
    return sosfilt(butter(order, cutoff, btype="low", fs=SR, output="sos"), x)


def highpass(x, cutoff, order=2):
    return sosfilt(butter(order, cutoff, btype="high", fs=SR, output="sos"), x)


def env_adsr(n, a, d, s, r):
    a_n, d_n, r_n = int(a * SR), int(d * SR), int(r * SR)
    s_n = max(n - a_n - d_n - r_n, 0)
    e = np.concatenate([
        np.linspace(0, 1, a_n, endpoint=False),
        np.linspace(1, s, d_n, endpoint=False),
        np.full(s_n, s),
        np.linspace(s, 0, r_n),
    ])
    return np.pad(e, (0, max(n - len(e), 0)))[:n]


def add(buf, sig, start):
    i = int(start * SR)
    if i >= len(buf) or i < 0:
        return
    end = min(len(buf), i + len(sig))
    buf[i:end] += sig[: end - i]


def saw(f, t):
    return 2 * ((f * t) % 1.0) - 1


def pad(freqs, dur, bright=900):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for f in freqs:
        for det in (-0.08, 0.0, 0.08):
            out += saw(f * 2 ** (det / 12), t + rng.uniform(0, 1))
    out = lowpass(out, bright)
    return out * env_adsr(n, 1.2, 0.5, 0.85, 1.4) / (len(freqs) * 3)


def piano(f, dur=3.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sig = sum(a * np.sin(2 * np.pi * f * h * t) * np.exp(-t * (1.6 + h * 0.9)) for h, a in ((1, 1), (2, 0.45), (3, 0.2), (4, 0.08)))
    return sig * np.minimum(t / 0.005, 1)


def thump(f0=55, dur=0.5, decay=8):
    n = int(dur * SR)
    t = np.arange(n) / SR
    freq = f0 + f0 * 1.6 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * decay)


def tom(f0=80):
    body = thump(f0, 0.7, 6)
    n = len(body)
    t = np.arange(n) / SR
    skin = lowpass(rng.standard_normal(n), 1800) * np.exp(-t * 30) * 0.3
    return body + skin


def boom():
    n = int(3.5 * SR)
    t = np.arange(n) / SR
    freq = 38 + 90 * np.exp(-t * 9)
    low = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 1.4)
    noise = lowpass(rng.standard_normal(n), 2500) * np.exp(-t * 5) * 0.5
    return low + noise


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    noise = rng.standard_normal(n)
    out = np.zeros(n)
    block = 1024
    for i in range(0, n, block):
        p = i / n
        c = 300 + 6000 * p ** 2
        sos = butter(2, [c * 0.7, c * 1.3], btype="band", fs=SR, output="sos")
        out[i:i + block] = sosfilt(sos, noise[i:i + block])
    tone = np.sin(2 * np.pi * np.cumsum(110 * 2 ** (2.5 * t / dur)) / SR) * 0.3
    return (out + tone) * (t / dur) ** 2


def hit_time(default):
    """Detik saat kata HIT_WORD di scene HIT_SCENE diucapkan."""
    try:
        data = json.loads(TIMING.read_text(encoding="utf-8"))
        if not data.get("generated"):
            return default
        fps, lead = data["fps"], data["lead"]
        for s in data["scenes"]:
            if s["id"] == HIT_SCENE:
                for w in s["words"]:
                    if w["text"].lower().strip(".,!?") == HIT_WORD:
                        return s["startFrame"] / fps + lead + w["start"]
    except (OSError, KeyError, ValueError):
        pass
    return default


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--seconds", type=float, default=62.0)
    ap.add_argument("--bpm", type=float, default=70.0)
    args = ap.parse_args()

    total = args.seconds
    beat = 60.0 / args.bpm
    bar = beat * 4
    n = int(total * SR)
    L = np.zeros(n)
    R = np.zeros(n)
    hit = hit_time(total - 5.5)
    print(f"  HIT di {hit:.2f}s")

    def both(sig, at, pan=0.5):
        add(L, sig * (1 - pan) * 2 * 0.5, at)
        add(R, sig * pan * 2 * 0.5, at)

    def calm(t):
        """Perkusi mereda pelan-pelan ~7 detik sebelum penutup (SOFT_END)."""
        if not SOFT_END:
            return 1.0
        return float(np.clip((hit - 1.0 - t) / 7.0, 0.0, 1.0))

    # i - VI - III - VII (Dm - Bb - F - C)
    prog = [(38, [62, 65, 69]), (34, [62, 65, 70]), (41, [60, 65, 69]), (36, [60, 64, 67])]
    melody = [74, 72, 69, 65, 67, 69, 72, 74]

    bars = int(np.ceil(total / bar))
    for b in range(bars):
        t0 = b * bar
        if t0 >= hit:
            break
        root, chord = prog[b % 4]
        intensity = min(1.0, t0 / hit)
        # drone + pad
        dr = pad([midi_hz(root - 12), midi_hz(root)], bar + 1.5, bright=260) * 0.9
        both(dr, t0)
        p = pad([midi_hz(m) for m in chord], bar + 1.5, bright=700 + 900 * intensity) * (0.35 + 0.25 * intensity)
        add(L, p, t0)
        add(R, np.roll(p, 400), t0)
        # piano tipis
        if b >= 1:
            for k in range(2):
                note = melody[(b * 2 + k) % len(melody)]
                both(piano(midi_hz(note)) * 0.16, t0 + k * beat * 2, 0.35 + 0.3 * k)
        # detak jantung
        if 3 <= b and t0 < hit:
            for k in (0, 2):
                g = calm(t0 + k * beat)
                both(thump(52) * 0.45 * (0.6 + 0.4 * intensity) * g, t0 + k * beat)
                both(thump(48) * 0.3 * (0.6 + 0.4 * intensity) * g, t0 + k * beat + 0.22)
        # tom ala taiko di paruh kedua
        if intensity > 0.5:
            pattern = [0, 2, 3] if intensity < 0.8 else [0, 1, 2, 2.5, 3, 3.5]
            for k in pattern:
                tt = t0 + k * beat
                if tt < hit - 0.1:
                    both(tom(70 + (k % 2) * 12) * 0.35 * intensity * calm(tt), tt, 0.4 + 0.2 * (k % 2))

    tail = total - hit + 1
    if SOFT_END:
        # akor mayor lembut, masuk pelan (attack panjang), tanpa riser/dentuman
        for m, v in ((50, 0.35), (57, 0.3), (62, 0.3), (66, 0.22), (69, 0.18)):  # D mayor
            s = pad([midi_hz(m)], tail, bright=1100) * v * 0.7
            both(s, hit - 0.6, 0.35 + (m % 3) * 0.15)
        for k in range(3):
            both(piano(midi_hz([74, 78, 81][k]), 4) * 0.08, hit + 0.6 + k * beat, 0.35 + k * 0.12)
    else:
        # riser -> HIT -> akor mayor (bangkit)
        rdur = 3.2
        r = riser(rdur) * 0.35
        add(L, r, hit - rdur)
        add(R, np.roll(r, 300), hit - rdur)
        both(boom() * 0.9, hit)
        for m, v in ((50, 0.5), (57, 0.4), (62, 0.45), (66, 0.35), (69, 0.3), (74, 0.2)):  # D mayor
            s = pad([midi_hz(m)], tail, bright=2200) * v * 1.6
            both(s, hit + 0.05, 0.35 + (m % 3) * 0.15)
        for k in range(4):
            both(piano(midi_hz([74, 78, 81, 86][k]), 4) * 0.18, hit + 0.4 + k * beat / 2, 0.3 + k * 0.12)

    fade_in, fade_out = int(1.5 * SR), int(2.5 * SR)
    env = np.ones(n)
    env[:fade_in] = np.linspace(0, 1, fade_in)
    env[-fade_out:] = np.linspace(1, 0, fade_out)
    stereo = np.stack([L * env, R * env], axis=1)
    stereo = highpass(stereo.T, 28).T
    stereo = np.tanh(stereo * 1.4)
    stereo /= np.max(np.abs(stereo)) + 1e-9
    stereo *= 0.85
    if SOFT_END:
        stereo *= 0.85  # tanpa dentuman, puncak lebih rendah: samakan level dengan versi lama

    OUT.parent.mkdir(parents=True, exist_ok=True)
    pcm = (stereo * 32767).astype(np.int16)
    with wave.open(str(OUT), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(f"✓ Backsound: {OUT.relative_to(ROOT)} ({total:.1f}s, {args.bpm:.0f} BPM)")


if __name__ == "__main__":
    main()
