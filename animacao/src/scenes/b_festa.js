// Plano B (8.6 s → fim): queda livre, os paraquedas abrem, a câmera desce com eles até o chão onde a Malu espera;
// pousam um de cada lado dela, toca o parabéns, o João entrega o presente.
(() => {
  const UJ = 46, UT = 54, UM = 46;
  const XM = 540, XT = 215, XJ = 870;           // onde cada um fica no chão
  const LAND_T = 5.0, LAND_J = 5.35;             // pousos (tempo do plano)
  const OPEN_J = .55, OPEN_T = .85;              // paraquedas abrem
  const Y0 = -6400;                              // altura do começo (pés)
  const GROUND_CY = -640;                        // câmera parada no chão: chão em y≈1600 na tela
  const WALK0 = 6.3, WALK1 = 7.1, XJ2 = 735;     // João anda até a Malu
  const OFFER = 7.35, HAND = 8.45;               // estende o presente / a Malu pega

  // altura dos pés de quem desce: queda rápida, tranco ao abrir, descida constante e pouso
  function fallY(lt, open, land) {
    if (lt >= land) return 0;
    const yOpen = Y0 + 1300 * open * open;
    if (lt < open) return Y0 + 1300 * lt * lt;
    const k = (lt - open) / (land - open);
    return lerp(yOpen, 0, k * (1.25 - .25 * k));       // desacelera um pouco no fim
  }
  const swayX = (lt, land, ph) => lt < land ? Math.sin(lt * 2.4 + ph) * 40 * clamp(land - lt, 0, 1) : 0;

  function festa(t, lt) {
    const st = sm(lt);
    const yJ = fallY(st, OPEN_J, LAND_J), yT = fallY(st, OPEN_T, LAND_T);
    const follow = Math.min(yJ, yT) - 120;
    // depois do pouso a câmera aproxima (rostos maiores no celular); no fim, mais um pouco na Malu com o presente
    const zc = kf(lt, [[5.7, [1, XM, 0]], [6.8, [1.2, 520, 70]], [13.5, [1.2, 520, 70]], [16.9, [1.36, 560, 120]]], ease);
    camBegin(zc[1], Math.min(follow, GROUND_CY) + zc[2], zc[0]);

    backdrop(PC.sky, { to: 'rgba(255,244,220,.55)', par: .02 });
    layer(.3, () => { sun(900, -2300, 150); skyClouds(-800, -9000, 1900, -2400, 18, 5, { w: 420, depth: .7 }); });
    layer(.7, () => skyClouds(-1200, -9000, 2300, -2200, 14, 6, { w: 560, depth: 1 }));

    // chão: morros, árvores, bandeirinhas e balões
    layer(.55, () => { hills(540, -380, 3200, 160, PC.mint, { seed: 3 }); hills(540, -230, 3200, 120, PC.sage, { seed: 4 }); });
    const tl = tree(-90, -60, 1.25, { seed: 2 }), tr = tree(1180, -50, 1.3, { seed: 3, cols: [PC.forest, PC.leaf, PC.grass] });
    bunting(-40, -1330, 1120, -1300, 11, [PC.red, PC.yellow, PC.teal, PC.pink, PC.blue], { sag: 120 });
    hills(540, 0, 3200, 40, PC.grass, { seed: 7, depth: 1 });
    flower(120, 40, 1.6, PC.pink, { seed: 1 }); flower(980, 60, 1.5, PC.yellow, { seed: 2 }); flower(420, 90, 1.3, PC.lilac, { seed: 3 }); flower(700, 110, 1.4, PC.rose, { seed: 4 });
    [[40, -900, PC.red], [-30, -1000, PC.yellow], [100, -1050, PC.teal]].forEach(([bx, by, col], i) => {
      thread([[60, -40], [bx + sway('bal' + i, 12, .5), by + 70]], { col: '#F4EEE2', w: 3 });
      piece(SH.ellipse(62, 78), { x: bx + sway('bal' + i, 12, .5), y: by, rot: sway('balr' + i, 6, .4), col, depth: 1.8, seed: 8100 + i });
    });

    // ----- MALU -----
    const happy = st >= LAND_J + .3;
    let mArmL = [-12, 8], mArmR = [12, -8], mHold = null, mView = 'front', mJump = { dy: 0, sq: 0 };
    if (st >= 3.4 && st < LAND_T) { mArmR = [150 + Math.sin(st * 14) * 20, 20]; mArmL = [-30, 0]; }          // acena para o céu
    if (st >= WALK1) mView = '3q';
    if (st >= OFFER + .5) mArmR = [kf(st, [[OFFER + .5, 30], [HAND, 72]]), -10];                             // estende a mão
    if (st >= HAND) { mHold = { prop: 'bigGift', s: .75, dy: -.1 }; }
    if (st >= HAND + .4) { mArmR = [150, 25]; mArmL = [-150, -25]; }                                        // levanta o presente
    if (st >= 9.3 && st < 10.0) mJump = jump(st, 9.4, 9.85, 1.3);
    if (st >= 11.5) { const b = Math.abs(Math.sin((st - 11.5) * Math.PI * 176 / 60 / 3 * 3)) ; mJump = { dy: -.35 * b, sq: 0 }; }  // pula no ritmo
    const M = malu(XM + (st >= WALK1 ? -40 : 0), 0, UM, {
      view: mView, armL: mArmL, armR: mArmR, holdR: mHold, dy: mJump.dy, sq: mJump.sq,
      tilt: st < LAND_T ? -8 : 0, holdL: null,
    });
    if (st >= HAND + .3) emote('heart', M.top[0] + 40, M.top[1] - 30, 50, st - HAND - .3);

    // ----- THOR -----
    const xT = XT + swayX(st, LAND_T, 1), tLand = st >= LAND_T;
    const tJ = tLand ? jump(st, LAND_T, LAND_T + .01, 0) : { dy: 0, sq: 0 };
    let thorDy = 0; if (st >= 6.0) thorDy = -Math.abs(Math.sin((st - 6.0) * 4.6)) * .5;
    const thorO = {
      pose: tLand ? 'sit' : 'hang', hold: { prop: 'cake', s: .62 }, armA: 120, sq: tJ.sq, dy: thorDy,
      tail: tLand ? Math.sin(st * 26) * 30 : undefined, tilt: tLand ? 6 : 0,
    };
    const TH = thor(xT, yT, UT, { ...thorO, dry: true });   // só mede: o paraquedas vai atrás do corpo
    if (tLand && st >= LAND_T + .6) deflated(XT - 200, 10, 62, [PC.teal, PC.white, PC.pink]);
    if (!tLand || st < LAND_T + .6) parachute(TH.harness[0], TH.harness[1], 62, seg(st, OPEN_T, OPEN_T + .35), {
      cols: [PC.teal, PC.white, PC.pink, PC.white, PC.teal], seed: 2, sway: tLand ? -40 * seg(st, LAND_T, LAND_T + .6) : Math.sin(st * 2.4 + 1) * 4,
    });
    thor(xT, yT, UT, thorO);

    // ----- JOÃO -----
    const jLand = st >= LAND_J, walking = st >= WALK0 && st < WALK1;
    const wc = walking ? walkCycle(st - WALK0, { rate: 1.6, stride: .7 }) : null;
    let xJ = XJ + swayX(st, LAND_J, 0); if (st >= WALK0) xJ = lerp(XJ, XJ2, seg(st, WALK0, WALK1));
    let jArmR = [140, 30], jArmL = [-140, -30], jHold = { prop: 'bigGift', s: .75, dy: -.1 }, jView = 'front', jFlip = false;
    if (st < OPEN_J) { jArmL = [-120, -20]; }                                                                   // queda: braço aberto
    if (jLand) { jView = '3q'; jFlip = true; jArmR = [60, 40]; jArmL = [-20, 10]; }                            // segura o presente no peito
    if (walking) { jArmL = wc.armL; }
    if (st >= OFFER) jArmR = [kf(st, [[OFFER, 60], [OFFER + .5, 82]]), kf(st, [[OFFER, 40], [OFFER + .5, -6]])]; // oferece
    if (st >= HAND) { jHold = null; jArmR = [kf(st, [[HAND, 80], [HAND + .5, 10]]), 8]; }
    if (st >= HAND + .6) { jArmR = [150 + Math.sin(st * 9) * 10, 20]; jArmL = [-150 - Math.sin(st * 9) * 10, -20]; }   // comemora
    const jSq = jLand && st < LAND_J + .5 ? jump(st, LAND_J, LAND_J + .01, 0).sq : 0;
    const joaoO = {
      view: jView, flip: jFlip, armL: jArmL, armR: jArmR, holdR: jHold, harness: !jLand || st < WALK0, sq: jSq,
      ...(wc ? { footL: wc.footL, footR: wc.footR, dy: wc.dy } : {}), ...(st < LAND_J ? { footL: [-.2, -.15], footR: [.2, -.05] } : {}),
    };
    const J = joao(xJ, yJ, UJ, { ...joaoO, dry: true });
    if (jLand && st >= LAND_J + .6) deflated(XJ + 230, 10, 82, [PC.red, PC.white, PC.yellow]);
    if (!jLand || st < LAND_J + .6) parachute(J.shoulder[1][0] * .5 + J.shoulder[0][0] * .5, (J.shoulder[0][1] + J.shoulder[1][1]) / 2, 82, seg(st, OPEN_J, OPEN_J + .35), {
      seed: 1, sway: jLand ? 40 * seg(st, LAND_J, LAND_J + .6) : Math.sin(st * 2.4) * 4,
    });
    joao(xJ, yJ, UJ, joaoO);

    // confete no pouso e na entrega
    confetti(lt, XM, -820, { t0: LAND_J + .15, n: 60, power: 1.1, seed: 1 });
    confetti(lt, XM + 40, -900, { t0: HAND + .2, n: 70, power: 1.3, seed: 2 });
    if (st >= 13.0) emote('sparkle', XM + 30, -1280, 60, st - 13.0);
    camEnd();
  }
  // o paraquedas murcho caído no chão
  function deflated(x, y, s, cols) {
    cols.forEach((c, i) => piece(SH.smooth([[-1.6 * s, 0, 1], [-1.2 * s, -.55 * s], [0, -.75 * s], [1.3 * s, -.5 * s], [1.7 * s, 0, 1]]), { x: x + (i - 1) * .9 * s, y: y - i * 4, sx: .6, col: c, depth: .8, seed: 8200 + i + s, jit: 0 }));
  }
  shots([[8.6, festa]]);
})();
