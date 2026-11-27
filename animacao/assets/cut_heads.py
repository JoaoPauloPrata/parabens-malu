# Tira o fundo das fotos (rembg). Saída: assets/src/<nome>_rembg.png (RGBA, tamanho original).
# O recorte da cabeça e a borda branca de papel são feitos depois, em make_heads.py.
import sys
from rembg import remove, new_session
from PIL import Image

sess = new_session(sys.argv[1] if len(sys.argv) > 1 else 'isnet-general-use')
for name in ['joao', 'thor', 'malu']:
    im = Image.open(f'assets/src/{name}.png').convert('RGB')
    remove(im, session=sess).save(f'assets/src/{name}_rembg.png')
    print(name, 'ok')
