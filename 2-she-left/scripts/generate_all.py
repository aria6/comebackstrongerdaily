"""
Generate semua asset sekaligus: voiceover + timing.json, backsound, dan SFX.

    python scripts/generate_all.py
"""

import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

for script in ("generate_voiceover.py", "generate_backsound.py", "generate_sfx.py"):
    print(f"\n=== {script} ===")
    subprocess.run([sys.executable, str(HERE / script)], check=True)

print("\nSemua asset siap. Lanjut: npm install && npm run dev")
