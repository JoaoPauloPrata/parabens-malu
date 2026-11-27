// party.js: o elenco e os objetos do vídeo de aniversário da Malu, no estilo recorte de papel (cutout.js + cast.js).
//   joao(x, y, u, o) / malu(x, y, u, o)  bonecos articulados (rig de cast.js) com a cabeça da foto recortada
//   thor(x, y, u, o)                      o pinscher, sentado ou pendurado no paraquedas, segurando o bolo
//   PROPS.cake / PROPS.bigGift            bolo de 26 anos e o presente
//   parachute(x, y, s, k, o)             paraquedas (k = 0 fechado → 1 aberto), (x, y) = ponto do arnês
//   plane(x, y, s, o)                    o aviãozinho de dois lugares, de lado, voando para a direita
//   banner(x, y, s, o)                   a faixa ondulando presa atrás do avião

// ---------- cabeças de foto ----------
// anchor = ponto do pescoço na imagem (0..1); a foto é desenhada para cima a partir dele
const HEAD_META = { joao: { ax: .5, ay: .97 }, thor: { ax: .6, ay: .98 }, malu: { ax: .6, ay: .95 } };
const HEADS = {};
const _setup = ENGINE.setup;
ENGINE.setup = async () => {
  await _setup();
  await Promise.all(Object.entries(window.HEAD_SRC).map(([k, src]) => new Promise((ok, bad) => {
    const img = new Image(); img.onload = () => { HEADS[k] = { img, ...HEAD_META[k] }; ok(); }; img.onerror = bad; img.src = src;
  })));
  await document.fonts.load('700 120px "Fredoka"', 'Parabéns meu bem!');
};
// photoHead(name, x, y, h, { rot, flip, depth }) — (x, y) = pescoço; h = altura da foto em px
function photoHead(name, x, y, h, o = {}) {
  const P = HEADS[name]; if (PAPER.dry || !P) return;
  const w = h * P.img.width / P.img.height, jit = o.jit ?? PAPER.jit, k = PAPER.step * 7.31 + name.length * 3.3;
  G.save(); G.translate(x + (hash(k) - .5) * 2 * jit, y + (hash(k + 1.7) - .5) * 2 * jit);
  G.rotate(((o.rot || 0) + (hash(k + 3.1) - .5) * .5 * jit) * D2R);
  if (o.flip) G.scale(-1, 1);
  setShadow(o.depth ?? 1.4, curScale());
  G.drawImage(P.img, -P.ax * w, -P.ay * h, w, h);
  noShadow(); G.restore();
}

// ---------- cores ----------
const SKIN_J = '#F0C3A2', SKIN_M = '#C68A62', JERSEY = '#F6D02F', JGREEN = '#1F9A57', PANTS = '#2D2B35';
const DRESS = '#E9667F', DRESS2 = '#F7C7CF', HAIR_M = '#3E302B', THOR_BLK = '#25201F', THOR_TAN = '#C98545';

// ---------- JOÃO: camisa da seleção, calça escura, tênis branco ----------
const JOAO = {
  seed: 3000, hipH: 4.3, crouch: 1.6, ankleH: .32, thigh: 2.05, shin: 1.95, legR: [.44, .38, .32], upper: 1.6, fore: 1.5, armR: [.42, .36, .3], handR: .4,
  brad: .12, topR: 5.2, farTint: .12,
  limb: SKIN_J, sleeve: JERSEY, sleeve2: SKIN_J, hand: SKIN_J, leg: PANTS, shoe: '#F3EFE6', restArm: [[-10, 6], [10, -6]],
  foot: [0, 0, .25, -.02], footShape: u => SH.smooth([[-.55 * u, .14 * u], [-.5 * u, -.24 * u], [.3 * u, -.3 * u], [.8 * u, -.04 * u], [.72 * u, .2 * u], [0, .28 * u]]),
  front: { hips: [[-.55, 0], [.55, 0]], feet: [[-.7, 0], [.7, 0]], shoulders: [[-1.35, -4.05], [1.35, -4.05]], neck: [0, -4.75], head: [0, -6.8] },
  '3q': { hips: [[-.25, -.05], [.5, 0]], feet: [[-.4, 0], [.6, 0]], shoulders: [[-.85, -4.1], [1.05, -4.0]], neck: [.12, -4.75], head: [.15, -6.8] },
  face: { turn: 0, mouth: [0, .9] },
  back() {},
  body(u, view, o, S) {
    const q3 = view === '3q', cx = q3 ? .1 : 0, k = q3 ? .9 : 1;
    piece(SH.round(3.0 * u * k, 1.3 * u, .35 * u), { x: cx * u, y: .05 * u, col: PANTS, depth: .9, seed: S + 9 });          // calça (quadril)
    const shirt = SH.smooth([[-1.05 * u, -4.75 * u], [1.05 * u, -4.75 * u], [1.6 * u, -4.2 * u], [1.55 * u, -2.2 * u], [1.6 * u, -.25 * u, 1], [0, -.05 * u], [-1.6 * u, -.25 * u, 1], [-1.55 * u, -2.2 * u], [-1.6 * u, -4.2 * u]]);
    piece(shirt, { x: cx * u, sx: k, col: JERSEY, depth: 1.2, seed: S + 11 });
    const fx = (q3 ? .4 : 0) * u;
    piece(SH.band(.62 * u, .26 * u, 20, 160), { x: fx, y: -4.95 * u, col: JGREEN, depth: .4, seed: S + 12 });                // gola verde
    piece(SH.poly([[-.35 * u, -4.6 * u], [.35 * u, -4.6 * u], [0, -3.95 * u]]), { x: fx, col: JGREEN, depth: .3, seed: S + 13 });
    piece(SH.poly([[-.2 * u, -4.55 * u], [.2 * u, -4.55 * u], [0, -4.15 * u]]), { x: fx, col: SKIN_J, depth: .2, seed: S + 14 });
    // escudo
    piece(SH.smooth([[-.3 * u, -.3 * u, 1], [.3 * u, -.3 * u, 1], [.28 * u, .1 * u], [0, .38 * u, 1], [-.28 * u, .1 * u]]), { x: fx + .72 * u, y: -3.3 * u, col: '#2F5BA8', depth: .3, seed: S + 15 });
    piece(SH.star(.13 * u), { x: fx + .72 * u, y: -3.3 * u, col: PC.yellow, depth: .1, seed: S + 16 });
    piece(SH.rect(2.9 * u * k, .2 * u), { x: cx * u, y: -.2 * u, col: JGREEN, depth: .3, seed: S + 17 });                      // barra
    if (o.harness) {   // arnês do paraquedas
      [-1, 1].forEach((sd, i) => piece(SH.rect(.22 * u, 4.4 * u), { x: cx * u + sd * .8 * u, y: -2.4 * u, rot: sd * -4, col: '#3B3F4A', depth: .4, seed: S + 18 + i }));
      piece(SH.rect(2.6 * u * k, .25 * u), { x: cx * u, y: -2.2 * u, col: '#3B3F4A', depth: .4, seed: S + 20 });
      brad(cx * u, -2.2 * u, .2 * u);
    }
  },
  head(u, view, o, S) {
    photoHead('joao', 0, (JOAO.front.neck[1] - JOAO.front.head[1]) * u + .35 * u, 5.0 * u, { flip: o.headFlip });
  },
};
function joao(x, y, u, o = {}) { return puppet(JOAO, x, y, u, o); }

// ---------- MALU: vestido rosa de bolinhas, cabelo cacheado (a foto) caindo nos ombros ----------
const MALU = {
  seed: 4000, hipH: 4.35, crouch: 1.6, ankleH: .3, thigh: 2.1, shin: 2.0, legR: [.34, .3, .25], upper: 1.6, fore: 1.45, armR: [.32, .28, .24], handR: .35,
  brad: .11, topR: 5.2, farTint: .12,
  limb: SKIN_M, sleeve: SKIN_M, hand: SKIN_M, leg: SKIN_M, shoe: '#E3B04B', restArm: [[-12, 8], [12, -8]],
  foot: [0, 0, .25, -.02], footShape: u => SH.smooth([[-.5 * u, .12 * u], [-.45 * u, -.2 * u], [.3 * u, -.24 * u], [.7 * u, -.02 * u], [.62 * u, .18 * u], [0, .24 * u]]),
  front: { hips: [[-.45, 0], [.45, 0]], feet: [[-.55, 0], [.55, 0]], shoulders: [[-1.12, -4.0], [1.12, -4.0]], neck: [0, -4.6], head: [0, -6.6] },
  '3q': { hips: [[-.2, -.05], [.4, 0]], feet: [[-.3, 0], [.5, 0]], shoulders: [[-.75, -4.05], [.95, -3.95]], neck: [.12, -4.6], head: [.15, -6.6] },
  face: { turn: 0, mouth: [0, .9] },
  back(u, view, o, S) {   // cachos caindo atrás dos ombros (continuação do cabelo da foto)
    const cx = view === '3q' ? -.3 : 0;
    piece(SH.blob(1.95 * u, 11, .1, 41), { x: (cx - .25) * u, y: -4.1 * u, sy: 1.05, col: HAIR_M, depth: 1, seed: S + 1 });
    piece(SH.blob(1.0 * u, 9, .14, 42), { x: (cx - 1.4) * u, y: -2.9 * u, col: mixCol(HAIR_M, '#8C7A6E', .3), depth: .8, seed: S + 2 });
    piece(SH.blob(.8 * u, 9, .14, 43), { x: (cx + 1.25) * u, y: -3.2 * u, col: HAIR_M, depth: .8, seed: S + 3 });
  },
  body(u, view, o, S) {
    const q3 = view === '3q', cx = q3 ? .08 : 0, k = q3 ? .92 : 1;
    piece(SH.capsule(.8 * u, .32 * u), { x: cx * u, y: -5.1 * u, col: mixCol(SKIN_M, '#000000', .06), depth: .4, seed: S + 10 });   // pescoço
    const dress = SH.smooth([[-1.0 * u, -4.55 * u], [1.0 * u, -4.55 * u], [1.3 * u, -3.8 * u], [1.05 * u, -2.1 * u], [2.15 * u, 1.65 * u, 1], [0, 1.85 * u], [-2.15 * u, 1.65 * u, 1], [-1.05 * u, -2.1 * u], [-1.3 * u, -3.8 * u]]);
    piece(dress, { x: cx * u, sx: k, col: DRESS, depth: 1.2, seed: S + 11 });
    piece(SH.round(2.4 * u * k, .32 * u, .15 * u), { x: cx * u, y: -2.05 * u, col: DRESS2, depth: .4, seed: S + 12 });             // faixa na cintura
    piece(SH.ellipse(.32 * u, .22 * u), { x: (cx + .55) * u, y: -2.1 * u, rot: 20, col: DRESS2, depth: .5, seed: S + 13 });           // laço
    piece(SH.ellipse(.32 * u, .22 * u), { x: (cx + .95) * u, y: -2.1 * u, rot: -20, col: DRESS2, depth: .5, seed: S + 14 });
    const q = rnd('dots');   // bolinhas
    for (let i = 0; i < 16; i++) { const t = q(), yy = lerp(-1.6, 1.4, q()), half = lerp(1.05, 2.0, (yy + 1.6) / 3) * .85; piece(SH.circle(.13 * u), { x: (cx + (t - .5) * 2 * half) * u, y: yy * u, col: PC.white, mat: 'card', depth: .15, seed: S + 20 + i }); }
    for (let i = 0; i < 4; i++) piece(SH.circle(.12 * u), { x: (cx + (i - 1.5) * .55) * u, y: (-3.4 + (i % 2) * .5) * u, col: PC.white, mat: 'card', depth: .15, seed: S + 40 + i });
  },
  head(u, view, o, S) {
    photoHead('malu', 0, (MALU.front.neck[1] - MALU.front.head[1]) * u + .4 * u, 5.6 * u, { flip: o.headFlip });
  },
};
function malu(x, y, u, o = {}) { return puppet(MALU, x, y, u, o); }

// ---------- THOR: pinscher preto e caramelo, de pé nas patas de trás (pose de "pedir") ----------
// thor(x, y, u, { pose: 'sit' | 'hang', flip, hold, armA, tail, tilt, dy, sq, jit, dry })
//   desenhado olhando para a DIREITA (a foto é espelhada); flip:true olha para a esquerda (foto original).
//   (x, y) = chão. Retorna { head, top, paw, neck }.
function thor(x, y, u, o = {}) {
  const f = o.flip ? -1 : 1, oy = y + (o.dy || 0) * u, sq = o.sq || 0, hang = o.pose === 'hang', S = 5000 + (o.seed || 0);
  const savedJ = PAPER.jit, savedD = PAPER.dry; PAPER.jit = o.jit ?? Math.min(2, u / 40); if (o.dry) PAPER.dry = true;
  G.save(); G.translate(x, oy); G.scale(f, 1); G.scale(1 + .2 * sq, 1 - .2 * sq);
  const wag = o.tail ?? sway('thortail', 22, 2.2);
  // rabo (atrás de tudo)
  piece(SH.capsule(1.3 * u, .2 * u, .12 * u), { x: -1.05 * u, y: -1.3 * u, rot: 150 + wag, col: THOR_BLK, depth: 1, seed: S + 1 });
  // patas traseiras
  if (hang) {
    [-1, 1].forEach((sd, i) => {
      const sw = sway('thorleg' + i, 10, 1.1);
      piece(SH.capsule(1.3 * u, .3 * u, .22 * u), { x: (-.35 + sd * .35) * u, y: -1.2 * u, rot: sw + sd * 6, col: i ? THOR_BLK : mixCol(THOR_BLK, '#000', .2), depth: 1, seed: S + 2 + i });
      piece(SH.ellipse(.3 * u, .2 * u), { x: (-.35 + sd * .35) * u - Math.sin(sw * D2R) * 1.3 * u, y: .1 * u, col: THOR_TAN, depth: .8, seed: S + 4 + i });
    });
  } else {
    piece(SH.ellipse(1.15 * u, .95 * u), { x: -.35 * u, y: -.95 * u, col: THOR_BLK, depth: 1, seed: S + 6 });     // coxa
    piece(SH.ellipse(.75 * u, .25 * u), { x: .2 * u, y: -.18 * u, col: THOR_TAN, depth: .9, seed: S + 7 });       // pé
  }
  // tronco em pé + peito caramelo
  piece(SH.smooth([[-.8 * u, -.6 * u], [-.95 * u, -2.2 * u], [-.4 * u, -3.6 * u], [.45 * u, -3.7 * u], [.85 * u, -2.6 * u], [.75 * u, -.8 * u], [0, -.35 * u]]), { col: THOR_BLK, depth: 1.2, seed: S + 8 });
  piece(SH.smooth([[.0, -1.0 * u], [-.1 * u, -2.6 * u], [.3 * u, -3.4 * u], [.7 * u, -2.6 * u], [.55 * u, -1.1 * u]]), { col: THOR_TAN, depth: .4, seed: S + 9 });
  piece(SH.round(1.45 * u, .32 * u, .15 * u), { x: .05 * u, y: -3.45 * u, rot: -6, col: PC.yellow, depth: .5, seed: S + 10 });   // coleira amarela
  brad(.55 * u, -3.4 * u, .12 * u);
  // cabeça (foto espelhada → olha para a direita)
  const neck = [.2 * u, -3.3 * u], tilt = o.tilt || 0;
  photoHead('thor', neck[0], neck[1], 3.7 * u, { flip: true, rot: tilt, depth: 1.4 });
  // patas da frente (por cima do peito), segurando o que tiver
  const a = o.armA ?? 70, sh = [.35 * u, -2.9 * u], d = dirOf(a), paw = [sh[0] + d[0] * 1.5 * u, sh[1] + d[1] * 1.5 * u];
  if (o.hold) { G.save(); G.scale(f, 1); G.translate(paw[0] * f, paw[1]); drawHold(o.hold, 0, 0, 0, u); G.restore(); }
  [0, 1].forEach(i => {
    const off = i ? .3 * u : -.15 * u;
    piece(SH.capsule(1.5 * u, .22 * u, .2 * u), { x: sh[0] + off, y: sh[1], rot: -a, col: i ? THOR_BLK : mixCol(THOR_BLK, '#000', .25), depth: 1, seed: S + 11 + i });
    piece(SH.ellipse(.26 * u, .22 * u), { x: paw[0] + off, y: paw[1], col: THOR_TAN, depth: .9, seed: S + 13 + i });
  });
  G.restore(); PAPER.jit = savedJ; PAPER.dry = savedD;
  const W2 = (px, py) => [x + f * px, oy + py];
  return { neck: W2(...neck), head: W2(neck[0] + .1 * u, neck[1] - 1.7 * u), top: W2(neck[0], neck[1] - 3.8 * u), paw: W2(...paw), harness: W2(0, -3.1 * u) };
}

// ---------- props ----------
// bolo de aniversário com velas "2" e "6"; (x, y) = base do prato
PROPS.cake = (x, y, ang = 0, s = 30) => {
  G.save(); G.translate(x, y); G.rotate(ang * D2R);
  piece(SH.ellipse(1.7 * s, .3 * s), { y: .05 * s, col: PC.white, mat: 'card', depth: 1, seed: 6001 });                         // prato
  piece(SH.round(2.6 * s, 1.5 * s, .2 * s), { y: -.75 * s, col: '#F3D9B1', depth: 1, seed: 6002 });                            // massa
  piece(SH.rect(2.6 * s, .22 * s), { y: -.75 * s, col: '#C9774B', depth: .2, seed: 6003 });                                      // recheio
  const drip = [[-1.38 * s, -1.6 * s, 1], [1.38 * s, -1.6 * s, 1], [1.38 * s, -1.1 * s]];
  for (let i = 6; i >= 0; i--) { const xx = -1.3 * s + 2.6 * s * i / 6; drip.push([xx, (i % 2 ? -.95 : -1.2) * s]); }
  drip.push([-1.38 * s, -1.1 * s]);
  piece(SH.smooth(drip), { col: PC.pink, depth: .6, seed: 6004 });                                                                 // cobertura
  const q = rnd('granulado'); for (let i = 0; i < 10; i++) piece(SH.rect(.18 * s, .06 * s), { x: (q() - .5) * 2.2 * s, y: (-.25 - q() * .5) * s, rot: q() * 180, col: [PC.blue, PC.yellow, PC.teal, PC.red][i % 4], depth: .1, seed: 6010 + i, edge: false });
  // velas-número
  ['2', '6'].forEach((ch, i) => {
    const cx = (i ? .45 : -.45) * s, cy = -2.15 * s, fs = 1.05 * s;
    G.save(); G.font = `700 ${fs}px "Fredoka", sans-serif`; G.textAlign = 'center'; G.textBaseline = 'middle'; G.lineJoin = 'round';
    setShadow(.8, curScale()); G.lineWidth = .16 * s; G.strokeStyle = PC.white; G.strokeText(ch, cx, cy); G.fillStyle = PC.white; G.fillText(ch, cx, cy); noShadow();
    G.fillStyle = mat(i ? PC.teal : PC.violet, 'paper'); G.fillText(ch, cx, cy); G.restore();
    piece(SH.rect(.05 * s, .22 * s), { x: cx, y: cy - .6 * s, col: PC.ink, depth: .2, seed: 6020 + i, edge: false });             // pavio
    const fl = 1 + .18 * Math.sin(PAPER.step * 2.1 + i * 2), lean = Math.sin(PAPER.step * 1.3 + i) * 8;
    piece(SH.drop(.2 * s), { x: cx, y: cy - .86 * s, sy: fl, rot: lean, col: PC.orange, depth: .6, seed: 6022 + i, jit: 0 });
    piece(SH.drop(.11 * s), { x: cx, y: cy - .8 * s, sy: fl, rot: lean, col: PC.lemon, depth: .1, seed: 6024 + i, jit: 0 });
  });
  G.restore();
};
// presente grande: caixa vermelha, fita dourada e laço; (x, y) = onde a mão segura (embaixo do centro)
PROPS.bigGift = (x, y, ang = 0, s = 30) => {
  G.save(); G.translate(x, y); G.rotate(ang * D2R);
  piece(SH.rect(2.1 * s, 1.75 * s), { y: -.75 * s, col: PC.red, depth: 1.1, seed: 6101 });
  piece(SH.rect(2.3 * s, .5 * s), { y: -1.62 * s, col: PC.tomato, depth: .7, seed: 6102 });                                       // tampa
  piece(SH.rect(.36 * s, 2.25 * s), { y: -.85 * s, col: PC.mustard, depth: .3, seed: 6103 });
  piece(SH.ellipse(.55 * s, .32 * s), { x: -.42 * s, y: -2.05 * s, rot: 25, col: PC.mustard, depth: .7, seed: 6104 });
  piece(SH.ellipse(.55 * s, .32 * s), { x: .42 * s, y: -2.05 * s, rot: -25, col: PC.mustard, depth: .7, seed: 6105 });
  piece(SH.circle(.2 * s), { y: -1.95 * s, col: PC.yellow, depth: .8, seed: 6106 });
  piece(SH.heart(.7 * s), { y: -.6 * s, col: PC.white, mat: 'card', depth: .3, seed: 6107 });
  G.restore();
};

// ---------- paraquedas ----------
// parachute(x, y, s, k, { cols, seed, sway }) — (x, y) = arnês; k 0..1 abre (com um pequeno exagero no meio)
function parachute(x, y, s, k, o = {}) {
  if (k <= 0) return;
  const cols = o.cols || [PC.red, PC.white, PC.yellow, PC.white, PC.blue], n = cols.length, seed = o.seed || 1, R = 3.2 * s, top = y - 6.2 * s;
  const open = k < 1 ? backOut(k) : 1, sx = lerp(.15, 1, open), sy = lerp(.6, 1, open), rot = o.sway ?? 0;
  G.save(); G.translate(x, y); G.rotate(rot * D2R); G.translate(-x, -y);
  // cordas do arnês até a borda da cúpula
  const edge = []; for (let i = 0; i <= n; i++) edge.push([x + (-1 + 2 * i / n) * R * sx * .98, top + R * .2 * sy]);
  edge.forEach(p => thread([[x, y], p], { col: 'rgba(250,246,236,.95)', w: Math.max(1.5, s * .05) }));
  G.save(); G.translate(x, top); G.scale(sx, sy);
  for (let i = 0; i < n; i++) {   // gomos da cúpula
    const a0 = Math.PI + Math.PI * i / n, a1 = Math.PI + Math.PI * (i + 1) / n, pts = [];
    for (let j = 0; j <= 8; j++) { const a = lerp(a0, a1, j / 8); pts.push([Math.cos(a) * R, Math.sin(a) * R * .72]); }
    const xr = Math.cos(a1) * R, xl = Math.cos(a0) * R;
    for (let j = 1; j < 8; j++) { const xx = lerp(xr, xl, j / 8); pts.push([xx, R * .2 + Math.sin(j / 8 * Math.PI) * R * .1]); }
    pts.push([xl, R * .2]);
    piece(SH.poly(pts, `chute${f1(R)},${i},${n}`), { col: cols[i], depth: 1.4, seed: seed * 50 + i });
  }
  G.restore(); G.restore();
}

// ---------- avião (de lado, nariz para a direita) ----------
// plane(x, y, s, { inside: fn }) — (x, y) = centro da fuselagem; s = escala (s=1 → ~600 px de comprimento).
// inside(x, y, s) desenha quem está sentado (é coberto pela fuselagem abaixo da borda da cabine).
// Retorna { tail, seatFront, seatBack } em px do mundo.
const PLANE = { body: PC.orange, stripe: PC.red, wing: PC.yellow, wing2: PC.mustard };
function plane(x, y, s, o = {}) {
  const P = (sh, op) => piece(sh, { x, y, jit: 0, ...op });
  const L = (pts) => pts.map(([a, b, c]) => [a * s, b * s, c]);
  // asa de trás (aparece por cima da fuselagem)
  P(SH.smooth(L([[-40, -30], [70, -150], [130, -160], [110, -40]])), { col: PLANE.wing2, depth: .8, seed: 7001 });
  // estabilizador de trás
  P(SH.smooth(L([[-300, -20], [-250, -70], [-215, -68], [-235, -15]])), { col: mixCol(PLANE.body, '#000', .15), depth: .6, seed: 7002 });
  // quem está na cabine
  const seatFront = [x + 45 * s, y - 45 * s], seatBack = [x - 95 * s, y - 45 * s];
  if (o.inside) o.inside(seatFront, seatBack, s);
  // leme
  P(SH.smooth(L([[-330, -20, 1], [-345, -140], [-300, -150], [-230, -35]])), { col: PLANE.body, depth: 1, seed: 7003 });
  P(SH.smooth(L([[-338, -95], [-344, -138], [-300, -148], [-284, -105]])), { col: PLANE.stripe, depth: .3, seed: 7004 });
  // fuselagem
  P(SH.smooth(L([[250, -40], [270, 0], [250, 45], [100, 62], [-120, 48], [-330, 10, 1], [-330, -25, 1], [-120, -48], [60, -55]])), { col: PLANE.body, depth: 1.2, seed: 7005 });
  P(SH.round(28 * s, 112 * s, 12 * s), { x: x + 190 * s, y: y + 3 * s, col: PLANE.stripe, depth: .3, seed: 7006 });           // faixa
  P(SH.smooth(L([[-330, -4], [-120, 2], [120, 8], [240, 12], [230, 30], [100, 40], [-120, 30], [-328, 6]])), { col: mixCol(PLANE.body, PLANE.stripe, .35), depth: .2, seed: 7007 });   // friso
  // bordas das cabines + para-brisas
  [seatFront, seatBack].forEach(([cx], i) => {
    P(SH.round(120 * s, 14 * s, 7 * s), { x: cx, y: y - 49 * s, col: PC.bark, mat: 'kraft', depth: .5, seed: 7010 + i });
    P(SH.poly(L([[0, 0], [10, -48], [32, -48], [40, 0]])), { x: cx + 50 * s, y: y - 52 * s, col: '#CFEAF7', mat: 'tissue', depth: .5, seed: 7012 + i });
  });
  // nariz: capô vermelho, cone e hélice
  P(SH.smooth(L([[210, -42], [262, -38], [292, 0], [262, 40], [210, 46]])), { col: PLANE.stripe, depth: 1, seed: 7020 });
  P(SH.smooth(L([[288, -18], [318, 0], [288, 18]])), { col: PC.silver, mat: 'card', depth: 1.2, seed: 7021 });
  const ph = PAPER.step % 3;
  P(SH.ellipse(9 * s, 120 * s), { x: x + 312 * s, col: PC.silver, mat: 'tissue', depth: .2, seed: 7022, alpha: .6 });          // disco de movimento
  P(SH.round(14 * s, 220 * s * [1, .45, .8][ph], 7 * s), { x: x + 312 * s, col: PC.bark, mat: 'wood', depth: 1.4, seed: 7023 + ph });
  // trem de pouso
  [[60, 1], [-40, 0]].forEach(([wx, i]) => {
    P(SH.rect(10 * s, 70 * s), { x: x + wx * s, y: y + 80 * s, rot: i ? 14 : -14, col: PC.charcoal, depth: .6, seed: 7030 + i });
    P(SH.circle(28 * s), { x: x + wx * s + (i ? -8 : 8) * s, y: y + 115 * s, col: PC.ink, depth: 1, seed: 7032 + i });
    P(SH.circle(11 * s), { x: x + wx * s + (i ? -8 : 8) * s, y: y + 115 * s, col: PC.silver, mat: 'card', depth: .3, seed: 7034 + i });
  });
  // asa da frente (por baixo, por cima de tudo)
  P(SH.smooth(L([[-30, 20], [130, 18], [175, 40], [120, 120], [40, 128]])), { col: PLANE.wing, depth: 1.5, seed: 7040 });
  P(SH.circle(16 * s), { x: x + 110 * s, y: y + 80 * s, col: PC.red, depth: .3, seed: 7041 });
  return { tail: [x - 335 * s, y - 5 * s], seatFront, seatBack };
}

// ---------- faixa ----------
// banner(x, y, s, text, o) — (x, y) = borda da FRENTE da faixa (presa ao avião, que fica à direita); ela se estende para a esquerda
function banner(x, y, s, text, o = {}) {
  const len = (o.len || 1400) * s, h = (o.h || 170) * s, n = 28, sw = len / n, st = sm(T) * 9;
  const wave = xx => Math.sin(st - xx / (260 * s)) * 16 * s * (.4 + .6 * (xx / len));   // ondula mais na ponta
  // haste e cordas
  piece(SH.rect(10 * s, h * 1.15), { x: x + 6 * s, y: y + wave(0), col: PC.kraft, mat: 'kraft', depth: 1, seed: 7101, jit: 0 });
  for (let i = 0; i < n; i++) {
    const xx = (i + .5) * sw, dy = wave(xx), rot = (wave(xx + sw / 2) - wave(xx - sw / 2)) / sw / D2R;
    const last = i === n - 1;
    const sh = last ? SH.poly([[-sw / 2 - 1, -h / 2], [sw / 2 + sw * .4, -h / 2], [sw * .1, 0], [sw / 2 + sw * .4, h / 2], [-sw / 2 - 1, h / 2]], 'bannerEnd' + f1(sw) + f1(h)) : SH.rect(sw + 2, h);
    piece(sh, { x: x - xx, y: y + dy, rot: -rot, col: PC.white, mat: 'card', depth: 1.2, seed: 7110 + i, jit: 0, edge: i === 0 || last });
  }
  // texto: cada letra recortada em papel vermelho, acompanhando a onda (a faixa vai para a esquerda, o texto lê da esquerda)
  const fs = h * .62; G.save(); G.font = `700 ${fs}px "Fredoka", sans-serif`; G.textAlign = 'center'; G.textBaseline = 'middle';
  const chars = [...text], widths = chars.map(c => c === '♥' ? fs * .95 : G.measureText(c).width), tot = widths.reduce((a, b) => a + b, 0);
  let cx = x - len / 2 - tot / 2 - (o.textShift || 0) * s;
  chars.forEach((c, i) => {
    const mid = cx + widths[i] / 2; cx += widths[i]; if (c === ' ') return;
    const xx = x - mid, dy = wave(xx), rot = (wave(xx + 6) - wave(xx - 6)) / 12 / D2R;
    if (c === '♥') { piece(SH.heart(fs * .78), { x: mid, y: y + dy, rot: -rot, col: PC.red, depth: .5, seed: 7200 + i, jit: 0 }); return; }
    G.save(); G.translate(mid, y + dy); G.rotate(-rot * D2R);
    setShadow(.5, curScale()); G.fillStyle = mat(i % 2 ? PC.red : PC.tomato, 'paper'); G.fillText(c, 0, fs * .04); noShadow();
    G.restore();
  });
  G.restore();
  return { front: [x + 6 * s, y + wave(0)] };
}

// ---------- céu ----------
// nuvens espalhadas num retângulo do mundo, determinísticas
function skyClouds(x0, y0, x1, y1, n, seed, o = {}) {
  const q = rnd('clouds' + seed);
  for (let i = 0; i < n; i++) cloud(lerp(x0, x1, q()), lerp(y0, y1, q()), (o.w || 300) * (.6 + q() * .8), { seed: seed * 100 + i, depth: o.depth ?? 1.4, bob: .6 });
}
