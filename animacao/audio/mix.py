# Mixa a trilha do vídeo: [arquivo, início (s), volume, opções]. Saída: audio/mix.m4a (25.5 s)
# uso: python audio/mix.py
import subprocess

DUR = 25.5
A = 8.6   # começo do plano B
TRACKS = [
    # arquivo                    início       vol   {loop, dur, fade_in, fade_out}
    ('sfx/music_final.mp3',      0.0,         .32, dict(dur=14.1, fade_in=.6, fade_out=.8)),
    ('sfx/old_engine.mp3',       0.3,         .55, dict(loop=True, dur=8.3, fade_in=1.2, fade_out=.3)),
    ('sfx/whoosh.mp3',           4.3,         .8,  {}),
    ('sfx/dog_yip.mp3',          6.0,         .9,  {}),
    ('sfx/pop.mp3',              6.45,        .7,  {}),
    ('sfx/sparkle.mp3',          7.2,         .6,  {}),
    ('sfx/whoosh.mp3',           7.85,        .9,  {}),
    ('sfx/wind_rush.mp3',        A,           .6,  dict(dur=1.6, fade_out=.8)),
    ('sfx/parachute_open.mp3',   A + .5,      .9,  {}),
    ('sfx/parachute_open.mp3',   A + .8,      .7,  {}),
    ('sfx/hill_wind.mp3',        A + 1.2,     .35, dict(dur=4.4, fade_in=.8, fade_out=1.0)),
    ('sfx/land_soft.mp3',        A + 5.0,     .9,  {}),
    ('sfx/land_soft.mp3',        A + 5.35,    .9,  {}),
    ('sfx/cheer_two.mp3',        A + 5.4,     .7,  {}),
    ('parabens.wav',             A + 5.6,     .9,  {}),
    ('sfx/gift_shake.mp3',       A + 7.35,    .8,  {}),
    ('sfx/hearts_pop.mp3',       A + 8.75,    .8,  {}),
    ('sfx/dog_yip.mp3',          A + 10.4,    .6,  {}),
    ('sfx/magic_shine.mp3',      A + 13.0,    .5,  {}),
]

args, filt = ['ffmpeg', '-y', '-loglevel', 'error'], []
for i, (f, t0, vol, o) in enumerate(TRACKS):
    if o.get('loop'): args += ['-stream_loop', '-1']
    args += ['-i', f'audio/{f}']
    chain = f'[{i}:a]aresample=44100,aformat=channel_layouts=stereo'
    if o.get('dur'): chain += f',atrim=0:{o["dur"]}'
    if o.get('fade_in'): chain += f',afade=t=in:d={o["fade_in"]}'
    if o.get('fade_out'): chain += f',afade=t=out:st={o["dur"] - o["fade_out"]}:d={o["fade_out"]}'
    chain += f',volume={vol},adelay={int(t0 * 1000)}:all=1[a{i}]'
    filt.append(chain)
filt.append(''.join(f'[a{i}]' for i in range(len(TRACKS))) + f'amix=inputs={len(TRACKS)}:normalize=0,apad,atrim=0:{DUR},alimiter=limit=.9[out]')
args += ['-filter_complex', ';'.join(filt), '-map', '[out]', '-c:a', 'aac', '-b:a', '192k', 'audio/mix.m4a']
subprocess.run(args, check=True)
print('audio/mix.m4a ok')
