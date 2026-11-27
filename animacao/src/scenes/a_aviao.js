// Plano A (0 → 8.6 s): o avião atravessa o céu puxando a faixa; a câmera dá zoom até a cabine (João piloto, Thor
// atrás), eles acenam, mostram o presente e o bolo e pulam.
(() => {
  const S = 3.0;                    // escala do avião
  const V = 700;                    // velocidade do avião (px/s do mundo)
  const UJ = 44, UT = 52;           // tamanho dos bonecos
  const JUMP = 7.75;                // hora (no plano) em que pulam
  const xp = lt => -1200 + V * lt;  // centro do avião
  const yp = lt => Math.sin(sm(lt) * 2.2) * 18;

  // câmera relativa ao avião: [t, dx, cy, zoom]
  const CAM_KEYS = [
    [0, 2900, 300, .36],
    [1.7, 300, 300, .36],
    [2.9, -3500, 330, .36],
    [4.3, -3700, 330, .36],
    [5.25, -35, -330, 1.55],
    [8.6, -35, -330, 1.55],
  ];

  function aviao(t, lt) {
    const st = sm(lt), x = xp(lt), y = yp(lt);
    const c = kf(lt, CAM_KEYS.map(([k, dx, cy, z]) => [k, [dx, cy, z]]), ease);
    camBegin(x + c[0], c[1], c[2]);
    backdrop(PC.sky, { to: 'rgba(255,250,235,.45)', par: .02 });
    layer(.25, () => { sun(x * .25 + 900, -1300, 220); skyClouds(-3000, -2600, 9000, 2400, 20, 1, { w: 1000, depth: .8 }); });
    layer(.6, () => skyClouds(-4000, -3000, 9000, 2800, 22, 2, { w: 700, depth: 1.1 }));

    // faixa presa ao avião por duas cordas
    const tail = [x - 335 * S, y - 5 * S], bf = [tail[0] - 340, tail[1] + 30];
    const B = banner(bf[0], bf[1], 2.3, 'Parabéns meu bem! ♥ ♥', { len: 1450, h: 175 });
    thread([tail, [B.front[0], B.front[1] - 175 * 2.3 * .45]], { w: 4 });
    thread([tail, [B.front[0], B.front[1] + 175 * 2.3 * .45]], { w: 4 });

    // poses na cabine
    const wave = Math.sin(st * 14) * 22;
    const jumpK = seg(st, JUMP, JUMP + .35);                  // subida para fora da cabine
    const fallK = seg(st, JUMP + .3, JUMP + .8);              // queda para trás e para baixo
    const out = st >= JUMP + .25;                              // já passou da borda: desenha na frente do avião
    let armJ = [-10, 8], armJ2 = [10, 30], tiltJ = 0, holdJ = null, headFlip = false;
    if (st >= 5.0 && st < 6.4) armJ2 = [150 + wave, 25];                       // acena para a câmera
    if (st >= 6.4 && st < 7.0) { armJ2 = [55, 10]; tiltJ = 12; }               // aponta para baixo
    if (st >= 7.0 && st < 7.4) { headFlip = true; tiltJ = -4; }                // olha para o Thor
    if (st >= 7.2) { armJ2 = [140, 30]; armJ = [-140, -30]; holdJ = { prop: 'bigGift', s: .75, dy: -.1 }; }   // mostra o presente
    const preJ = st >= JUMP - .2 && st < JUMP ? .25 : 0;
    const thorBounce = st >= 6.0 && st < 6.5 ? jump(st, 6.0, 6.35, 1.2) : { dy: 0, sq: 0 };

    const people = (front, back) => {
      const dxOut = -fallK * fallK * 900, dyOut = -Math.sin(jumpK * Math.PI / 2) * 150 * (1 - fallK) + fallK * fallK * 1600;
      // Thor no banco de trás
      thor(back[0] + 10 + dxOut * .9, back[1] + 80 + (out ? dyOut : -jumpK * 150) , UT, {
        dy: thorBounce.dy, sq: thorBounce.sq + preJ, armA: st >= 7.2 ? 150 : 95, hold: st >= 7.2 ? { prop: 'cake', s: .62 } : null,
        tilt: st >= 6.4 && st < 7.0 ? 10 : 0, tail: st >= 6.0 ? Math.sin(st * 30) * 30 : undefined, pose: out ? 'hang' : 'sit',
      });
      // João no banco da frente
      joao(front[0] + 10 + dxOut, front[1] + 200 + (out ? dyOut : -jumpK * 150), UJ, {
        view: '3q', armL: armJ, armR: armJ2, holdR: holdJ, tilt: tiltJ, headFlip, sq: preJ, footL: [0, 0], footR: [0, 0],
      });
    };
    plane(x, y, S, {
      inside: (front, back) => {
        if (out) return;
        G.save(); G.beginPath(); G.rect(x - 4000, y - 4000, 8000, 4000 + 30 * S); G.clip();   // pernas ficam dentro da fuselagem
        people(front, back); G.restore();
      },
    });
    if (out) people([x + 45 * S, y - 45 * S], [x - 95 * S, y - 45 * S]);
    if (st >= 6.45 && st < 7.0) emote('!', x + 45 * S + 120, y - 45 * S - 560, 46, st - 6.45);
    if (st >= 6.0 && st < 6.6) emote('heart', x - 95 * S - 60, y - 45 * S - 420, 40, st - 6.0);
    skyClouds(-3000, 1100, 9000, 2400, 8, 3, { w: 900, depth: 2.2 });   // nuvens na frente, abaixo do avião (layer>1 inverte com zoom baixo)
    camEnd();
    sheetIn(seg(st, 0, .5), { dir: 'left' });
  }
  shots([[0, aviao]]);
})();
