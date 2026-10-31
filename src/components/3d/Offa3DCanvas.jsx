import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { Character3D } from './Character3D';
import { World3D } from './World3D';
import { LOCATIONS } from '../../data/locations';
import { sound } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Footprints,
  Utensils,
  Wheat,
  Crown,
  Flame,
  Music,
  Moon,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Camera,
} from 'lucide-react';

export const Offa3DCanvas = ({ onInteractLocation }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  const { player, world, setPlayer, advanceTime, addLog } = useGame();

  // 3D Scene references
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const player3DRef = useRef(null);
  const world3DRef = useRef(null);
  const animFrameRef = useRef(null);

  // Player position & movement
  const posRef = useRef({ x: 0, z: 12 });
  const rotYRef = useRef(0);
  const isMovingRef = useRef(false);
  const currentActionRef = useRef('idle');

  // Interactive Prompt
  const [nearbyZone, setNearbyZone] = useState(null);
  const [reactionMsg, setReactionMsg] = useState(null);

  // Touch & Keyboard inputs
  const keysPressed = useRef({});
  const touchInput = useRef({ x: 0, y: 0 });

  // Camera Orbit angles
  const camAngleRef = useRef({ theta: 0, phi: 0.55, dist: 14 });
  const isDraggingCam = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  // Setup Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(world.timeOfDay === 'Night' ? 0x050814 : 0x7dd3fc); // Sky blue or night
    scene.fog = new THREE.FogExp2(world.timeOfDay === 'Night' ? 0x050814 : 0xbae6fd, 0.012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      50,
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
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.7);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.2);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 150;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -45;
    scene.add(sunLight);

    // 5. Build 3D City of Offa
    const world3D = new World3D(scene);
    world3DRef.current = world3D;

    // 6. Spawn Articulated 3D Human Player
    const player3D = new Character3D({
      color: 0x059669, // Emerald Yoruba buba
      skinColor: 0x78350f,
      capColor: 0xfbbf24,
      name: player.name,
    });
    player3D.group.position.set(posRef.current.x, 0, posRef.current.z);
    scene.add(player3D.group);
    player3DRef.current = player3D;

    // 7. Animation Loop
    let lastTime = performance.now();

    const animate = (now) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Player Movement Logic
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

      let speed = 9.0;
      if (keysPressed.current['shift']) speed = 14.5;
      if (player.vehicleId === 'bajaj-okada') speed = 18.0;
      if (player.vehicleId === 'mercedes-gwagon') speed = 24.0;

      if (isMoving) {
        currentActionRef.current = 'walk';
        const len = Math.hypot(moveX, moveZ);
        const normX = (moveX / len) * speed * dt;
        const normZ = (moveZ / len) * speed * dt;

        posRef.current.x = Math.max(-70, Math.min(70, posRef.current.x + normX));
        posRef.current.z = Math.max(-70, Math.min(70, posRef.current.z + normZ));

        rotYRef.current = Math.atan2(moveX, moveZ);
      } else if (currentActionRef.current === 'walk') {
        currentActionRef.current = 'idle';
      }

      // Update Player 3D Mesh
      if (player3DRef.current) {
        player3DRef.current.group.position.set(posRef.current.x, 0, posRef.current.z);
        player3DRef.current.group.rotation.y = rotYRef.current;
        player3DRef.current.setAnimation(currentActionRef.current);
        player3DRef.current.update(dt, isMoving, speed / 9.0);
      }

      // Update 3D World NPCs & Billboards
      if (world3DRef.current) {
        world3DRef.current.update(dt);
        const zone = world3DRef.current.getClosestZone(posRef.current.x, posRef.current.z);
        setNearbyZone(zone);
      }

      // Smooth 3rd-Person Camera Follow
      const targetX = posRef.current.x;
      const targetZ = posRef.current.z;
      const targetY = 1.2;

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
  }, []);

  // Update Day/Night Atmosphere when world changes
  useEffect(() => {
    if (!sceneRef.current) return;
    const isNight = world.timeOfDay === 'Night';
    const isEvening = world.timeOfDay === 'Evening';

    if (isNight) {
      sceneRef.current.background = new THREE.Color(0x050814);
      sceneRef.current.fog.color = new THREE.Color(0x050814);
    } else if (isEvening) {
      sceneRef.current.background = new THREE.Color(0xf59e0b);
      sceneRef.current.fog.color = new THREE.Color(0xfbbf24);
    } else {
      sceneRef.current.background = new THREE.Color(0x7dd3fc);
      sceneRef.current.fog.color = new THREE.Color(0xbae6fd);
    }
  }, [world.timeOfDay]);

  // Keyboard Listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;
      if (k === 'e' || k === 'enter') {
        if (nearbyZone) handleEnterBuilding(nearbyZone);
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
  }, [nearbyZone]);

  // Orbit Camera Drag Controls
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
    camAngleRef.current.phi = Math.max(0.2, Math.min(1.2, camAngleRef.current.phi + dy * 0.008));
  };

  const handleMouseUp = () => {
    isDraggingCam.current = false;
  };

  // --- Real Physical Reactions to Actions ---

  const triggerPhysicalAction = (actionType, label, onExecute) => {
    sound.playClick();
    currentActionRef.current = actionType;
    setReactionMsg(label);

    if (onExecute) onExecute();

    setTimeout(() => {
      if (currentActionRef.current === actionType) {
        currentActionRef.current = 'idle';
      }
      setReactionMsg(null);
    }, 2800);
  };

  // 1. Eat Roasted Sweet Potato Reaction
  const handleEatReaction = () => {
    triggerPhysicalAction('eat', '🍠 Eating Hot Roasted Anamo Offa with Pepper Sauce! (+35 Hunger)', () => {
      sound.playCash();
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          hunger: Math.min(100, prev.stats.hunger + 35),
          energy: Math.min(100, prev.stats.energy + 20),
          fun: Math.min(100, prev.stats.fun + 15),
        },
      }));
      addLog(`😋 Physically ate hot roasted Anamo Offa! Restored hunger and energy.`);
    });
  };

  // 2. Dig & Harvest Farmland Reaction
  const handleHarvestReaction = () => {
    triggerPhysicalAction('harvest', '🌾 Swinging Hoe & Harvesting Golden Tubers! (+₦12,000)', () => {
      sound.playVictory();
      confetti({ particleCount: 50, spread: 60 });
      setPlayer((prev) => ({
        ...prev,
        cash: prev.cash + 12000,
        harvestCount: prev.harvestCount + 4,
        stats: {
          ...prev.stats,
          energy: Math.max(0, prev.stats.energy - 12),
          respect: Math.min(100, prev.stats.respect + 4),
        },
      }));
      addLog(`🍠 Harvested ripe sweet potato tubers from the 3D farmland! Pocketed ₦12,000.`);
    });
  };

  // 3. Traditional Yoruba Royal Homage (Ìdọ̀bálẹ̀) Reaction
  const handleHomageReaction = () => {
    triggerPhysicalAction('prostrate', '👑 Ìdọ̀bálẹ̀: Prostrating in Royal Homage to the Olofa! (+20 Respect)', () => {
      sound.playTalkingDrum();
      confetti({ particleCount: 60, spread: 70 });
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          respect: Math.min(100, prev.stats.respect + 20),
          fun: Math.min(100, prev.stats.fun + 10),
        },
      }));
      addLog(`👑 Prostrated in royal homage before the Olofa of Offa! Conferred royal blessings.`);
    });
  };

  // 4. Ijakadi Wrestling Stance Reaction
  const handleWrestleReaction = () => {
    triggerPhysicalAction('wrestle', '🤼 Traditional Ijakadi Martial Stance & Combat Drill!', () => {
      sound.playWrestlingHit();
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          strength: Math.min(100, prev.stats.strength + 5),
          energy: Math.max(0, prev.stats.energy - 10),
          fun: Math.min(100, prev.stats.fun + 15),
        },
      }));
      addLog(`🤼 Exercised Ijakadi martial drills in the 3D sand arena!`);
    });
  };

  // 5. Owambe Dance & Spray Naira Reaction
  const handleDanceReaction = () => {
    triggerPhysicalAction('dance', '💃 Owambe Dance (Gbe Body E!) Spraying Naira Notes!', () => {
      sound.playVictory();
      confetti({ particleCount: 80, spread: 80 });
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          fun: 100,
          social: Math.min(100, prev.stats.social + 25),
        },
      }));
      addLog(`🎉 Dancing to Fuji rhythm with money raining down! Max happiness!`);
    });
  };

  // 6. Sleep & Recharge Reaction
  const handleSleepReaction = () => {
    triggerPhysicalAction('sleep', '💤 Reclining to Sleep in Popo Quarters... Recharging Energy!', () => {
      sound.playClick();
      advanceTime(6);
      setPlayer((prev) => ({
        ...prev,
        stats: {
          ...prev.stats,
          energy: 100,
          health: 100,
        },
      }));
      addLog(`😴 Slept peacefully and woke up 100% revitalized!`);
    });
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
      className="relative w-full h-[520px] sm:h-[640px] lg:h-[700px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 select-none cursor-grab active:cursor-grabbing"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Top Left: 3D Reality HUD */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs shadow-xl text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-wide text-emerald-400 font-mono">
            OFFA 3D REALITY ENGINE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">3D Articulated Human Life</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
          <Camera className="w-3.5 h-3.5 text-teal-400" />
          <span>Click & Drag anywhere to Orbit 3D Camera</span>
        </div>
      </div>

      {/* Top Floating Physical Reaction Banner */}
      {reactionMsg && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white font-extrabold text-xs shadow-2xl border border-white/30 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" />
            <span>{reactionMsg}</span>
          </div>
        </div>
      )}

      {/* Interactive Physical Reaction Action Bar (Top Right) */}
      <div className="absolute top-4 right-4 z-20 flex flex-wrap items-center gap-1.5 max-w-[320px] justify-end">
        <button
          onClick={handleEatReaction}
          title="Physically Eat Roasted Sweet Potato"
          className="px-2.5 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-bold border border-amber-700/60 shadow-lg transition flex items-center gap-1.5"
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Eat Anamo</span>
        </button>

        <button
          onClick={handleHarvestReaction}
          title="Physically Swing Hoe & Harvest Crops"
          className="px-2.5 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-teal-200 text-xs font-bold border border-teal-700/60 shadow-lg transition flex items-center gap-1.5"
        >
          <Wheat className="w-3.5 h-3.5" />
          <span>Harvest</span>
        </button>

        <button
          onClick={handleHomageReaction}
          title="Physically Prostrate (Ìdọ̀bálẹ̀) in Royal Homage"
          className="px-2.5 py-1.5 rounded-xl bg-yellow-950/80 hover:bg-yellow-900 text-yellow-200 text-xs font-bold border border-yellow-700/60 shadow-lg transition flex items-center gap-1.5"
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Homage</span>
        </button>

        <button
          onClick={handleWrestleReaction}
          title="Physically Enter Ijakadi Combat Stance"
          className="px-2.5 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-700/60 shadow-lg transition flex items-center gap-1.5"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Wrestle</span>
        </button>

        <button
          onClick={handleDanceReaction}
          title="Physically Dance and Spray Naira at Owambe"
          className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-700/60 shadow-lg transition flex items-center gap-1.5"
        >
          <Music className="w-3.5 h-3.5" />
          <span>Dance</span>
        </button>

        <button
          onClick={handleSleepReaction}
          title="Physically Recline to Sleep & Recharge"
          className="px-2.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 text-xs font-bold border border-indigo-700/60 shadow-lg transition flex items-center gap-1.5"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Sleep</span>
        </button>
      </div>

      {/* Proximity Interaction Prompt (Centered Bottom) */}
      {nearbyZone && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom duration-200">
          <button
            onClick={() => handleEnterBuilding(nearbyZone)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-sm shadow-2xl flex items-center gap-3 border border-emerald-300/40 transform hover:scale-105 transition"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>ENTER {nearbyZone.name.toUpperCase()} (Press [E] or Tap)</span>
          </button>
        </div>
      )}

      {/* Mobile Touch Virtual D-Pad / Joystick (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1 bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl sm:hidden">
        <button
          onTouchStart={() => (touchInput.current = { x: 0, y: -1 })}
          onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
          className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onTouchStart={() => (touchInput.current = { x: -1, y: 0 })}
            onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
            className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
            🕹️
          </div>
          <button
            onTouchStart={() => (touchInput.current = { x: 1, y: 0 })}
            onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
            className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onTouchStart={() => (touchInput.current = { x: 0, y: 1 })}
          onTouchEnd={() => (touchInput.current = { x: 0, y: 0 })}
          className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Movement Guide Indicator (Bottom Right on PC) */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 text-xs text-slate-400">
        <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-200">
          W A S D
        </span>
        <span>to Walk in 3D •</span>
        <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-200">
          Shift
        </span>
        <span>to Sprint • Mouse Drag to Orbit</span>
      </div>
    </div>
  );
};
