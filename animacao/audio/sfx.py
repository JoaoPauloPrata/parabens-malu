# Efeitos sonoros: copia da biblioteca compartilhada do reels-creators (sfx_lib) ou gera no ElevenLabs os que faltam.
# uso: python audio/sfx.py   (rodar dentro de animacao/)
import json, pathlib, shutil, urllib.request

RC = pathlib.Path(__file__).resolve().parents[3] / 'reels-creators'
LIB = RC / 'sfx_lib'
OUT = pathlib.Path('audio/sfx'); OUT.mkdir(parents=True, exist_ok=True)

FROM_LIB = ['old_engine', 'wind_rush', 'whoosh', 'pop', 'cheer_two', 'sparkle', 'hearts_pop', 'music_final', 'hill_wind', 'magic_shine', 'flag_flap']
NEW = {
    'parachute_open': ['parachute canopy opening suddenly with a big cloth fwoomp and fabric flapping in the wind', 1.5],
    'dog_yip': ['small happy pinscher dog giving two short excited high pitched yips, playful, close', 1.2],
    'land_soft': ['cartoon soft landing on grass, light thud with a little bounce and a fabric rustle', 1.0],
    'gift_shake': ['small cardboard gift box handed over, paper rustle and a bright little ribbon jingle', 1.2],
}

for n in FROM_LIB:
    if not (OUT / f'{n}.mp3').exists(): shutil.copy(LIB / f'{n}.mp3', OUT / f'{n}.mp3'); print(n, 'da biblioteca')

key = next(l.split('=', 1)[1].strip() for l in (RC / '.env.txt').read_text().splitlines() if l.startswith('ELEVENLABS='))
for n, (prompt, dur) in NEW.items():
    if (OUT / f'{n}.mp3').exists(): continue
    body = {'text': prompt, 'duration_seconds': dur, 'prompt_influence': 0.5}
    req = urllib.request.Request('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128',
                                 data=json.dumps(body).encode(), headers={'xi-api-key': key, 'Content-Type': 'application/json'})
    data = urllib.request.urlopen(req).read()
    (OUT / f'{n}.mp3').write_bytes(data)
    if not (LIB / f'{n}.json').exists():   # entra na biblioteca compartilhada, como o sfx.py do reels-3d faz
        (LIB / f'{n}.mp3').write_bytes(data)
        (LIB / f'{n}.json').write_text(json.dumps({'prompt': prompt, 'dur': dur}, ensure_ascii=False), encoding='utf-8')
    print(n, 'gerado')
