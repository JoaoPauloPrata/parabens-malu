# "Parabéns pra você" rápido e festivo, sintetizado (melodia em domínio público).
# Marimba + sininho na melodia, baixo oom-pah-pah, palmas e chimbal. Saída: audio/parabens.wav
# uso: python audio/parabens.py
import numpy as np, wave

SR = 44100
BPM = 176
B = 60 / BPM
rng = np.random.default_rng(7)

def hz(n):   # 'C4' → Hz
    names = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
    semi = names[n[0]] + (1 if '#' in n else 0) + 12 * (int(n[-1]) + 1)
    return 440 * 2 ** ((semi - 69) / 12)

def env(n, a=.004, d=.25):
    t = np.arange(n) / SR
    return np.minimum(1, t / a) * np.exp(-t / d)

def marimba(f, dur):
    n = int(SR * (dur + .6)); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * env(n, .003, .45) + .35 * np.sin(2 * np.pi * f * 4 * t) * env(n, .002, .06)
    return s

def bell(f, dur):
    n = int(SR * (dur + .9)); t = np.arange(n) / SR
    return (.5 * np.sin(2 * np.pi * f * 2 * t) + .25 * np.sin(2 * np.pi * f * 5.4 * t) * env(n, .001, .12)) * env(n, .002, .7)

def pluck_bass(f, dur):
    n = int(SR * (dur + .2)); t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * f * t)) * .4 + np.sin(2 * np.pi * f * t)
    return s * env(n, .004, .18)

def chord_stab(fs, dur):
    n = int(SR * (dur + .15)); t = np.arange(n) / SR
    s = sum(np.sin(2 * np.pi * f * t) + .3 * np.sin(2 * np.pi * f * 2 * t) for f in fs) / len(fs)
    return s * env(n, .005, .12)

def clap():
    n = int(SR * .18); e = np.zeros(n)
    for k, off in enumerate([0, .011, .022]):   # três batidas bem juntas = palma
        i = int(off * SR); e[i:] += np.exp(-np.arange(n - i) / SR / (.012 if k < 2 else .05))
    noise = rng.standard_normal(n)
    noise = np.convolve(noise, [1, -0.9], 'same')   # tira o grave
    return noise * e * .5

def hat():
    n = int(SR * .05)
    return np.convolve(rng.standard_normal(n), [1, -1], 'same') * np.exp(-np.arange(n) / SR / .012) * .25

def kick():
    n = int(SR * .3); t = np.arange(n) / SR
    f = 120 * np.exp(-t / .05) + 45
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .12)

INTRO = 3   # um compasso de oom-pah-pah antes da melodia
mel = [
    ('G4', .75), ('G4', .25), ('A4', 1), ('G4', 1), ('C5', 1), ('B4', 2),
    ('G4', .75), ('G4', .25), ('A4', 1), ('G4', 1), ('D5', 1), ('C5', 2),
    ('G4', .75), ('G4', .25), ('G5', 1), ('E5', 1), ('C5', 1), ('B4', 1), ('A4', 1),
    ('F5', .75), ('F5', .25), ('E5', 1), ('C5', 1), ('D5', 1), ('C5', 3),
]
# acordes por compasso (3/4); o compasso 0 é a introdução, a melodia começa com anacruse no fim dele
CH = {'C': ['C3', 'E4', 'G4', 'C5'], 'G7': ['G2', 'F4', 'B4', 'D5'], 'C7': ['C3', 'E4', 'A#4', 'G4'], 'F': ['F2', 'F4', 'A4', 'C5']}
bars = ['C', 'C', 'G7', 'G7', 'C', 'C7', 'F', 'G7', 'C', 'C']

total_beats = INTRO - 1 + sum(d for _, d in mel) + 3
out = np.zeros(int(SR * (total_beats * B + 2)))

def put(sig, beat, g=1.):
    i = int(beat * B * SR); j = min(len(out), i + len(sig)); out[i:j] += sig[:j - i] * g

# melodia (anacruse começa no último tempo do compasso de introdução)
b = INTRO - 1
for n, d in mel:
    put(marimba(hz(n), d * B), b, .55)
    put(bell(hz(n), d * B), b, .22)
    b += d
end_beat = b
# acompanhamento: compasso k começa no tempo 3k
for k, c in enumerate(bars):
    b0 = 3 * k
    if b0 >= end_beat: break
    root, *upper = CH[c]
    put(pluck_bass(hz(root), B * .9), b0, .32)
    put(kick(), b0, .55)
    for off in (1, 2):
        put(chord_stab([hz(x) for x in upper], B * .6), b0 + off, .2)
        put(clap(), b0 + off, .5 if off == 2 else .3)
    for h in range(6): put(hat(), b0 + h * .5, .5)
# final: acorde de C cheio + sininhos subindo
put(chord_stab([hz(x) for x in ['C4', 'E4', 'G4', 'C5', 'E5']], B * 3), end_beat - 3, .25)
for i, n in enumerate(['C6', 'E6', 'G6', 'C7']):
    put(bell(hz(n), .3), end_beat - 1 + i * .25, .18)

out = out[:int(SR * (end_beat * B + 1.6))]
out /= np.max(np.abs(out)) * 1.12
fade = int(SR * .4); out[-fade:] *= np.linspace(1, 0, fade)
st = np.stack([out, np.roll(out, 90) * .96], 1)   # um pouquinho de largura estéreo
with wave.open('audio/parabens.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((st * 32767).astype('<i2').tobytes())
print(f'audio/parabens.wav  {len(out) / SR:.2f}s  melodia começa em {(INTRO - 1) * B:.2f}s')
