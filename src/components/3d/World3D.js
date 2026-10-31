import * as THREE from 'three';
import { Character3D } from './Character3D';

export class World3D {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.npcs = [];
    this.enemies = [];
    this.interactiveZones = [];
    this.discoTiles = [];
    this.spotlights = [];

    this.buildTerrain();
    this.buildRoads();
    this.buildBuildings();
    this.buildNightclub();
    this.buildFlora();
    this.spawnNPCsAndEnemies();
    this.spawnVehicles();
  }

  buildTerrain() {
    const groundGeo = new THREE.PlaneGeometry(180, 180);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Green verges & urban courtyards
    const grassGeo = new THREE.PlaneGeometry(170, 170);
    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x14532d,
      roughness: 0.8,
    });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.02;
    grass.receiveShadow = true;
    this.scene.add(grass);
  }

  buildRoads() {
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      roughness: 0.7,
      metalness: 0.1,
    });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });

    // Main 4-Lane Olofa Way Expressway
    const mainRoadGeo = new THREE.PlaneGeometry(180, 16);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(0, 0.05, 0);
    mainRoad.receiveShadow = true;
    this.scene.add(mainRoad);

    // Palace & Adeleke Avenue
    const aveGeo = new THREE.PlaneGeometry(16, 180);
    const ave = new THREE.Mesh(aveGeo, roadMat);
    ave.rotation.x = -Math.PI / 2;
    ave.position.set(0, 0.05, 0);
    ave.receiveShadow = true;
    this.scene.add(ave);

    // Road dashed stripes
    for (let x = -85; x < 85; x += 6) {
      const dashGeo = new THREE.PlaneGeometry(3, 0.4);
      const dash = new THREE.Mesh(dashGeo, lineMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.06, 0);
      this.scene.add(dash);
    }
  }

  buildBuildings() {
    // 1. Ààfin Ọlọ́fà (Palace of the Olofa)
    this.createPalace(0, 52);

    // 2. Ọjà Òwódé (Owode Central Market)
    this.createMarket(-38, 22);

    // 3. Pápá Ìjàkadì (Wrestling Combat Sand Arena)
    this.createCombatArena(0, -25);

    // 4. FedPoly Offa (Tech & Engineering Campus)
    this.createFedPoly(40, 22);

    // 5. Historic Offa Railway Station
    this.createRailwayStation(-42, -50);

    // 6. Popo Quarters (Player Residence & Armoury)
    this.createArmouryHome(28, -30);

    // 7. Ojoku Road Farmlands
    this.createFarmland(-45, 52);
  }

  // AVALON NIGHTCLUB & VIP LOUNGE (The Clubbing Experience!)
  buildNightclub() {
    const clubX = 42;
    const clubZ = 52;
    const group = new THREE.Group();
    group.position.set(clubX, 0, clubZ);

    // Modern Nightclub Exterior (Black Obsidian & Neon Trims)
    const clubBldg = new THREE.Mesh(
      new THREE.BoxGeometry(20, 10, 16),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3, metalness: 0.8 })
    );
    clubBldg.position.y = 5;
    group.add(clubBldg);

    // Neon Roof Sign "AVALON NIGHTCLUB & LOUNGE"
    const signGeo = new THREE.BoxGeometry(14, 2, 0.8);
    const signMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 11, 7.8);
    group.add(sign);

    // Outdoor / Indoor VIP Dance Floor (Illuminated Checkered LED Tiles)
    const tileColors = [0xec4899, 0x06b6d4, 0xa855f7, 0xfacc15];
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const tile = new THREE.Mesh(
          new THREE.PlaneGeometry(2.2, 2.2),
          new THREE.MeshBasicMaterial({ color: tileColors[Math.abs(r + c) % tileColors.length] })
        );
        tile.rotation.x = -Math.PI / 2;
        tile.position.set(c * 2.4, 0.1, r * 2.4 + 12);
        group.add(tile);
        this.discoTiles.push(tile);
      }
    }

    // DJ Booth & Turntable
    const djBooth = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 2, 1.5),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7 })
    );
    djBooth.position.set(0, 1, 18);
    group.add(djBooth);

    // Subwoofer Speaker Towers
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
    const leftSpeaker = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4.5, 1.5), speakerMat);
    leftSpeaker.position.set(-3.5, 2.25, 18);
    const rightSpeaker = new THREE.Mesh(new THREE.BoxGeometry(1.5, 4.5, 1.5), speakerMat);
    rightSpeaker.position.set(3.5, 2.25, 18);
    group.add(leftSpeaker, rightSpeaker);

    // Dynamic Sweeping Spotlights
    const spotPink = new THREE.SpotLight(0xec4899, 5, 25, Math.PI / 6, 0.5);
    spotPink.position.set(clubX - 5, 8, clubZ + 8);
    spotPink.target = group;
    this.scene.add(spotPink);
    this.spotlights.push(spotPink);

    const spotCyan = new THREE.SpotLight(0x06b6d4, 5, 25, Math.PI / 6, 0.5);
    spotCyan.position.set(clubX + 5, 8, clubZ + 8);
    spotCyan.target = group;
    this.scene.add(spotCyan);
    this.spotlights.push(spotCyan);

    this.scene.add(group);
    this.registerInteractiveZone('avalon-hotel', 'Avalon Nightclub & VIP Lounge', clubX, clubZ + 12, 'Party, Drink & Dance');
  }

  createCombatArena(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Sand Combat Ring
    const sand = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8, 0.3, 24),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 })
    );
    sand.position.y = 0.15;
    sand.receiveShadow = true;
    group.add(sand);

    // Combat Arena Barrier with Spotlights
    const postMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.6 });
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 0.3), postMat);
      post.position.set(Math.cos(a) * 8.4, 0.8, Math.sin(a) * 8.4);
      group.add(post);
    }

    this.scene.add(group);
    this.registerInteractiveZone('ijakadi-arena', 'Ijakadi Combat Ring', x, z + 7, 'Engage in 3D Fight');
  }

  createPalace(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const palace = new THREE.Mesh(
      new THREE.BoxGeometry(22, 10, 14),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    palace.position.y = 5;
    palace.castShadow = true;
    group.add(palace);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(16, 6, 4),
      new THREE.MeshStandardMaterial({ color: 0x92400e })
    );
    roof.position.y = 13;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    this.scene.add(group);
    this.registerInteractiveZone('olofa-palace', 'Ààfin Ọlọ́fà (The Royal Palace)', x, z - 8, 'Greet Olofa & Homage');
  }

  createMarket(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const plaza = new THREE.Mesh(
      new THREE.PlaneGeometry(26, 22),
      new THREE.MeshStandardMaterial({ color: 0x78350f })
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.04;
    group.add(plaza);

    // Stalls & Canopies
    const colors = [0xef4444, 0x10b981, 0x3b82f6, 0xf59e0b];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const stall = new THREE.Mesh(
          new THREE.BoxGeometry(4, 1.2, 2.4),
          new THREE.MeshStandardMaterial({ color: 0x451a03 })
        );
        stall.position.set(i * 8, 0.6, j * 6);
        group.add(stall);

        const canopy = new THREE.Mesh(
          new THREE.ConeGeometry(3, 1.4, 6),
          new THREE.MeshStandardMaterial({ color: colors[Math.abs(i * 2 + j) % colors.length] })
        );
        canopy.position.set(i * 8, 3.8, j * 6);
        group.add(canopy);
      }
    }

    this.scene.add(group);
    this.registerInteractiveZone('owode-market', 'Ọjà Òwódé (Owode Market)', x, z + 8, 'Haggle & Buy Goods');
  }

  createFedPoly(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 })
    );
    tower.position.y = 6;
    group.add(tower);

    this.scene.add(group);
    this.registerInteractiveZone('fedpoly-mini', 'FedPoly Offa Campus', x, z - 8, 'Tech Bootcamp & Study');
  }

  createRailwayStation(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const depot = new THREE.Mesh(
      new THREE.BoxGeometry(16, 6, 8),
      new THREE.MeshStandardMaterial({ color: 0x991b1b })
    );
    depot.position.y = 3;
    group.add(depot);

    this.scene.add(group);
    this.registerInteractiveZone('offa-railway', 'Historic Railway Station', x, z + 6, 'Cargo Logistics');
  }

  createArmouryHome(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const house = new THREE.Mesh(
      new THREE.BoxGeometry(9, 5, 9),
      new THREE.MeshStandardMaterial({ color: 0x065f46 })
    );
    house.position.y = 2.5;
    group.add(house);

    this.scene.add(group);
    this.registerInteractiveZone('residential-quarters', 'Your Residence & Safehouse', x, z + 6, 'Rest & Gear Up');
  }

  createFarmland(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const field = new THREE.Mesh(
      new THREE.BoxGeometry(20, 0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x365314 })
    );
    field.position.y = 0.15;
    group.add(field);

    this.scene.add(group);
    this.registerInteractiveZone('anamo-farms', 'Anamọ Sweet Potato Plantation', x, z - 8, 'Harvest Sweet Potatoes');
  }

  buildFlora() {
    const spots = [[-18, 18], [18, 18], [-18, -18], [18, -18], [-60, 25], [60, 25]];
    spots.forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.45, 5, 8),
        new THREE.MeshStandardMaterial({ color: 0x78350f })
      );
      trunk.position.set(tx, 2.5, tz);
      this.scene.add(trunk);

      const top = new THREE.Mesh(
        new THREE.DodecahedronGeometry(2.6),
        new THREE.MeshStandardMaterial({ color: 0x15803d })
      );
      top.position.set(tx, 6, tz);
      this.scene.add(top);
    });
  }

  // Spawn Free Fire / CoD Style NPCs and Combat Brawlers
  spawnNPCsAndEnemies() {
    // 1. Street Combat Enemies (You can attack and fight them in 3D!)
    const enemyDefs = [
      { name: 'Razor (Adeleke Brawler)', x: -6, z: -25, hp: 100, maxHp: 100, color: 0xdc2626 },
      { name: 'Titan (Popo Heavyweight)', x: 6, z: -25, hp: 140, maxHp: 140, color: 0x991b1b },
    ];

    enemyDefs.forEach((def) => {
      const enemyChar = new Character3D({
        shirtColor: def.color,
        vestColor: 0x1f2937,
        pantsColor: 0x111827,
        bootsColor: 0x000000,
        camoAccent: 0xef4444,
        name: def.name,
        isNPC: true,
      });
      enemyChar.group.position.set(def.x, 0, def.z);
      this.scene.add(enemyChar.group);

      // 3D Floating Health Bar over Enemy Head
      const hpBg = new THREE.Mesh(
        new THREE.PlaneGeometry(1.6, 0.22),
        new THREE.MeshBasicMaterial({ color: 0x111827 })
      );
      hpBg.position.set(0, 2.5, 0);

      const hpBar = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 0.16),
        new THREE.MeshBasicMaterial({ color: 0xef4444 })
      );
      hpBar.position.set(0, 2.5, 0.01);
      enemyChar.group.add(hpBg, hpBar);

      this.enemies.push({
        character: enemyChar,
        x: def.x,
        z: def.z,
        hp: def.hp,
        maxHp: def.maxHp,
        hpBar,
        name: def.name,
        staggerTimer: 0,
      });
    });

    // 2. Club Dancers & Town Citizens
    const clubDancers = [
      { name: 'DJ Tunez', x: 42, z: 66, color: 0x8b5cf6 },
      { name: 'Club VIP Bella', x: 40, z: 63, color: 0xec4899 },
      { name: 'Hype Man Sisi', x: 44, z: 64, color: 0x06b6d4 },
    ];

    clubDancers.forEach((dancer) => {
      const char = new Character3D({
        shirtColor: dancer.color,
        vestColor: 0x374151,
        pantsColor: 0x111827,
        name: dancer.name,
        isNPC: true,
      });
      char.group.position.set(dancer.x, 0, dancer.z);
      char.setAnimation('club_dance');
      this.scene.add(char.group);
      this.npcs.push({ character: char, x: dancer.x, z: dancer.z, anim: 'club_dance' });
    });
  }

  spawnVehicles() {
    // 3D Bajaj Okada Motorcycle
    const okadaGroup = new THREE.Group();
    okadaGroup.position.set(5, 0.35, 3);
    const okadaBody = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.9, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.6 })
    );
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x090d16 });
    const wheel1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12), wheelMat);
    wheel1.rotation.z = Math.PI / 2;
    wheel1.position.set(-0.8, -0.3, 0);
    const wheel2 = wheel1.clone();
    wheel2.position.set(0.8, -0.3, 0);
    okadaGroup.add(okadaBody, wheel1, wheel2);
    this.scene.add(okadaGroup);

    // 3D TVS Keke Tricycle
    const kekeGroup = new THREE.Group();
    kekeGroup.position.set(-6, 0.65, 3);
    const kekeCabin = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 1.6, 1.4),
      new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3 })
    );
    kekeCabin.position.y = 0.4;
    kekeGroup.add(kekeCabin);
    this.scene.add(kekeGroup);
  }

  registerInteractiveZone(id, name, x, z, actionHint) {
    this.interactiveZones.push({ id, name, x, z, actionHint });

    const marker = new THREE.Mesh(
      new THREE.ConeGeometry(0.8, 1.5, 4),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    marker.rotation.x = Math.PI;
    marker.position.set(x, 5.5, z);
    this.scene.add(marker);
    this.buildings.push({ marker, x, z });
  }

  update(dt) {
    const time = performance.now() * 0.003;

    // Pulse Disco Floor in Club
    this.discoTiles.forEach((tile, idx) => {
      if (Math.sin(time * 3 + idx) > 0.5) {
        tile.material.color.setHex(0xec4899);
      } else if (Math.sin(time * 3 + idx) > 0) {
        tile.material.color.setHex(0x06b6d4);
      } else {
        tile.material.color.setHex(0xfacc15);
      }
    });

    // Sweep Spotlights across dancefloor
    this.spotlights.forEach((spot, idx) => {
      spot.position.x += Math.sin(time * 2 + idx) * 0.05;
      spot.position.z += Math.cos(time * 2 + idx) * 0.05;
    });

    // Update NPC dancers
    this.npcs.forEach((npc) => {
      npc.character.update(dt, false);
    });

    // Update Combat Enemies
    this.enemies.forEach((enemy) => {
      if (enemy.hp > 0) {
        enemy.character.update(dt, false);
        // Face player if close
        enemy.hpBar.scale.x = Math.max(0.01, enemy.hp / enemy.maxHp);
      }
    });

    // Bob Markers
    this.buildings.forEach((b) => {
      if (b.marker) {
        b.marker.position.y = 5.5 + Math.sin(time) * 0.35;
        b.marker.rotation.y += dt * 2.0;
      }
    });
  }

  getClosestZone(playerX, playerZ, threshold = 8.0) {
    let closest = null;
    let minD = threshold;
    this.interactiveZones.forEach((zone) => {
      const d = Math.hypot(playerX - zone.x, playerZ - zone.z);
      if (d < minD) {
        minD = d;
        closest = zone;
      }
    });
    return closest;
  }

  getClosestEnemy(playerX, playerZ, range = 3.5) {
    let target = null;
    let minD = range;
    this.enemies.forEach((enemy) => {
      if (enemy.hp > 0) {
        const d = Math.hypot(playerX - enemy.x, playerZ - enemy.z);
        if (d < minD) {
          minD = d;
          target = enemy;
        }
      }
    });
    return target;
  }
}
