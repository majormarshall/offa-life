import * as THREE from 'three';
import { Character3D } from './Character3D';

// ─────────────────────────────────────────────────────────────────────────────
// PROCEDURAL TEXTURE HELPERS — Nigerian building materials (no external images)
// ─────────────────────────────────────────────────────────────────────────────

function makeCanvas(w = 256, h = 256) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

/** Nigerian red-clay / cement-block brick wall */
function brickTexture(wallColor = '#c1440e', mortarColor = '#d4bba0', rows = 10, cols = 6) {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d');
  ctx.fillStyle = mortarColor;
  ctx.fillRect(0, 0, 512, 512);
  const bH = 512 / rows;
  const bW = 512 / cols;
  for (let r = 0; r < rows; r++) {
    const offset = r % 2 === 0 ? 0 : bW / 2;
    for (let cc = -1; cc <= cols; cc++) {
      const x = cc * bW + offset + 3;
      const y = r * bH + 3;
      const lightness = 35 + Math.random() * 8;
      ctx.fillStyle = `hsl(15,${55 + Math.random() * 10}%,${lightness}%)`;
      ctx.fillRect(x, y, bW - 6, bH - 6);
    }
  }
  return new THREE.CanvasTexture(c);
}

/** Cement / concrete block (grey finish, common Nigerian wall) */
function cementBlockTexture(color = '#9ca3af') {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#6b7280';
  ctx.lineWidth = 2;
  for (let y = 0; y <= 256; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
  }
  for (let row = 0; row < 8; row++) {
    const offset = row % 2 === 0 ? 0 : 16;
    for (let x = offset; x <= 256; x += 32) {
      ctx.beginPath(); ctx.moveTo(x, row * 32); ctx.lineTo(x, (row + 1) * 32); ctx.stroke();
    }
  }
  return new THREE.CanvasTexture(c);
}

/** Corrugated iron zinc roof */
function zincRoofTexture() {
  const c = makeCanvas(256, 128);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#6b7280';
  ctx.fillRect(0, 0, 256, 128);
  for (let x = 0; x < 256; x += 8) {
    ctx.fillStyle = x % 16 < 8 ? '#9ca3af' : '#4b5563';
    ctx.fillRect(x, 0, 8, 128);
  }
  ctx.fillStyle = 'rgba(160,60,10,0.25)';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(Math.random() * 256, 0, 2 + Math.random() * 3, 128);
  }
  return new THREE.CanvasTexture(c);
}

/** Terracotta / palace mud-clay finish */
function terracottaTexture() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#c2703a';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(100,30,5,0.35)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 30; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * 256, Math.random() * 256);
    ctx.bezierCurveTo(
      Math.random() * 256, Math.random() * 256,
      Math.random() * 256, Math.random() * 256,
      Math.random() * 256, Math.random() * 256
    );
    ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

/** Institutional blue/white rendered wall (FedPoly) */
function institutionalTexture() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#bfdbfe';
  for (let r = 0; r < 4; r++) {
    for (let cc = 0; cc < 4; cc++) {
      ctx.fillRect(20 + cc * 60, 20 + r * 60, 36, 36);
    }
  }
  return new THREE.CanvasTexture(c);
}

/** Painted house facade — white + coloured skirting */
function paintedHouseTexture(wallHex = '#f3f4f6', skirtHex = '#065f46') {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = wallHex;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = skirtHex;
  ctx.fillRect(0, 200, 256, 56);
  ctx.fillStyle = '#93c5fd';
  ctx.fillRect(40, 60, 60, 80);
  ctx.fillRect(156, 60, 60, 80);
  ctx.fillStyle = '#78350f';
  ctx.fillRect(98, 140, 60, 116);
  return new THREE.CanvasTexture(c);
}

/** Dark obsidian nightclub facade with neon stripe */
function nightclubTexture() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#090d16';
  ctx.fillRect(0, 0, 256, 256);
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0, 'rgba(236,72,153,0.9)');
  grad.addColorStop(0.5, 'rgba(6,182,212,0.6)');
  grad.addColorStop(1, 'rgba(168,85,247,0.9)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 12);
  ctx.fillRect(0, 244, 256, 12);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(i * 32, 16, 28, 228);
  }
  return new THREE.CanvasTexture(c);
}

/** Signboard texture with text */
function signTexture(text, bgColor = '#dc2626', textColor = '#ffffff') {
  const c = makeCanvas(256, 64);
  const ctx = c.getContext('2d');
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = textColor;
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 128, 32);
  return new THREE.CanvasTexture(c);
}

/** Lush Nigerian green ground / grass patches */
function grassTexture() {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#166534';
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 1;
  for (let i = 0; i < 120; i++) {
    const x = Math.random() * 256, y = Math.random() * 256;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (Math.random() - 0.5) * 8, y - 8 - Math.random() * 8);
    ctx.stroke();
  }
  return new THREE.CanvasTexture(c);
}

/** Asphalt / dirt road ground */
function roadTexture() {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#1c1917';
  ctx.fillRect(0, 0, 512, 512);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * 512, Math.random() * 512, 4 + Math.random() * 8, 2 + Math.random() * 4, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  return new THREE.CanvasTexture(c);
}

// ─────────────────────────────────────────────────────────────────────────────
// WORLD3D
// ─────────────────────────────────────────────────────────────────────────────

export class World3D {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.npcs = [];
    this.enemies = [];
    this.interactiveZones = [];
    this.discoTiles = [];
    this.spotlights = [];
    this.clouds = [];
    this.birds = [];
    this.palmTrunks = [];
    this.streetLights = [];

    // Pre-build shared textures
    this.textures = {
      grass: grassTexture(),
      road: roadTexture(),
      zinc: zincRoofTexture(),
      terracotta: terracottaTexture(),
      institutional: institutionalTexture(),
      cement: cementBlockTexture(),
      nightclub: nightclubTexture(),
    };

    this.buildTerrain();
    this.buildRoads();
    this.buildBuildings();
    this.buildNightclub();
    this.buildFlora();
    this.buildAtmosphere();
    this.buildStreetLights();
    this.spawnNPCsAndEnemies();
    this.spawnVehicles();
  }

  // ── TERRAIN ─────────────────────────────────────────────────────────────────

  buildTerrain() {
    const t = this.textures.grass;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(14, 14);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220),
      new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  // ── ROADS ───────────────────────────────────────────────────────────────────

  buildRoads() {
    const rt = this.textures.road;
    rt.wrapS = rt.wrapT = THREE.RepeatWrapping;
    rt.repeat.set(22, 2);
    const roadMat = new THREE.MeshStandardMaterial({ map: rt, roughness: 0.85 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // Olofa Way Expressway (horizontal)
    const main = new THREE.Mesh(new THREE.PlaneGeometry(220, 17), roadMat);
    main.rotation.x = -Math.PI / 2;
    main.position.set(0, 0.05, 0);
    main.receiveShadow = true;
    this.scene.add(main);

    // Adeleke Avenue (vertical)
    const rt2 = this.textures.road.clone();
    rt2.wrapS = rt2.wrapT = THREE.RepeatWrapping;
    rt2.repeat.set(2, 22);
    const ave = new THREE.Mesh(new THREE.PlaneGeometry(17, 220), new THREE.MeshStandardMaterial({ map: rt2, roughness: 0.85 }));
    ave.rotation.x = -Math.PI / 2;
    ave.position.set(0, 0.05, 0);
    ave.receiveShadow = true;
    this.scene.add(ave);

    // Centre dashes
    for (let x = -100; x < 100; x += 8) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.5), lineMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.06, 0);
      this.scene.add(dash);
    }
    for (let z = -100; z < 100; z += 8) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4), lineMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.06, z);
      this.scene.add(dash);
    }

    // Side dirt paths
    const dirtMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.95 });
    [-26, 26].forEach((zo) => {
      const d = new THREE.Mesh(new THREE.PlaneGeometry(220, 3.5), dirtMat);
      d.rotation.x = -Math.PI / 2;
      d.position.set(0, 0.055, zo);
      this.scene.add(d);
    });
  }

  // ── BUILDINGS ───────────────────────────────────────────────────────────────

  buildBuildings() {
    this.createPalace(0, 52);
    this.createMarket(-38, 22);
    this.createCombatArena(0, -25);
    this.createFedPoly(40, 22);
    this.createRailwayStation(-42, -50);
    this.createArmouryHome(28, -30);
    this.createFarmland(-45, 52);
    this.createNeighbourhoodHouses();
  }

  createNeighbourhoodHouses() {
    const defs = [
      { x: 20,  z: 40,  skirt: '#065f46' },
      { x: -20, z: -40, skirt: '#7c3aed' },
      { x: 55,  z: -20, skirt: '#dc2626' },
      { x: -55, z: 30,  skirt: '#0369a1' },
      { x: 60,  z: -50, skirt: '#b45309' },
      { x: -65, z: -25, skirt: '#1d4ed8' },
      { x: 35,  z: -60, skirt: '#6d28d9' },
      { x: -30, z: -55, skirt: '#be123c' },
    ];
    defs.forEach(({ x, z, skirt }) => {
      const houseTex = paintedHouseTexture('#f9fafb', skirt);
      const wallMat = new THREE.MeshStandardMaterial({ map: houseTex });
      const roofMat = new THREE.MeshStandardMaterial({ map: this.textures.zinc });
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);

      const body = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 6), wallMat);
      body.position.y = 2.25;
      body.castShadow = true;
      body.receiveShadow = true;
      grp.add(body);

      const roof = new THREE.Mesh(new THREE.BoxGeometry(9, 0.4, 7), roofMat);
      roof.position.y = 4.65;
      grp.add(roof);

      // Low compound fence
      const fMat = new THREE.MeshStandardMaterial({ color: 0xe5e7eb });
      for (let f = -4; f <= 4; f += 2) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.2), fMat);
        post.position.set(f, 0.6, 3.5);
        grp.add(post);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.1), fMat);
        rail.position.set(f + 1, 1.1, 3.5);
        grp.add(rail);
      }

      this.scene.add(grp);
    });
  }

  createPalace(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    const terraTex = this.textures.terracotta;
    terraTex.wrapS = terraTex.wrapT = THREE.RepeatWrapping;
    terraTex.repeat.set(3, 2);
    const wallMat = new THREE.MeshStandardMaterial({ map: terraTex, roughness: 0.5 });

    const palace = new THREE.Mesh(new THREE.BoxGeometry(26, 11, 18), wallMat);
    palace.position.y = 5.5;
    palace.castShadow = true;
    grp.add(palace);

    // Pyramid roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(18, 7, 4), new THREE.MeshStandardMaterial({ map: this.textures.terracotta, roughness: 0.4 }));
    roof.position.y = 14;
    roof.rotation.y = Math.PI / 4;
    grp.add(roof);

    // Pillars along front
    const pillarMat = new THREE.MeshStandardMaterial({ color: 0xd4bba0, roughness: 0.6 });
    for (let i = -4; i <= 4; i += 2) {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 11, 8), pillarMat);
      pillar.position.set(i, 5.5, 9.2);
      pillar.castShadow = true;
      grp.add(pillar);
    }

    // Gate arch
    const archMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.7 });
    [-3, 3].forEach((gx) => {
      const gpost = new THREE.Mesh(new THREE.BoxGeometry(1, 5, 0.5), archMat);
      gpost.position.set(gx, 2.5, 9.5);
      grp.add(gpost);
    });
    const aTop = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 0.5), archMat);
    aTop.position.set(0, 5.5, 9.5);
    grp.add(aTop);

    // Palace name sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 0.3),
      new THREE.MeshBasicMaterial({ map: signTexture('ÀÀFIN ỌLỌFÀ — ROYAL PALACE', '#92400e', '#fef3c7') }));
    sign.position.set(0, 12.5, 9.5);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('olofa-palace', 'Ààfin Ọlọ́fà (The Royal Palace)', x, z - 8, 'Greet Olofa & Homage');
  }

  createMarket(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    // Laterite floor
    const plaza = new THREE.Mesh(new THREE.PlaneGeometry(32, 28),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.95 }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.04;
    grp.add(plaza);

    // Big zinc canopy
    const canopyMat = new THREE.MeshStandardMaterial({ map: this.textures.zinc, roughness: 0.6 });
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(30, 0.5, 26), canopyMat);
    canopy.position.y = 4.8;
    grp.add(canopy);

    // Support poles
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x4b5563 });
    [[-13,-11],[-13,11],[13,-11],[13,11],[0,0],[-6,0],[6,0]].forEach(([px,pz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 4.8, 6), poleMat);
      pole.position.set(px, 2.4, pz);
      pole.castShadow = true;
      grp.add(pole);
    });

    // Stalls in a 5x5 grid
    const stallColors = ['#ef4444','#10b981','#3b82f6','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#84cc16'];
    let si = 0;
    for (let i = -2; i <= 2; i++) {
      for (let j = -2; j <= 2; j++) {
        const stallTex = brickTexture(stallColors[si % stallColors.length], '#c4b5fd', 4, 3);
        const stall = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.6, 2.5),
          new THREE.MeshStandardMaterial({ map: stallTex }));
        stall.position.set(i * 5.5, 0.8, j * 4.2);
        stall.castShadow = true;
        grp.add(stall);

        // Colorful awning over stall front
        const awningColor = parseInt(stallColors[si % stallColors.length].slice(1), 16);
        const awning = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.12, 1.4),
          new THREE.MeshStandardMaterial({ color: awningColor }));
        awning.position.set(i * 5.5, 1.72, j * 4.2 - 1.5);
        awning.rotation.x = -0.28;
        grp.add(awning);
        si++;
      }
    }

    // Market entrance sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture('ỌJÀ ÒWÓDÉ CENTRAL MARKET', '#92400e', '#fef9c3') }));
    sign.position.set(0, 5.8, 14);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('owode-market', 'Ọjà Òwódé (Owode Market)', x, z + 8, 'Haggle & Buy Goods');
  }

  createCombatArena(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    // Sand ring
    const sand = new THREE.Mesh(new THREE.CylinderGeometry(9, 9, 0.35, 32),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.95 }));
    sand.position.y = 0.18;
    sand.receiveShadow = true;
    grp.add(sand);

    // Audience clay bleacher tiers
    for (let ring = 1; ring <= 3; ring++) {
      const bl = new THREE.Mesh(new THREE.TorusGeometry(9.5 + ring * 2.2, 0.8, 5, 32),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 }));
      bl.rotation.x = Math.PI / 2;
      bl.position.y = ring * 0.5;
      grp.add(bl);
    }

    // Barrier posts
    const postMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 2.2, 6), postMat);
      post.position.set(Math.cos(a) * 9.8, 1.1, Math.sin(a) * 9.8);
      post.castShadow = true;
      grp.add(post);
    }

    // Flag banners on poles
    [0xef4444, 0x10b981, 0xfacc15].forEach((col, i) => {
      const angle = (i / 3) * Math.PI * 2;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 5.5, 5), postMat);
      pole.position.set(Math.cos(angle) * 12, 2.75, Math.sin(angle) * 12);
      grp.add(pole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1),
        new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide }));
      flag.position.set(Math.cos(angle) * 12 + 0.8, 5.2, Math.sin(angle) * 12);
      grp.add(flag);
    });

    // Arena sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(12, 1.2, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture('IJAKADI WRESTLING ARENA', '#b45309', '#fef3c7') }));
    sign.position.set(0, 7.5, 12);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('ijakadi-arena', 'Ijakadi Combat Ring', x, z + 7, 'Engage in 3D Fight');
  }

  createFedPoly(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    const instTex = this.textures.institutional;
    instTex.wrapS = instTex.wrapT = THREE.RepeatWrapping;
    instTex.repeat.set(2, 2);
    const wallMat = new THREE.MeshStandardMaterial({ map: instTex });
    const roofMat = new THREE.MeshStandardMaterial({ map: this.textures.zinc });

    // Main teaching block
    const main = new THREE.Mesh(new THREE.BoxGeometry(22, 13, 14), wallMat);
    main.position.y = 6.5;
    main.castShadow = true;
    grp.add(main);

    const slab = new THREE.Mesh(new THREE.BoxGeometry(23, 0.5, 15), roofMat);
    slab.position.y = 13.25;
    grp.add(slab);

    // Side wing
    const wing = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 10), wallMat);
    wing.position.set(-18, 4, 0);
    wing.castShadow = true;
    grp.add(wing);

    // Water tower
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
    const twr = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 6, 12), poleMat);
    twr.position.set(-25, 10, 0);
    grp.add(twr);
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 3, 12), new THREE.MeshStandardMaterial({ color: 0x4b5563 }));
    tank.position.set(-25, 14, 0);
    grp.add(tank);

    // Nigerian flag
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 10, 5),
      new THREE.MeshStandardMaterial({ color: 0x9ca3af }));
    flagPole.position.set(5, 5, 8);
    grp.add(flagPole);
    const fg = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2),
      new THREE.MeshBasicMaterial({ color: 0x008751, side: THREE.DoubleSide }));
    fg.position.set(5.9, 9.4, 8);
    grp.add(fg);
    const fw = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    fw.position.set(5.4, 9.4, 8);
    grp.add(fw);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture('FEDERAL POLYTECHNIC OFFA', '#1e3a8a', '#ffffff') }));
    sign.position.set(0, 14.2, 7.2);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('fedpoly-mini', 'FedPoly Offa Campus', x, z - 8, 'Tech Bootcamp & Study');
  }

  createRailwayStation(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    const redBrick = brickTexture('#991b1b', '#c4b5fd', 8, 5);
    const wallMat = new THREE.MeshStandardMaterial({ map: redBrick, roughness: 0.8 });
    const roofMat = new THREE.MeshStandardMaterial({ map: this.textures.zinc });

    const depot = new THREE.Mesh(new THREE.BoxGeometry(22, 7, 10), wallMat);
    depot.position.y = 3.5;
    depot.castShadow = true;
    grp.add(depot);

    // Gabled roof
    const roofGeo = new THREE.CylinderGeometry(0.1, 12, 4, 2);
    const roofSlant = new THREE.Mesh(roofGeo, roofMat);
    roofSlant.position.y = 9;
    roofSlant.scale.set(1, 1, 0.5);
    grp.add(roofSlant);

    // Platform
    const platform = new THREE.Mesh(new THREE.BoxGeometry(24, 0.4, 4),
      new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.9 }));
    platform.position.set(0, 0.2, 7);
    grp.add(platform);

    // Rail tracks (scene-level, absolute world position)
    const railMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.8 });
    const slpMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
    for (let tx = -70; tx < 30; tx += 3) {
      const slp = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.2, 4), slpMat);
      slp.position.set(x + tx, 0.12, z + 14);
      this.scene.add(slp);
    }
    [-0.75, 0.75].forEach((rOff) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(110, 0.15, 0.2), railMat);
      rail.position.set(x - 45, 0.2, z + 14 + rOff);
      this.scene.add(rail);
    });

    const sign = new THREE.Mesh(new THREE.BoxGeometry(12, 1.5, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture('OFFA RAILWAY STATION', '#7f1d1d', '#fef9c3') }));
    sign.position.set(0, 8.5, 5.2);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('offa-railway', 'Historic Railway Station', x, z + 6, 'Cargo Logistics');
  }

  createArmouryHome(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    const houseTex = paintedHouseTexture('#f0fdf4', '#065f46');
    const wallMat = new THREE.MeshStandardMaterial({ map: houseTex });
    const roofMat = new THREE.MeshStandardMaterial({ map: this.textures.zinc });

    const body = new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 8), wallMat);
    body.position.y = 2.75;
    body.castShadow = true;
    grp.add(body);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 9), roofMat);
    roof.position.y = 5.7;
    grp.add(roof);

    // Gatehouse
    const gate = new THREE.Mesh(new THREE.BoxGeometry(2, 3, 1),
      new THREE.MeshStandardMaterial({ color: 0x374151 }));
    gate.position.set(0, 1.5, 5);
    grp.add(gate);

    // Compound wall
    const cMat = new THREE.MeshStandardMaterial({ map: this.textures.cement, roughness: 0.8 });
    const cwall = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 0.4), cMat);
    cwall.position.set(0, 1, 7);
    grp.add(cwall);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(6, 1, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture('YOUR HOME — POPO QUARTERS', '#065f46', '#f0fdf4') }));
    sign.position.set(0, 6.5, 4.2);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('residential-quarters', 'Your Residence & Safehouse', x, z + 6, 'Rest & Gear Up');
  }

  createFarmland(x, z) {
    const grp = new THREE.Group();
    grp.position.set(x, 0, z);

    const soil = new THREE.Mesh(new THREE.PlaneGeometry(32, 24),
      new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.97 }));
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = 0.04;
    grp.add(soil);

    // Sweet potato mounds (rows of crop bumps)
    const cropMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.9 });
    for (let row = -4; row <= 4; row++) {
      for (let col = -6; col <= 6; col++) {
        const mound = new THREE.Mesh(new THREE.SphereGeometry(0.45, 7, 5), cropMat);
        mound.scale.y = 0.4;
        mound.position.set(col * 2.4, 0.22, row * 2);
        grp.add(mound);
      }
    }

    // Farm shed / barn
    const shed = new THREE.Mesh(new THREE.BoxGeometry(6, 3.5, 4),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 }));
    shed.position.set(14, 1.75, 0);
    shed.castShadow = true;
    grp.add(shed);
    const shedRoof = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 4, 2.5, 2),
      new THREE.MeshStandardMaterial({ map: this.textures.zinc }));
    shedRoof.position.set(14, 4.5, 0);
    shedRoof.scale.set(1, 1, 0.75);
    grp.add(shedRoof);

    const sign = new THREE.Mesh(new THREE.BoxGeometry(10, 1.2, 0.2),
      new THREE.MeshBasicMaterial({ map: signTexture('ANAMỌ SWEET POTATO FARM', '#365314', '#ecfccb') }));
    sign.position.set(0, 4.5, 13);
    grp.add(sign);

    this.scene.add(grp);
    this.registerInteractiveZone('anamo-farms', 'Anamọ Sweet Potato Plantation', x, z - 8, 'Harvest Sweet Potatoes');
  }

  // ── NIGHTCLUB ───────────────────────────────────────────────────────────────

  buildNightclub() {
    const cX = 42, cZ = 52;
    const grp = new THREE.Group();
    grp.position.set(cX, 0, cZ);

    const clubTex = this.textures.nightclub;
    clubTex.wrapS = clubTex.wrapT = THREE.RepeatWrapping;
    clubTex.repeat.set(2, 1);
    const clubMat = new THREE.MeshStandardMaterial({ map: clubTex, roughness: 0.2, metalness: 0.7 });

    const bldg = new THREE.Mesh(new THREE.BoxGeometry(22, 12, 18), clubMat);
    bldg.position.y = 6;
    bldg.castShadow = true;
    grp.add(bldg);

    const parapet = new THREE.Mesh(new THREE.BoxGeometry(23, 1.2, 19),
      new THREE.MeshStandardMaterial({ color: 0x090d16 }));
    parapet.position.y = 12.6;
    grp.add(parapet);

    // Neon entrance arch
    const archMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const arch = new THREE.Mesh(new THREE.BoxGeometry(8, 5, 0.5), archMat);
    arch.position.set(0, 2.5, 9.3);
    grp.add(arch);
    const archInner = new THREE.Mesh(new THREE.BoxGeometry(6.5, 4, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x090d16 }));
    archInner.position.set(0, 2.2, 9.5);
    grp.add(archInner);

    // Roof sign
    const sign = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 0.5),
      new THREE.MeshBasicMaterial({ map: signTexture('AVALON NIGHTCLUB & VIP LOUNGE', '#0a0a0a', '#ec4899') }));
    sign.position.set(0, 13.8, 9.3);
    grp.add(sign);

    // LED Dancefloor (7×7)
    const tileColors = [0xec4899, 0x06b6d4, 0xa855f7, 0xfacc15, 0x10b981];
    for (let r = -3; r <= 3; r++) {
      for (let c = -3; c <= 3; c++) {
        const tile = new THREE.Mesh(new THREE.PlaneGeometry(2, 2),
          new THREE.MeshBasicMaterial({ color: tileColors[Math.abs(r * 2 + c) % tileColors.length] }));
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(c * 2.2, 0.1, r * 2.2 + 2);
        grp.add(tile);
        this.discoTiles.push(tile);
      }
    }

    // DJ booth
    const dj = new THREE.Mesh(new THREE.BoxGeometry(5, 2.2, 2),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7 }));
    dj.position.set(0, 1.1, 18);
    grp.add(dj);
    const decks = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x374151, metalness: 0.9 }));
    decks.position.set(0, 2.3, 18);
    grp.add(decks);

    // Speakers
    const spkMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    [-4, 4].forEach((sx) => {
      const spk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 5, 1.8), spkMat);
      spk.position.set(sx, 2.5, 18);
      grp.add(spk);
    });

    // Spotlights
    [0xec4899, 0x06b6d4].forEach((col, i) => {
      const spot = new THREE.SpotLight(col, 6, 30, Math.PI / 5, 0.4);
      spot.position.set(cX + (i === 0 ? -5 : 5), 10, cZ + 8);
      spot.target = grp;
      this.scene.add(spot);
      this.spotlights.push(spot);
    });

    this.scene.add(grp);
    this.registerInteractiveZone('avalon-hotel', 'Avalon Nightclub & VIP Lounge', cX, cZ + 12, 'Party, Drink & Dance');
  }

  // ── FLORA ───────────────────────────────────────────────────────────────────

  buildFlora() {
    const palmPositions = [
      [-18, 18], [18, 18], [-18, -18], [18, -18],
      [-60, 25], [60, 25], [-50, -40], [50, -40],
      [30, 60], [-30, 60], [0, 72], [72, 0], [-72, 0],
    ];
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803d, side: THREE.DoubleSide, roughness: 0.8 });
    const cocoMat  = new THREE.MeshStandardMaterial({ color: 0x92400e });

    palmPositions.forEach(([tx, tz], idx) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.5, 8, 7), trunkMat);
      trunk.position.set(tx, 4, tz);
      trunk.castShadow = true;
      this.scene.add(trunk);
      this.palmTrunks.push({ mesh: trunk, idx });

      // Palm fronds
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 3.5) {
        const frond = new THREE.Mesh(new THREE.PlaneGeometry(4, 0.8), frondMat);
        frond.position.set(tx + Math.cos(a) * 2.4, 8.4, tz + Math.sin(a) * 2.4);
        frond.rotation.y = a;
        frond.rotation.z = 0.52;
        this.scene.add(frond);
      }

      // Coconuts
      for (let cn = 0; cn < 3; cn++) {
        const na = cn * (Math.PI * 2 / 3);
        const nut = new THREE.Mesh(new THREE.SphereGeometry(0.27, 7, 7), cocoMat);
        nut.position.set(tx + Math.cos(na) * 0.55, 8.3, tz + Math.sin(na) * 0.55);
        this.scene.add(nut);
      }
    });

    // Roadside bushes / shrubs
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.9 });
    for (let bx = -80; bx <= 80; bx += 11) {
      [30, -30].forEach((bz) => {
        const bush = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 0), bushMat);
        bush.position.set(bx, 0.9, bz);
        bush.castShadow = true;
        this.scene.add(bush);
      });
    }
  }

  // ── ATMOSPHERE (clouds + birds) ─────────────────────────────────────────────

  buildAtmosphere() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 1, opacity: 0.88, transparent: true,
    });

    for (let i = 0; i < 14; i++) {
      const cGrp = new THREE.Group();
      cGrp.position.set(
        (Math.random() - 0.5) * 200,
        48 + Math.random() * 22,
        (Math.random() - 0.5) * 200
      );
      const numPuffs = 3 + Math.floor(Math.random() * 5);
      for (let p = 0; p < numPuffs; p++) {
        const r = 4 + Math.random() * 6;
        const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 7, 7), cloudMat);
        puff.position.set(
          (Math.random() - 0.5) * 14,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 6
        );
        cGrp.add(puff);
      }
      this.scene.add(cGrp);
      this.clouds.push({ grp: cGrp, speed: 0.6 + Math.random() * 1.4, dir: Math.random() > 0.5 ? 1 : -1 });
    }

    // Birds in V-formation flocks
    const birdMat = new THREE.MeshBasicMaterial({ color: 0x111827, side: THREE.DoubleSide });
    for (let flock = 0; flock < 4; flock++) {
      const fGrp = new THREE.Group();
      fGrp.position.set((Math.random() - 0.5) * 120, 36 + Math.random() * 18, (Math.random() - 0.5) * 120);
      for (let b = 0; b < 8; b++) {
        const wing = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.1, 3), birdMat);
        wing.rotation.z = Math.PI / 2;
        wing.position.set((b % 4) * 2.8 - 5, Math.floor(b / 4) * 1.6, 0);
        fGrp.add(wing);
      }
      this.scene.add(fGrp);
      this.birds.push({ grp: fGrp, speed: 3.5 + Math.random() * 2.5, angle: Math.random() * Math.PI * 2, wt: 0 });
    }
  }

  // ── STREET LIGHTS ─────────────────────────────────────────────────────────────

  buildStreetLights() {
    const poles = [
      [-20, 10], [20, 10], [-40, 10], [40, 10],
      [-20,-10], [20,-10], [-40,-10], [40,-10],
      [0, 35], [0, -35],
    ];
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.6 });
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });

    poles.forEach(([lx, lz]) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 7, 6), poleMat);
      pole.position.set(lx, 3.5, lz);
      pole.castShadow = true;
      this.scene.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 0.18), poleMat);
      arm.position.set(lx + 1.25, 7.2, lz);
      this.scene.add(arm);

      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.32, 7, 7), bulbMat);
      bulb.position.set(lx + 2.5, 7.2, lz);
      this.scene.add(bulb);

      const light = new THREE.PointLight(0xfffbeb, 0, 20, 1.5);
      light.position.set(lx + 2.5, 7, lz);
      this.scene.add(light);
      this.streetLights.push(light);
    });
  }

  // ── NPCS ────────────────────────────────────────────────────────────────────

  spawnNPCsAndEnemies() {
    // Combat enemies with patrol
    const enemyDefs = [
      { name: 'Razor (Adeleke Brawler)', x: -6, z: -25, hp: 100, maxHp: 100, color: 0xdc2626, range: 5 },
      { name: 'Titan (Popo Heavyweight)',  x:  6, z: -25, hp: 140, maxHp: 140, color: 0x991b1b, range: 5 },
    ];
    enemyDefs.forEach((def) => {
      const ec = new Character3D({
        shirtColor: def.color, vestColor: 0x1f2937, pantsColor: 0x111827,
        bootsColor: 0x000000, camoAccent: 0xef4444, name: def.name, isNPC: true,
      });
      ec.group.position.set(def.x, 0, def.z);
      this.scene.add(ec.group);

      const hpBg = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.22),
        new THREE.MeshBasicMaterial({ color: 0x111827 }));
      hpBg.position.set(0, 2.5, 0);
      const hpBar = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 }));
      hpBar.position.set(0, 2.5, 0.01);
      ec.group.add(hpBg, hpBar);

      this.enemies.push({
        character: ec, x: def.x, z: def.z,
        hp: def.hp, maxHp: def.maxHp, hpBar, name: def.name,
        staggerTimer: 0,
        patrolA: { x: def.x - def.range, z: def.z },
        patrolB: { x: def.x + def.range, z: def.z },
        patrolDir: 1,
      });
    });

    // Nightclub dancers
    [
      { name: 'DJ Tunez',      x: 42, z: 66, color: 0x8b5cf6 },
      { name: 'VIP Bella',     x: 40, z: 62, color: 0xec4899 },
      { name: 'Hype Man Sisi', x: 44, z: 64, color: 0x06b6d4 },
    ].forEach((d) => {
      const ch = new Character3D({ shirtColor: d.color, vestColor: 0x374151, pantsColor: 0x111827, name: d.name, isNPC: true });
      ch.group.position.set(d.x, 0, d.z);
      ch.setAnimation('club_dance');
      this.scene.add(ch.group);
      this.npcs.push({ character: ch, x: d.x, z: d.z, type: 'dancer' });
    });

    // Street pedestrians always walking
    [
      { name: 'Mama Kike',   x: -12, z:  5,  color: 0xd97706, range: 15, speed: 2.5 },
      { name: 'Baba Ogun',   x:   8, z: -8,  color: 0x1d4ed8, range: 12, speed: 3.0 },
      { name: 'Iya Folake',  x: -30, z: 15,  color: 0x7c3aed, range: 18, speed: 2.2 },
      { name: 'Alh. Musa',   x:  25, z:  5,  color: 0x065f46, range: 10, speed: 2.8 },
      { name: 'Sisi Lagos',  x:  15, z: -12, color: 0xdb2777, range: 14, speed: 3.2 },
      { name: 'Kaka Bello',  x: -22, z: -5,  color: 0x0369a1, range: 16, speed: 2.4 },
      { name: 'Uncle Seun',  x:  35, z: -12, color: 0x92400e, range: 14, speed: 2.6 },
      { name: 'Alhaja Titi', x: -15, z: -30, color: 0x9f1239, range: 12, speed: 2.0 },
    ].forEach((ped) => {
      const ch = new Character3D({
        shirtColor: ped.color, vestColor: 0x4b5563, pantsColor: 0x1f2937,
        bootsColor: 0x111827, camoAccent: ped.color, name: ped.name, isNPC: true,
      });
      ch.group.position.set(ped.x, 0, ped.z);
      ch.setAnimation('walk');
      this.scene.add(ch.group);
      this.npcs.push({
        character: ch, x: ped.x, z: ped.z, type: 'pedestrian',
        patrolA: { x: ped.x - ped.range, z: ped.z },
        patrolB: { x: ped.x + ped.range, z: ped.z },
        patrolDir: 1, speed: ped.speed,
      });
    });

    // Market hagglers criss-crossing stalls
    for (let i = 0; i < 5; i++) {
      const sx = -38 + (Math.random() - 0.5) * 22;
      const sz = 22  + (Math.random() - 0.5) * 18;
      const ch = new Character3D({
        shirtColor: [0xfbbf24, 0x34d399, 0xf87171, 0x818cf8, 0xfb923c][i],
        vestColor: 0x6b7280, pantsColor: 0x374151,
        name: `Market Buyer ${i + 1}`, isNPC: true,
      });
      ch.group.position.set(sx, 0, sz);
      ch.setAnimation('walk');
      this.scene.add(ch.group);
      this.npcs.push({
        character: ch, x: sx, z: sz, type: 'pedestrian',
        patrolA: { x: sx - 9, z: sz }, patrolB: { x: sx + 9, z: sz + 7 },
        patrolDir: 1, speed: 1.6 + Math.random(),
      });
    }
  }

  // ── VEHICLES (parked dressing) ───────────────────────────────────────────────

  spawnVehicles() {
    // Parked Keke (the player's driven keke is handled in Offa3DCanvas)
    const wMat  = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const rMat  = new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.8 });
    const wsMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, opacity: 0.7, transparent: true });

    const kG = new THREE.Group();
    kG.position.set(-6, 0.5, 3);
    const kBody = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.4 }));
    kBody.position.y = 0.5;
    kG.add(kBody);
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.2), wsMat);
    ws.position.set(-1.51, 0.55, 0);
    ws.rotation.y = Math.PI / 2;
    kG.add(ws);
    [[-1,-0.75],[1,-0.75],[0,0.75]].forEach(([wx,wz]) => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.25,12), wMat);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, -0.1, wz);
      kG.add(wh);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.2,0.2,0.28,8), rMat);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(wx, -0.1, wz);
      kG.add(rim);
    });
    kG.add(new THREE.Mesh(new THREE.BoxGeometry(1.5,0.35,0.1),
      new THREE.MeshBasicMaterial({ map: signTexture('KEKE MARWA','#10b981','#ffffff') })));
    this.scene.add(kG);

    // Parked Okada
    const oG = new THREE.Group();
    oG.position.set(5, 0.3, 3);
    oG.add(new THREE.Mesh(new THREE.BoxGeometry(2.2,0.9,0.7),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6, roughness: 0.4 })));
    [[-0.85,-0.22],[0.85,-0.22]].forEach(([wx,wy]) => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.38,0.38,0.22,12), wMat);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(wx, wy, 0);
      oG.add(wh);
    });
    this.scene.add(oG);
  }

  // ── REGISTER ZONE ───────────────────────────────────────────────────────────

  registerInteractiveZone(id, name, x, z, actionHint) {
    this.interactiveZones.push({ id, name, x, z, actionHint });
    const marker = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.8, 4),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    marker.rotation.x = Math.PI;
    marker.position.set(x, 6.5, z);
    this.scene.add(marker);
    this.buildings.push({ marker, x, z });
  }

  // ── UPDATE LOOP ─────────────────────────────────────────────────────────────

  update(dt, isNight = false) {
    const time = performance.now() * 0.001;

    // Disco floor pulses with beat
    const tileColors = [0xec4899, 0x06b6d4, 0xa855f7, 0xfacc15, 0x10b981];
    this.discoTiles.forEach((tile, idx) => {
      tile.material.color.setHex(tileColors[Math.floor((time * 4 + idx * 0.6) % tileColors.length)]);
    });

    // Sweep spotlights
    this.spotlights.forEach((spot, i) => {
      spot.position.x += Math.sin(time * 1.6 + i * 1.2) * 0.09;
      spot.position.z += Math.cos(time * 1.6 + i * 1.2) * 0.09;
    });

    // Street lights glow at night
    this.streetLights.forEach((l) => { l.intensity = isNight ? 1.8 : 0; });

    // Clouds drift
    this.clouds.forEach((cloud) => {
      cloud.grp.position.x += cloud.speed * cloud.dir * dt;
      if (cloud.grp.position.x > 110)  cloud.grp.position.x = -110;
      if (cloud.grp.position.x < -110) cloud.grp.position.x = 110;
    });

    // Birds circle + flap wings
    this.birds.forEach((bird) => {
      bird.angle += dt * 0.38;
      bird.wt    += dt;
      const radius = 38;
      bird.grp.position.x = Math.cos(bird.angle) * radius;
      bird.grp.position.z = Math.sin(bird.angle) * radius;
      bird.grp.rotation.y = -bird.angle + Math.PI / 2;
      bird.grp.children.forEach((w, wi) => {
        w.scale.y = 1 + Math.sin(bird.wt * 6 + wi * 0.5) * 0.4;
      });
    });

    // Palm trees sway in breeze
    this.palmTrunks.forEach((p) => {
      p.mesh.rotation.z = Math.sin(time * 0.7 + p.idx * 1.4) * 0.045;
      p.mesh.rotation.x = Math.cos(time * 0.55 + p.idx)     * 0.03;
    });

    // Bobbing zone markers
    this.buildings.forEach((b) => {
      if (b.marker) {
        b.marker.position.y = 6.5 + Math.sin(time * 2) * 0.45;
        b.marker.rotation.y += dt * 2.4;
      }
    });

    // NPC updates — always moving
    this.npcs.forEach((npc) => {
      if (npc.type === 'dancer') {
        npc.character.setAnimation('club_dance');
        npc.character.update(dt, false);
        return;
      }

      // Pedestrian patrol walk
      const target = npc.patrolDir > 0 ? npc.patrolB : npc.patrolA;
      const dx = target.x - npc.x;
      const dz = target.z - npc.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.4) {
        npc.patrolDir *= -1;
      } else {
        const step = (npc.speed || 2.5) * dt;
        npc.x += (dx / dist) * step;
        npc.z += (dz / dist) * step;
        npc.character.group.position.set(npc.x, 0, npc.z);
        npc.character.group.rotation.y = Math.atan2(dx, dz);
      }
      npc.character.setAnimation('walk');
      npc.character.update(dt, true, 0.4);
    });

    // Enemy patrol
    this.enemies.forEach((enemy) => {
      if (enemy.hp <= 0) return;
      const target = enemy.patrolDir > 0 ? enemy.patrolB : enemy.patrolA;
      const dx = target.x - enemy.x;
      const dz = target.z - enemy.z;
      const dist = Math.hypot(dx, dz);
      if (dist < 0.4) {
        enemy.patrolDir *= -1;
      } else {
        const step = 1.6 * dt;
        enemy.x += (dx / dist) * step;
        enemy.z += (dz / dist) * step;
        enemy.character.group.position.set(enemy.x, 0, enemy.z);
        enemy.character.group.rotation.y = Math.atan2(dx, dz);
      }
      enemy.character.update(dt, true, 0.32);
      enemy.hpBar.scale.x = Math.max(0.01, enemy.hp / enemy.maxHp);
    });
  }

  getClosestZone(playerX, playerZ, threshold = 9.0) {
    let closest = null, minD = threshold;
    this.interactiveZones.forEach((zone) => {
      const d = Math.hypot(playerX - zone.x, playerZ - zone.z);
      if (d < minD) { minD = d; closest = zone; }
    });
    return closest;
  }

  getClosestEnemy(playerX, playerZ, range = 4.5) {
    let target = null, minD = range;
    this.enemies.forEach((enemy) => {
      if (enemy.hp > 0) {
        const d = Math.hypot(playerX - enemy.x, playerZ - enemy.z);
        if (d < minD) { minD = d; target = enemy; }
      }
    });
    return target;
  }
}
