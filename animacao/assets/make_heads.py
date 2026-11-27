# Cabeças de colagem: recorta a cabeça de cada foto sem fundo, corta o corpo com uma elipse e põe uma borda branca
# de papel recortado em volta (como foto recortada com tesoura). Saída: assets/heads/<nome>.png
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BORDER = 9   # px da borda branca, na resolução de saída
OUT_H = 520  # altura de saída da cabeça (px)

# box = recorte na foto original; ell = elipse (na foto original) que mantém a cabeça e corta ombros/roupa
HEADS = {
    'joao': dict(box=(320, 150, 620, 540), ell=(352, 160, 590, 528)),
    'thor': dict(box=(200, 330, 1020, 1140), ell=(150, 320, 1060, 1180)),
    'malu': dict(box=(40, 60, 470, 440), ell=(20, 40, 490, 450), cut=[(330, 305), (360, 296), (560, 296), (560, 560), (238, 560), (244, 450), (250, 400), (300, 350)]),
}

for name, h in HEADS.items():
    im = Image.open(f'assets/src/{name}_rembg.png').convert('RGBA')
    m = Image.new('L', im.size, 0)
    ImageDraw.Draw(m).ellipse(h['ell'], fill=255)
    if 'cut' in h: ImageDraw.Draw(m).polygon(h['cut'], fill=0)   # tira a roupa que a elipse deixou
    a = np.minimum(np.array(im.getchannel('A')), np.array(m))
    im.putalpha(Image.fromarray(a))
    im = im.crop(h['box'])
    s = OUT_H / im.height
    im = im.resize((round(im.width * s), OUT_H), Image.LANCZOS)
    pad = BORDER * 3
    big = Image.new('RGBA', (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
    big.alpha_composite(im, (pad, pad))
    alpha = big.getchannel('A').point(lambda v: 255 if v > 90 else 0)
    # borda: dilata o contorno e suaviza um pouco (corte de tesoura, não vetor perfeito)
    border = alpha.filter(ImageFilter.MaxFilter(BORDER * 2 + 1)).filter(ImageFilter.GaussianBlur(1.6)).point(lambda v: 255 if v > 110 else 0)
    paper = Image.new('RGBA', big.size, (250, 246, 236, 0))
    paper.putalpha(border)
    paper.alpha_composite(big)
    bb = paper.getbbox()
    paper = paper.crop(bb)
    paper.save(f'assets/heads/{name}.png')
    print(name, paper.size)

# embute as cabeças no projeto como data URLs (imagens file:// "sujariam" o canvas no Chrome headless)
import base64
with open('src/heads.js', 'w') as f:
    f.write('// gerado por assets/make_heads.py — não editar\nwindow.HEAD_SRC = {\n')
    for name in HEADS:
        f.write(f"  {name}: 'data:image/png;base64,{base64.b64encode(open(f'assets/heads/{name}.png', 'rb').read()).decode()}',\n")
    f.write('};\n')
print('src/heads.js ok')
