import * as THREE from 'three';
import { Character3D } from './Character3D';

export class World3D {
  constructor(scene) {
    this.scene = scene;
    this.buildings = [];
    this.npcs = [];
    this.vehicles = [];
    this.streetLights = [];
    this.interactiveZones = [];

    this.buildTerrain();
    this.buildRoads();
    this.buildBuildings();
    this.buildFlora();
    this.spawnNPCs();
  }

  buildTerrain() {
    // Large ground plane
    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // foundation
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Green grass fields
    const grassGeo = new THREE.PlaneGeometry(150, 150);
    const grassMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
    const grass = new THREE.Mesh(grassGeo, grassMat);
    grass.rotation.x = -Math.PI / 2;
    grass.position.y = 0.02;
    grass.receiveShadow = true;
    this.scene.add(grass);
  }

  buildRoads() {
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x0f172a }); // dark asphalt
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 }); // yellow dashed lines

    // Main East-West Boulevard (Olofa Way)
    const ewRoadGeo = new THREE.PlaneGeometry(160, 12);
    const ewRoad = new THREE.Mesh(ewRoadGeo, roadMat);
    ewRoad.rotation.x = -Math.PI / 2;
    ewRoad.position.set(0, 0.05, 0);
    ewRoad.receiveShadow = true;
    this.scene.add(ewRoad);

    // North-South Avenue (Palace & FedPoly Corridor)
    const nsRoadGeo = new THREE.PlaneGeometry(12, 160);
    const nsRoad = new THREE.Mesh(nsRoadGeo, roadMat);
    nsRoad.rotation.x = -Math.PI / 2;
    nsRoad.position.set(0, 0.05, 0);
    nsRoad.receiveShadow = true;
    this.scene.add(nsRoad);

    // Secondary Roads
    const secRoadGeo = new THREE.PlaneGeometry(160, 8);
    const northSec = new THREE.Mesh(secRoadGeo, roadMat);
    northSec.rotation.x = -Math.PI / 2;
    northSec.position.set(0, 0.05, 45);
    northSec.receiveShadow = true;
    this.scene.add(northSec);

    const southSec = new THREE.Mesh(secRoadGeo, roadMat);
    southSec.rotation.x = -Math.PI / 2;
    southSec.position.set(0, 0.05, -45);
    southSec.receiveShadow = true;
    this.scene.add(southSec);

    // Road dashed markings
    for (let x = -75; x < 75; x += 6) {
      const dashGeo = new THREE.PlaneGeometry(3, 0.3);
      const dash = new THREE.Mesh(dashGeo, lineMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.06, 0);
      this.scene.add(dash);
    }

    for (let z = -75; z < 75; z += 6) {
      const dashGeo = new THREE.PlaneGeometry(0.3, 3);
      const dash = new THREE.Mesh(dashGeo, lineMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(0, 0.06, z);
      this.scene.add(dash);
    }

    // Railway tracks
    const railMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 });
    const railTieMat = new THREE.MeshLambertMaterial({ color: 0x78350f });

    for (let x = -60; x < -10; x += 1.8) {
      const tieGeo = new THREE.BoxGeometry(0.8, 0.15, 3.2);
      const tie = new THREE.Mesh(tieGeo, railTieMat);
      tie.position.set(x, 0.1, -55);
      tie.receiveShadow = true;
      this.scene.add(tie);
    }
    const rail1 = new THREE.Mesh(new THREE.BoxGeometry(50, 0.2, 0.15), railMat);
    rail1.position.set(-35, 0.2, -54);
    const rail2 = new THREE.Mesh(new THREE.BoxGeometry(50, 0.2, 0.15), railMat);
    rail2.position.set(-35, 0.2, -56);
    this.scene.add(rail1, rail2);
  }

  buildBuildings() {
    // 1. Ààfin Ọlọ́fà (The Royal Palace) - Center North
    this.createPalace(0, 48);

    // 2. Ọjà Òwódé (Owode Market) - West
    this.createMarket(-35, 20);

    // 3. Pápá Ìjàkadì (Wrestling Arena) - Center South
    this.createIjakadiArena(0, -22);

    // 4. FedPoly Offa (Mini Campus) - East
    this.createFedPoly(35, 20);

    // 5. Historic Offa Railway Station (NRC) - Southwest
    this.createRailwayStation(-38, -50);

    // 6. Your House (Popo Quarters) - Southeast
    this.createPlayerHome(25, -28);

    // 7. Avalon Hotel & Executive Lounge - Northeast
    this.createAvalonHotel(35, 48);

    // 8. Ojoku Road Sweet Potato Farmland - Northwest
    this.createFarmland(-40, 48);
  }

  createPalace(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Palace Main Hall
    const mainGeo = new THREE.BoxGeometry(18, 8, 12);
    const palMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
    const palace = new THREE.Mesh(mainGeo, palMat);
    palace.position.y = 4;
    palace.castShadow = true;
    palace.receiveShadow = true;
    group.add(palace);

    // Royal Traditional Roof (Golden Terracotta)
    const roofGeo = new THREE.ConeGeometry(14, 5, 4);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 10.5;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    // Pillars / Arches
    const colMat = new THREE.MeshLambertMaterial({ color: 0xfef08a });
    [-6, -2, 2, 6].forEach((cx) => {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 7, 8), colMat);
      col.position.set(cx, 3.5, 6.2);
      col.castShadow = true;
      group.add(col);
    });

    // Royal Courtyard Arch & Gate
    const archMat = new THREE.MeshLambertMaterial({ color: 0x92400e });
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(8, 1.2, 1.2), archMat);
    archTop.position.set(0, 5, 10);
    group.add(archTop);

    this.scene.add(group);
    this.registerInteractiveZone('olofa-palace', 'Ààfin Ọlọ́fà (Palace)', x, z - 8, 'Greet Olofa & Homage');
  }

  createMarket(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Market Plaza Ground
    const plaza = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 20),
      new THREE.MeshLambertMaterial({ color: 0x92400e }) // dirt / laterite
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.y = 0.04;
    group.add(plaza);

    // Colorful Canopy Stalls
    const umbrellaColors = [0xef4444, 0x10b981, 0x3b82f6, 0xf59e0b];
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        const uGroup = new THREE.Group();
        uGroup.position.set(col * 7, 0, row * 6);

        // Stall table
        const table = new THREE.Mesh(
          new THREE.BoxGeometry(3.5, 1, 2),
          new THREE.MeshLambertMaterial({ color: 0x78350f })
        );
        table.position.y = 0.5;
        uGroup.add(table);

        // Produce: Heaps of Sweet Potatoes (Orange / Yellow)
        const anamoGeo = new THREE.SphereGeometry(0.3, 6, 6);
        const anamoMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
        for (let p = 0; p < 6; p++) {
          const anamo = new THREE.Mesh(anamoGeo, anamoMat);
          anamo.scale.set(1.4, 0.8, 0.8);
          anamo.position.set((Math.random() - 0.5) * 2, 1.15, (Math.random() - 0.5) * 1.2);
          uGroup.add(anamo);
        }

        // Canopy Pole
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 3.5),
          new THREE.MeshLambertMaterial({ color: 0x64748b })
        );
        pole.position.y = 1.75;
        uGroup.add(pole);

        // Canopy Cone
        const colr = umbrellaColors[(Math.abs(row * 2 + col)) % umbrellaColors.length];
        const canopy = new THREE.Mesh(
          new THREE.ConeGeometry(2.5, 1.2, 8),
          new THREE.MeshLambertMaterial({ color: colr })
        );
        canopy.position.y = 3.6;
        uGroup.add(canopy);

        group.add(uGroup);
      }
    }

    this.scene.add(group);
    this.registerInteractiveZone('owode-market', 'Ọjà Òwódé (Owode Market)', x, z + 8, 'Haggle & Buy Goods');
  }

  createIjakadiArena(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Circular Sand Ring
    const sandGeo = new THREE.CylinderGeometry(7, 7, 0.25, 24);
    const sandMat = new THREE.MeshLambertMaterial({ color: 0xd97706 }); // Sand / laterite ring
    const sand = new THREE.Mesh(sandGeo, sandMat);
    sand.position.y = 0.12;
    sand.receiveShadow = true;
    group.add(sand);

    // Wooden Perimeter Barrier
    const fenceMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.2, 0.3), fenceMat);
      post.position.set(Math.cos(a) * 7.5, 0.6, Math.sin(a) * 7.5);
      group.add(post);
    }

    // Spectator Benches
    for (let a = -Math.PI / 1.5; a <= Math.PI / 1.5; a += Math.PI / 4) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(3, 0.8, 0.8), fenceMat);
      bench.position.set(Math.cos(a) * 10, 0.4, Math.sin(a) * 10);
      bench.rotation.y = -a + Math.PI / 2;
      group.add(bench);
    }

    this.scene.add(group);
    this.registerInteractiveZone('ijakadi-arena', 'Pápá Ìjàkadì (Arena)', x, z + 6, 'Challenge Wrestler');
  }

  createFedPoly(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Academic Tower
    const bldg = new THREE.Mesh(
      new THREE.BoxGeometry(16, 10, 10),
      new THREE.MeshLambertMaterial({ color: 0x1e3a8a })
    );
    bldg.position.y = 5;
    bldg.castShadow = true;
    group.add(bldg);

    // Entrance Glass
    const glass = new THREE.Mesh(
      new THREE.BoxGeometry(6, 4, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.8 })
    );
    glass.position.set(0, 2.5, 5.2);
    group.add(glass);

    // Clock tower on top
    const clock = new THREE.Mesh(
      new THREE.BoxGeometry(3, 4, 3),
      new THREE.MeshLambertMaterial({ color: 0x1d4ed8 })
    );
    clock.position.y = 12;
    group.add(clock);

    this.scene.add(group);
    this.registerInteractiveZone('fedpoly-mini', 'FedPoly Offa Campus', x, z - 8, 'Attend Lecture & Tech');
  }

  createRailwayStation(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Station House
    const depot = new THREE.Mesh(
      new THREE.BoxGeometry(14, 5, 6),
      new THREE.MeshLambertMaterial({ color: 0x991b1b }) // red brick
    );
    depot.position.y = 2.5;
    group.add(depot);

    // Station Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(9, 2.5, 4),
      new THREE.MeshLambertMaterial({ color: 0x334155 })
    );
    roof.position.y = 6;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    this.scene.add(group);
    this.registerInteractiveZone('offa-railway', 'Historic Railway Station', x, z + 6, 'Train & Cargo Hustle');
  }

  createPlayerHome(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // House
    const house = new THREE.Mesh(
      new THREE.BoxGeometry(8, 4.5, 8),
      new THREE.MeshLambertMaterial({ color: 0x0f766e })
    );
    house.position.y = 2.25;
    house.castShadow = true;
    group.add(house);

    // Slanted Roof
    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(6.5, 2.5, 4),
      new THREE.MeshLambertMaterial({ color: 0xb45309 })
    );
    roof.position.y = 5.5;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    // Tiger Generator Humming Outside
    const gen = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.7, 0.6),
      new THREE.MeshLambertMaterial({ color: 0xf59e0b })
    );
    gen.position.set(4.6, 0.35, 2);
    group.add(gen);

    this.scene.add(group);
    this.registerInteractiveZone('residential-quarters', 'Your Home (Popo)', x, z + 6, 'Sleep & Manage Home');
  }

  createAvalonHotel(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Luxury Hotel Building
    const hotel = new THREE.Mesh(
      new THREE.BoxGeometry(16, 9, 10),
      new THREE.MeshLambertMaterial({ color: 0x581c87 })
    );
    hotel.position.y = 4.5;
    group.add(hotel);

    // Swimming Pool
    const pool = new THREE.Mesh(
      new THREE.BoxGeometry(10, 0.4, 6),
      new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
    );
    pool.position.set(0, 0.2, 9);
    group.add(pool);

    this.scene.add(group);
    this.registerInteractiveZone('avalon-hotel', 'Avalon Hotel & Lounge', x, z - 8, 'Swim & VIP Dine');
  }

  createFarmland(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Soil Bed
    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.3, 14),
      new THREE.MeshLambertMaterial({ color: 0x365314 })
    );
    soil.position.y = 0.15;
    group.add(soil);

    // Ridges & Sweet Potato Foliage
    for (let rz = -5; rz <= 5; rz += 2.5) {
      const ridge = new THREE.Mesh(
        new THREE.BoxGeometry(16, 0.4, 1.2),
        new THREE.MeshLambertMaterial({ color: 0x4d7c0f })
      );
      ridge.position.set(0, 0.35, rz);
      group.add(ridge);

      // Sweet Potato Green Leaves & Golden Tubers peeking
      for (let rx = -6; rx <= 6; rx += 2) {
        const plant = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.35),
          new THREE.MeshLambertMaterial({ color: 0x84cc16 })
        );
        plant.position.set(rx, 0.7, rz);
        group.add(plant);
      }
    }

    this.scene.add(group);
    this.registerInteractiveZone('anamo-farms', 'Anamọ Farmlands', x, z - 8, 'Harvest Sweet Potatoes');
  }

  buildFlora() {
    // Palm trees and neem trees dotted around Offa
    const treeCoords = [
      [-15, 15], [15, 15], [-15, -15], [15, -15],
      [-55, 30], [-55, -30], [55, 30], [55, -30],
      [10, 35], [-10, 35], [20, -50], [-20, -50]
    ];

    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const foliageMat = new THREE.MeshLambertMaterial({ color: 0x166534 });

    treeCoords.forEach(([tx, tz]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 4, 8), trunkMat);
      trunk.position.set(tx, 2, tz);
      trunk.castShadow = true;
      this.scene.add(trunk);

      const leaves = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4, 8), foliageMat);
      leaves.position.set(tx, 5, tz);
      leaves.castShadow = true;
      this.scene.add(leaves);
    });
  }

  spawnNPCs() {
    // 3D Living Human NPCs walking the streets
    const npcDefs = [
      { name: 'Mama Risi', color: 0xf59e0b, capColor: 0xec4899, x: -30, z: 12, targetX: -20, targetZ: 12 },
      { name: 'FedPoly Scholar', color: 0x3b82f6, capColor: 0x1e3a8a, x: 25, z: 12, targetX: 35, targetZ: 12 },
      { name: 'Palace Guard', color: 0x991b1b, capColor: 0xfacc15, x: 4, z: 40, targetX: -4, targetZ: 40 },
      { name: 'Ijakadi Novice', color: 0xef4444, capColor: 0x000000, x: -6, z: -20, targetX: 6, targetZ: -20 },
      { name: 'Owambe Guest', color: 0x8b5cf6, capColor: 0xfbbf24, x: 18, z: -15, targetX: 18, targetZ: -25 }
    ];

    npcDefs.forEach((def) => {
      const npc = new Character3D({
        color: def.color,
        capColor: def.capColor,
        isNPC: true,
        name: def.name
      });
      npc.group.position.set(def.x, 0, def.z);
      this.scene.add(npc.group);

      this.npcs.push({
        character: npc,
        x: def.x,
        z: def.z,
        originX: def.x,
        originZ: def.z,
        targetX: def.targetX,
        targetZ: def.targetZ,
        speed: 1.8 + Math.random() * 0.8
      });
    });
  }

  registerInteractiveZone(id, name, x, z, actionHint) {
    this.interactiveZones.push({ id, name, x, z, actionHint });

    // Floating 3D Landmark Beacon Marker
    const markerGeo = new THREE.ConeGeometry(0.6, 1.2, 4);
    const markerMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const marker = new THREE.Mesh(markerGeo, markerMat);
    marker.rotation.x = Math.PI; // point down
    marker.position.set(x, 4.5, z);
    this.scene.add(marker);
    this.buildings.push({ marker, x, z });
  }

  update(dt) {
    // Animate NPCs walking between waypoints
    this.npcs.forEach((npcObj) => {
      const dx = npcObj.targetX - npcObj.x;
      const dz = npcObj.targetZ - npcObj.z;
      const dist = Math.hypot(dx, dz);

      if (dist > 0.5) {
        const step = npcObj.speed * dt;
        npcObj.x += (dx / dist) * step;
        npcObj.z += (dz / dist) * step;
        npcObj.character.group.position.set(npcObj.x, 0, npcObj.z);
        npcObj.character.group.rotation.y = Math.atan2(dx, dz);
        npcObj.character.update(dt, true, 0.8);
      } else {
        // Reverse direction
        const tmpX = npcObj.targetX;
        const tmpZ = npcObj.targetZ;
        npcObj.targetX = npcObj.originX;
        npcObj.targetZ = npcObj.originZ;
        npcObj.originX = tmpX;
        npcObj.originZ = tmpZ;
      }
    });

    // Bob floating landmark markers
    const time = performance.now() * 0.003;
    this.buildings.forEach((b) => {
      if (b.marker) {
        b.marker.position.y = 4.5 + Math.sin(time) * 0.3;
        b.marker.rotation.y += dt * 1.5;
      }
    });
  }

  getClosestZone(playerX, playerZ, threshold = 7.0) {
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
}
