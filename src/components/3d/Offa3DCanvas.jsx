import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { Character3D } from './Character3D';
import { World3D } from './World3D';
import { LOCATIONS } from '../../data/locations';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Swords,
  Flame,
  Shield,
  Music,
  Wine,
  Car,
  Utensils,
  Wheat,
  Crown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';

// Free Fire & Call of Duty Hero Operatives
export const OPERATOR_ROSTER = [
  {
    id: 'major-marshall',
    name: 'Major Marshall',
    title: 'Tactical Enforcer',
    icon: '🎖️',
    shirtColor: 0x1e293b,
    vestColor: 0x090d16,
    pantsColor: 0x334155,
    camoAccent: 0x059669, // Emerald
    desc: 'Call of Duty style tactical commander with Kevlar plate carrier and combat harness.',
  },
  {
    id: 'alaga-pop',
    name: 'Alaga of Popo',
    title: 'Free Fire Street King',
    icon: '👑',
    shirtColor: 0xef4444, // Red
    vestColor: 0x18181b,
    pantsColor: 0x27272a,
    camoAccent: 0xf59e0b, // Gold
    desc: 'Free Fire swagger operative with gold chain, streetwear vest, and combat shades.',
  },
  {
    id: 'moremi-shadow',
    name: 'Moremi Shadow',
    title: 'Elite Spec-Ops Operative',
    icon: '⚡',
    shirtColor: 0x0f172a,
    vestColor: 0x0284c7, // Cyan tactical
    pantsColor: 0x1e293b,
    camoAccent: 0x38bdf8,
    desc: 'Lightning-fast urban reconnaissance operative with sleek carbon-fiber armor.',
  },
  {
    id: 'anamo-rebel',
    name: 'Anamo Commander',
    title: 'Agro-Militia Titan',
    icon: '🍠',
    shirtColor: 0x3f6212, // Olive Camo
    vestColor: 0x1a2e05,
    pantsColor: 0x4d7c0f,
    camoAccent: 0xca8a04,
    desc: 'Battle-hardened defender of Offa sweet potato farmlands with heavy tactical rig.',
  },
];

export const Offa3DCanvas = ({ onInteractLocation }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const { player, world, setPlayer, advanceTime, addLog } = useGame();

  // 3D Scene refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const player3DRef = useRef(null);
  const world3DRef = useRef(null);
  const animFrameRef = useRef(null);

  // Position, Rotation, Action
  const posRef = useRef({ x: 0, z: 8 });
  const rotYRef = useRef(0);
  const isMovingRef = useRef(false);
  const currentActionRef = useRef('idle');
  const actionTimeoutRef = useRef(null);
  const isDrivingRef = useRef(false);
  const drivingMeshRef = useRef(null); // visible keke vehicle shown when driving

  // Operator selection
  const [selectedOperator, setSelectedOperator] = useState(OPERATOR_ROSTER[0]);
  const [isLockerOpen, setIsLockerOpen] = useState(false);

  // Nearby Interactive Zone & Combat Target
  const [nearbyZone, setNearbyZone] = useState(null);
  const [nearbyEnemy, setNearbyEnemy] = useState(null);
  const [reactionMsg, setReactionMsg] = useState(null);

  const [isDriving, setIsDriving] = useState(false);
  // Inputs
  const keysPressed = useRef({});
  const touchInput = useRef({ x: 0, y: 0 });

  // Camera Orbit
  const camAngleRef = useRef({ theta: 0, phi: 0.5, dist: 13.5 });
  const isDraggingCam = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(world.timeOfDay === 'Night' ? 0x050814 : 0x7dd3fc);
    scene.fog = new THREE.FogExp2(world.timeOfDay === 'Night' ? 0x050814 : 0xbae6fd, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      300
    );
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.75);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.position.set(45, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);

    // 5. Build 3D World (with Nightclub, Combat Arena, Stalls, Farmlands)
    const world3D = new World3D(scene);
    world3DRef.current = world3D;

    // 6. Spawn Call of Duty / Free Fire Hero Avatar
    const player3D = new Character3D({
      shirtColor: selectedOperator.shirtColor,
      vestColor: selectedOperator.vestColor,
      pantsColor: selectedOperator.pantsColor,
      camoAccent: selectedOperator.camoAccent,
      name: selectedOperator.name,
    });
    player3D.group.position.set(posRef.current.x, 0, posRef.current.z);
    scene.add(player3D.group);
    player3DRef.current = player3D;

    // 7. Keke Marwa driving mesh (hidden until player mounts)
    const kekeGrp = new THREE.Group();
    const kBodyMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.4 });
    const kBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.0, 1.7), kBodyMat);
    kBody.position.y = 0.6;
    kBody.castShadow = true;
    kekeGrp.add(kBody);
    // Windscreen
    const wsMat = new THREE.MeshStandardMaterial({ color: 0x93c5fd, opacity: 0.65, transparent: true });
    const ws = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.4), wsMat);
    ws.position.set(-1.72, 0.7, 0); ws.rotation.y = Math.PI / 2;
    kekeGrp.add(ws);
    // Wheels
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
    const rimMat   = new THREE.MeshStandardMaterial({ color: 0x6b7280, metalness: 0.8 });
    kekeGrp._wheels = [];
    [[-1.1, -0.2, -0.85], [1.1, -0.2, -0.85], [0, -0.2, 0.85]].forEach(([wx, wy, wz]) => {
      const wh = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.28, 12), wheelMat);
      wh.rotation.z = Math.PI / 2; wh.position.set(wx, wy, wz);
      kekeGrp.add(wh); kekeGrp._wheels.push(wh);
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3, 8), rimMat);
      rim.rotation.z = Math.PI / 2; rim.position.set(wx, wy, wz);
      kekeGrp.add(rim);
    });
    kekeGrp.visible = false;
    scene.add(kekeGrp);
    drivingMeshRef.current = kekeGrp;

    // 8. Animation Loop
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Calculate Player Movement
      let moveX = 0;
      let moveZ = 0;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveZ -= 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveZ += 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += 1;

      if (touchInput.current.x !== 0 || touchInput.current.y !== 0) {
        moveX = touchInput.current.x;
        moveZ = touchInput.current.y;
      }

      const isMoving = moveX !== 0 || moveZ !== 0;
      isMovingRef.current = isMoving;

      let speed = isDrivingRef.current ? 22.0 : 10.0;
      if (keysPressed.current['shift']) speed *= 1.45; // CoD Tactical Sprint

      if (isMoving) {
        currentActionRef.current = isDrivingRef.current ? 'drive' : 'walk';
        const len = Math.hypot(moveX, moveZ);
        const normX = (moveX / len) * speed * dt;
        const normZ = (moveZ / len) * speed * dt;

        posRef.current.x = Math.max(-75, Math.min(75, posRef.current.x + normX));
        posRef.current.z = Math.max(-75, Math.min(75, posRef.current.z + normZ));

        rotYRef.current = Math.atan2(moveX, moveZ);
      } else if (currentActionRef.current === 'walk') {
        currentActionRef.current = isDrivingRef.current ? 'drive' : 'idle';
      }

      // Update Character 3D Animations
      if (player3DRef.current) {
        player3DRef.current.group.position.set(posRef.current.x, 0, posRef.current.z);
        player3DRef.current.group.rotation.y = rotYRef.current;
        player3DRef.current.setAnimation(currentActionRef.current);
        player3DRef.current.update(dt, isMoving, speed / 10.0);
      }

      // Update driving vehicle mesh position & wheel spin
      if (drivingMeshRef.current) {
        const keke = drivingMeshRef.current;
        const driving = isDrivingRef.current;
        keke.visible = driving;
        if (driving) {
          keke.position.set(posRef.current.x, 0, posRef.current.z);
          keke.rotation.y = rotYRef.current;
          // Sink player into seat
          if (player3DRef.current) player3DRef.current.group.position.y = 0.55;
          // Spin wheels proportional to speed
          if (keke._wheels) {
            keke._wheels.forEach((wh) => { wh.rotation.x += speed * dt * 2.0; });
          }
          // Widen camera slightly for vehicle context
          camAngleRef.current.dist = 18;
        } else {
          if (player3DRef.current) player3DRef.current.group.position.y = 0;
          camAngleRef.current.dist = 13.5;
        }
      }

      // Update 3D World (Nightclub lights, NPC patrol walks, birds, clouds)
      if (world3DRef.current) {
        const isNightNow = world.timeOfDay === 'Night';
        world3DRef.current.update(dt, isNightNow);
        const zone = world3DRef.current.getClosestZone(posRef.current.x, posRef.current.z);
        setNearbyZone(zone);
        const enemy = world3DRef.current.getClosestEnemy(posRef.current.x, posRef.current.z);
        setNearbyEnemy(enemy);
      }

      // Smooth 3rd-Person Camera Tracking
      const targetX = posRef.current.x;
      const targetZ = posRef.current.z;
      const targetY = 1.3;

      const { theta, phi, dist } = camAngleRef.current;
      const camX = targetX + dist * Math.sin(theta) * Math.cos(phi);
      const camY = targetY + dist * Math.sin(phi);
      const camZ = targetZ + dist * Math.cos(theta) * Math.cos(phi);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(targetX, targetY, targetZ);

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
    };
  }, [selectedOperator]);

  // Day/Night atmosphere updates
  useEffect(() => {
    if (!sceneRef.current) return;
    const isNight = world.timeOfDay === 'Night';
    const isEvening = world.timeOfDay === 'Evening';

    if (isNight) {
      sceneRef.current.background = new THREE.Color(0x050814);
      sceneRef.current.fog.color = new THREE.Color(0x050814);
    } else if (isEvening) {
      sceneRef.current.background = new THREE.Color(0xd97706);
      sceneRef.current.fog.color = new THREE.Color(0xd97706);
    } else {
      sceneRef.current.background = new THREE.Color(0x7dd3fc);
      sceneRef.current.fog.color = new THREE.Color(0xbae6fd);
    }
  }, [world.timeOfDay]);

  // Keyboard controls (WASD, Arrows, E to enter, F to drive, Space to punch)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;

      if (k === 'e' || k === 'enter') {
        if (nearbyZone) handleEnterBuilding(nearbyZone);
      }
      if (k === ' ' || k === 'f') {
        handlePunchCombat();
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyZone, nearbyEnemy]);

  // Orbit Camera Controls
  const handleMouseDown = (e) => {
    isDraggingCam.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingCam.current) return;
    const dx = e.clientX - prevMousePos.current.x;
    const dy = e.clientY - prevMousePos.current.y;
    prevMousePos.current = { x: e.clientX, y: e.clientY };

    camAngleRef.current.theta -= dx * 0.008;
    camAngleRef.current.phi = Math.max(0.15, Math.min(1.2, camAngleRef.current.phi + dy * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingCam.current = false;
  };

  // --- REAL 3D ACTION & COMBAT MECHANICS ---

  // 1. Fight / Combat (3-Hit Martial Combo)
  const handlePunchCombat = () => {
    sound.playWrestlingHit();
    currentActionRef.current = 'fight_punch';

    if (nearbyEnemy) {
      // Connect hit on 3D enemy
      nearbyEnemy.hp = Math.max(0, nearbyEnemy.hp - 35);
      setReactionMsg(`💥 Hit Landed on ${nearbyEnemy.name}! (-35 HP)`);

      if (nearbyEnemy.hp <= 0) {
        sound.playVictory();
        confetti({ particleCount: 70, spread: 70 });
        setReactionMsg(`🏆 Knockout! Defeated ${nearbyEnemy.name}! (+₦25,000 Loot)`);
        setPlayer((prev) => ({
          ...prev,
          cash: prev.cash + 25000,
          stats: {
            ...prev.stats,
            respect: Math.min(100, prev.stats.respect + 15),
            strength: Math.min(100, prev.stats.strength + 8),
          },
        }));
        addLog(`💥 Victory! Knocked down ${nearbyEnemy.name} in 3D combat! Collected ₦25,000 loot.`);
      }
    } else {
      setReactionMsg('🥋 3-Hit Combat Combo (Jab, Cross, Hook)!');
    }

    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      currentActionRef.current = 'idle';
      setReactionMsg(null);
    }, 1200);
  };

  // 2. High Flying Kick
  const handleFlyingKick = () => {
    sound.playWrestlingHit();
    currentActionRef.current = 'fight_kick';

    if (nearbyEnemy) {
      nearbyEnemy.hp = Math.max(0, nearbyEnemy.hp - 50);
      setReactionMsg(`⚡ Critical Flying Kick on ${nearbyEnemy.name}! (-50 HP)`);
    } else {
      setReactionMsg('🥋 Free Fire High Flying Martial Kick!');
    }

    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      currentActionRef.current = 'idle';
      setReactionMsg(null);
    }, 1400);
  };

  // 3. Tactical Guard / Block
  const handleBlock = () => {
    sound.playClick();
    currentActionRef.current = 'fight_block';
    setReactionMsg('🛡️ Tactical Defense Block Activated!');

    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      currentActionRef.current = 'idle';
      setReactionMsg(null);
    }, 1500);
  };

  // 4. Nightclub Afrobeats Dance (Go to the Club!)
  const handleClubDance = () => {
    sound.playTalkingDrum();
    currentActionRef.current = 'club_dance';
    setReactionMsg('💃 Dancing to Afrobeats on Avalon Nightclub LED Floor! (100% Fun)');
    confetti({ particleCount: 60, spread: 80 });

    setPlayer((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        fun: 100,
        social: Math.min(100, prev.stats.social + 20),
      },
    }));
    addLog(`🎉 Partying at Avalon Nightclub! Dropping VIP dance moves on the neon floor.`);

    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      currentActionRef.current = 'idle';
      setReactionMsg(null);
    }, 3500);
  };

  // 5. VIP Drinks at Club Bar
  const handleClubDrink = () => {
    sound.playCash();
    currentActionRef.current = 'club_drink';
    setReactionMsg('🥂 Toasting VIP Champagne at the Club Bar! (+25 Energy)');

    setPlayer((prev) => ({
      ...prev,
      cash: Math.max(0, prev.cash - 2500),
      stats: {
        ...prev.stats,
        energy: Math.min(100, prev.stats.energy + 25),
        fun: 100,
      },
    }));
    addLog(`🍾 Popped bottles at Avalon VIP Lounge! Chilled vibes with friends.`);

    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      currentActionRef.current = 'idle';
      setReactionMsg(null);
    }, 2500);
  };

  // 6. Free Fire Winner Emote
  const handleWinnerFlex = () => {
    sound.playVictory();
    confetti({ particleCount: 90, spread: 90 });
    currentActionRef.current = 'victory_flex';
    setReactionMsg('🏆 Free Fire Winner Double Bicep Emote Flex!');

    clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => {
      currentActionRef.current = 'idle';
      setReactionMsg(null);
    }, 2800);
  };

  // 7. Mount / Drive Vehicle
  const handleToggleDrive = () => {
    sound.playClick();
    const nowDriving = !isDrivingRef.current;
    isDrivingRef.current = nowDriving;
    setIsDriving(nowDriving);
    if (nowDriving) {
      currentActionRef.current = 'drive';
      setReactionMsg('🚗 Keke Marwa Mounted! Cruising Olofa Way at high speed!');
      addLog(`🏎️ Mounted Keke Marwa — cruising through Offa streets!`);
    } else {
      currentActionRef.current = 'idle';
      setReactionMsg('🚶 Dismounted vehicle. Walking on foot.');
    }
  };

  // Teleport to Nightclub
  const handleGoToClub = () => {
    sound.playClick();
    posRef.current.x = 42;
    posRef.current.z = 63;
    setReactionMsg('🪩 Arrived at Avalon Nightclub & VIP Lounge!');
    addLog('🪩 Stepped into Avalon Nightclub & VIP Lounge! Neon lights pulsing.');
  };

  // Teleport to Combat Arena
  const handleGoToArena = () => {
    sound.playClick();
    posRef.current.x = 0;
    posRef.current.z = -23;
    setReactionMsg('🥊 Arrived at the Ijakadi Combat Arena!');
    addLog('🥊 Stepped into the sacred Ijakadi Combat Sand Ring!');
  };

  const handleEnterBuilding = (zone) => {
    sound.playClick();
    const loc = LOCATIONS.find((l) => l.id === zone.id);
    if (loc) {
      setPlayer((prev) => ({
        ...prev,
        currentLocationId: zone.id,
      }));
      if (onInteractLocation) onInteractLocation(loc);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="relative w-full h-[540px] sm:h-[660px] lg:h-[720px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 select-none cursor-grab active:cursor-grabbing"
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Top Left: Free Fire / CoD Tactical HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-emerald-500/40 text-xs shadow-2xl text-white">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-black tracking-wider text-emerald-400 font-mono">
            OPERATOR: {selectedOperator.name.toUpperCase()}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-300 font-bold">{selectedOperator.title}</span>
        </div>

        {/* Combat Status Banner */}
        {nearbyEnemy && (
          <div className="px-3.5 py-2 rounded-2xl bg-red-950/90 backdrop-blur-md border border-red-500/50 text-xs text-red-200 shadow-xl flex items-center gap-2 animate-pulse">
            <Swords className="w-4 h-4 text-red-400" />
            <span>
              Target in Range: <strong className="text-white">{nearbyEnemy.name}</strong> ({nearbyEnemy.hp}/{nearbyEnemy.maxHp} HP)
            </span>
          </div>
        )}
      </div>

      {/* Top Floating Reaction Text */}
      {reactionMsg && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 text-white font-black text-xs shadow-2xl border border-white/40 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
            <span>{reactionMsg}</span>
          </div>
        </div>
      )}

      {/* Top Right: Fast Reality Portals (Club, Arena, Locker) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={handleGoToClub}
          className="px-3 py-1.5 rounded-xl bg-pink-950/90 hover:bg-pink-900 border border-pink-500/50 text-pink-300 text-xs font-black shadow-xl flex items-center gap-1.5 transition"
        >
          <Music className="w-3.5 h-3.5 text-pink-400" />
          <span>Go to Club</span>
        </button>

        <button
          onClick={handleGoToArena}
          className="px-3 py-1.5 rounded-xl bg-amber-950/90 hover:bg-amber-900 border border-amber-500/50 text-amber-300 text-xs font-black shadow-xl flex items-center gap-1.5 transition"
        >
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>Fight Arena</span>
        </button>

        <button
          onClick={() => setIsLockerOpen(!isLockerOpen)}
          className="px-3 py-1.5 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-black shadow-xl flex items-center gap-1.5 transition"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Avatars</span>
        </button>
      </div>

      {/* Operator Locker Modal (Free Fire / CoD Character Selection) */}
      {isLockerOpen && (
        <div className="absolute top-16 right-4 z-40 bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-3xl p-4 shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
            <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider">
              Select 3D Hero Operative
            </h3>
            <button
              onClick={() => setIsLockerOpen(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {OPERATOR_ROSTER.map((op) => (
              <div
                key={op.id}
                onClick={() => {
                  setSelectedOperator(op);
                  setIsLockerOpen(false);
                  sound.playVictory();
                }}
                className={`p-2.5 rounded-2xl border cursor-pointer transition flex items-center gap-3 ${
                  selectedOperator.id === op.id
                    ? 'bg-emerald-950/70 border-emerald-500 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xl shrink-0">
                  {op.icon}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs text-white">{op.name}</h4>
                    <span className="text-[10px] text-amber-400 font-semibold">({op.title})</span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{op.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proximity Action Prompt */}
      {nearbyZone && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom duration-200">
          <button
            onClick={() => handleEnterBuilding(nearbyZone)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-sm shadow-2xl flex items-center gap-3 border border-emerald-300/40 transform hover:scale-105 transition"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>ENTER {nearbyZone.name.toUpperCase()} (Press [E] or Tap)</span>
          </button>
        </div>
      )}

      {/* Bottom Floating Action Bar: FIGHT, CLUB, DRIVE, EMOTE */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Left: Mobile Joystick */}
        <div className="flex flex-col items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-2xl sm:hidden">
          <button
            onTouchStart={() => (touchInput.current = { x: 0, y: -1 })}
            onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
            className="w-9 h-9 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <button
              onTouchStart={() => (touchInput.current = { x: -1, y: 0 })}
              onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
              className="w-9 h-9 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
              🕹️
            </div>
            <button
              onTouchStart={() => (touchInput.current = { x: 1, y: 0 })}
              onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
              className="w-9 h-9 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onTouchStart={() => (touchInput.current = { x: 0, y: 1 })}
            onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
            className="w-9 h-9 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Right / Center: Real 3D Physical Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* COMBAT ACTIONS */}
          <button
            onClick={handlePunchCombat}
            className="px-3.5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-xl flex items-center gap-2 transition active:scale-95 border border-red-400/40"
          >
            <Flame className="w-4 h-4" />
            <span>PUNCH COMBO</span>
          </button>

          <button
            onClick={handleFlyingKick}
            className="px-3.5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-xl flex items-center gap-2 transition active:scale-95 border border-amber-400/40"
          >
            <Zap className="w-4 h-4" />
            <span>FLYING KICK</span>
          </button>

          <button
            onClick={handleBlock}
            className="px-3 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 shadow-xl transition"
          >
            <Shield className="w-4 h-4 text-teal-400" />
            <span>BLOCK</span>
          </button>

          {/* NIGHTCLUB ACTIONS */}
          <button
            onClick={handleClubDance}
            className="px-3.5 py-2.5 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-black text-xs shadow-xl flex items-center gap-2 transition active:scale-95 border border-pink-400/40"
          >
            <Music className="w-4 h-4" />
            <span>CLUB DANCE</span>
          </button>

          <button
            onClick={handleClubDrink}
            className="px-3 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-xl flex items-center gap-2 transition active:scale-95 border border-purple-400/40"
          >
            <Wine className="w-4 h-4" />
            <span>POP BOTTLES</span>
          </button>

          {/* VEHICLE DRIVE */}
          <button
            onClick={handleToggleDrive}
            className={`px-3.5 py-2.5 rounded-2xl font-black text-xs shadow-xl flex items-center gap-2 transition active:scale-95 border ${
              isDriving
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}
          >
            <Car className="w-4 h-4 text-emerald-400" />
            <span>{isDriving ? 'DISMOUNT KEKE' : '🚗 DRIVE KEKE'}</span>
          </button>

          {/* VICTORY EMOTE */}
          <button
            onClick={handleWinnerFlex}
            className="px-3 py-2.5 rounded-2xl bg-yellow-600 hover:bg-yellow-500 text-white font-black text-xs shadow-xl flex items-center gap-1.5 transition active:scale-95 border border-yellow-300/40"
          >
            <span>🏆 EMOTE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
