# Animação do aniversário (recorte de papel)

Motor `paper-cutout` do reels-creators, em vertical 1080×1920. Cenas em `src/scenes/`, elenco e objetos em `src/party.js`.

```bash
# (dentro de animacao/) Chrome não está instalado: usar o Edge
export CHROME_PATH="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"

python assets/cut_heads.py      # tira o fundo das fotos (assets/src/*.png, fora do git)
python assets/make_heads.py     # recorta as cabeças + borda branca → src/heads.js
python audio/sfx.py             # efeitos (biblioteca do reels-creators / ElevenLabs)
python audio/parabens.py        # "Parabéns pra você" sintetizado
python audio/mix.py             # trilha final → audio/mix.m4a

node render.mjs --sheet=1,5,9,17 --cols=4 --w=300 --out=out/check/a.jpg   # conferir
node render.mjs --frames --workers=4 && node render.mjs --encode --out=out/video.mp4

# versão leve para o site
ffmpeg -y -i out/video.mp4 -vf "scale=720:1280:flags=lanczos,hqdn3d=1.5:1.5:3:3" -c:v libx264 -preset slow -crf 25 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k ../public/videos/aniversario.mp4
```
