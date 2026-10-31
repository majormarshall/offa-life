import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { LOCATIONS } from '../data/locations';
import { sound } from '../utils/audio';
import {
  Navigation,
  Sparkles,
  Zap,
  Coffee,
  ShoppingBag,
  Flame,
  Home,
  GraduationCap,
  Train,
  Shield,
  Smartphone,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Footprints,
} from 'lucide-react';

// World Boundaries
const WORLD_WIDTH = 2400;
const WORLD_HEIGHT = 1800;

// Buildings & Interactive Locations in Offa
export const WORLD_BUILDINGS = [
  {
    id: 'olofa-palace',
    name: 'Ààfin Ọlọ́fà (Olofa Palace)',
    x: 1200,
    y: 320,
    width: 280,
    height: 180,
    doorX: 1200,
    doorY: 420,
    color: '#854d0e',
    roofColor: '#a16207',
    accentColor: '#fbbf24',
    type: 'palace',
    label: '👑 OLOFA PALACE',
    tag: 'Royal Kingdom Seat',
  },
  {
    id: 'owode-market',
    name: 'Ọjà Òwódé (Owode Market)',
    x: 650,
    y: 750,
    width: 320,
    height: 220,
    doorX: 650,
    doorY: 870,
    color: '#065f46',
    roofColor: '#047857',
    accentColor: '#34d399',
    type: 'market',
    label: '🏪 OWODE MARKET',
    tag: 'Sweet Potato & Goods Hub',
  },
  {
    id: 'fedpoly-mini',
    name: 'FedPoly Offa (Mini Campus)',
    x: 1800,
    y: 680,
    width: 290,
    height: 190,
    doorX: 1800,
    doorY: 790,
    color: '#1e3a8a',
    roofColor: '#1d4ed8',
    accentColor: '#60a5fa',
    type: 'school',
    label: '🎓 FEDPOLY CAMPUS',
    tag: 'Academic Citadel',
  },
  {
    id: 'ijakadi-arena',
    name: 'Pápá Ìjàkadì (Wrestling Arena)',
    x: 1200,
    y: 920,
    width: 240,
    height: 240,
    doorX: 1200,
    doorY: 1050,
    color: '#7f1d1d',
    roofColor: '#991b1b',
    accentColor: '#f87171',
    type: 'arena',
    label: '🤼 IJAKADI ARENA',
    tag: 'Traditional Martial Ring',
  },
  {
    id: 'offa-railway',
    name: 'Offa Railway Station (NRC)',
    x: 480,
    y: 1350,
    width: 300,
    height: 160,
    doorX: 480,
    doorY: 1440,
    color: '#374151',
    roofColor: '#4b5563',
    accentColor: '#9ca3af',
    type: 'railway',
    label: '🚂 RAILWAY STATION',
    tag: 'Colonial Cargo Terminus',
  },
  {
    id: 'residential-quarters',
    name: 'Your House (Popo Quarters)',
    x: 1200,
    y: 1450,
    width: 220,
    height: 170,
    doorX: 1200,
    doorY: 1545,
    color: '#134e4a',
    roofColor: '#0f766e',
    accentColor: '#2dd4bf',
    type: 'house',
    label: '🏡 YOUR HOME',
    tag: 'Sleep, Gen & Solar',
  },
  {
    id: 'avalon-hotel',
    name: 'Avalon Hotel & Executive Lounge',
    x: 1880,
    y: 1320,
    width: 260,
    height: 190,
    doorX: 1880,
    doorY: 1425,
    color: '#581c87',
    roofColor: '#6b21a8',
    accentColor: '#c084fc',
    type: 'hotel',
    label: '🏨 AVALON HOTEL',
    tag: 'Pool & VIP Lounge',
  },
  {
    id: 'anamo-farms',
    name: 'Ojoku Road Anamọ Farms',
    x: 480,
    y: 280,
    width: 320,
    height: 220,
    doorX: 480,
    doorY: 400,
    color: '#365314',
    roofColor: '#4d7c0f',
    accentColor: '#a3e635',
    type: 'farm',
    label: '🍠 ANAMỌ FARMLANDS',
    tag: 'Sweet Potato Ridges',
  },
];

// Initial Living NPCs walking through Offa
const INITIAL_NPCS = [
  { id: 1, name: 'Mama Risi', role: 'Sweet Potato Trader', x: 690, y: 880, targetX: 780, targetY: 880, speed: 0.8, color: '#f59e0b', bubble: 'Fresh Anamo from Ojoku road!', timer: 0 },
  { id: 2, name: 'Engr. Sikiru', role: 'FedPoly Techie', x: 1750, y: 810, targetX: 1650, targetY: 810, speed: 1.1, color: '#3b82f6', bubble: 'Coding a new fintech app!', timer: 0 },
  { id: 3, name: 'Chief Adeleke', role: 'Palace Elder', x: 1180, y: 440, targetX: 1250, targetY: 440, speed: 0.6, color: '#d97706', bubble: 'Kabiyesi o! Peace in Offa.', timer: 0 },
  { id: 4, name: 'Akin The Bull', role: 'Ijakadi Wrestler', x: 1180, y: 1060, targetX: 1260, targetY: 1060, speed: 1.2, color: '#ef4444', bubble: 'Ijakadi loro Offa!', timer: 0 },
  { id: 5, name: 'Brother Kunle', role: 'Keke Driver', x: 1200, y: 700, targetX: 1200, targetY: 1200, speed: 2.2, color: '#10b981', isVehicle: 'keke', bubble: 'Popo to Railway! Enter with change!', timer: 0 },
  { id: 6, name: 'Suleiman', role: 'Okada Rider', x: 900, y: 1100, targetX: 1600, targetY: 1100, speed: 2.8, color: '#eab308', isVehicle: 'okada', bubble: 'Express speed to FedPoly!', timer: 0 },
  { id: 7, name: 'Bolanle', role: 'FedPoly Student', x: 1700, y: 760, targetX: 1850, targetY: 760, speed: 1.0, color: '#ec4899', bubble: 'Exams starting next week!', timer: 0 },
  { id: 8, name: 'Baba Alaga', role: 'Owambe Host', x: 1350, y: 1400, targetX: 1450, targetY: 1400, speed: 0.7, color: '#8b5cf6', bubble: 'Saturday party ready! Aso-Ebi intact.', timer: 0 },
  { id: 9, name: 'Stray Kwara Goat', role: 'Town Mascot', x: 950, y: 920, targetX: 1050, targetY: 920, speed: 0.5, color: '#e2e8f0', isAnimal: true, bubble: 'Baaaah! 🐐', timer: 0 },
];

export const LivingWorldGame = ({ onInteractLocation }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);

  const { player, world, setPlayer, advanceTime } = useGame();

  // Player position in 2D World
  const [pos, setPos] = useState({ x: 1200, y: 1570 });
  const [targetPos, setTargetPos] = useState(null);
  const [facing, setFacing] = useState('down'); // 'up' | 'down' | 'left' | 'right'
  const [isMoving, setIsMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState(0);

  // Nearby Interactive Building
  const [nearbyBuilding, setNearbyBuilding] = useState(null);

  // Active keys pressed
  const keysPressed = useRef({});

  // Virtual Joystick & Touch state
  const [touchMovement, setTouchMovement] = useState({ x: 0, y: 0 });

  // NPCs state
  const npcsRef = useRef(INITIAL_NPCS);

  // Move Player towards target or keypresses
  useEffect(() => {
    const handleKeyDown = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) {
        setTargetPos(null); // Key overrides click-to-walk
      }
      if (k === 'e' || k === 'enter') {
        if (nearbyBuilding) {
          handleEnterBuilding(nearbyBuilding);
        }
      }
    };

    const handleKeyUp = (e) => {
      const k = e.key.toLowerCase();
      keysPressed.current[k] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyBuilding]);

  // Main Game Loop (60 FPS Canvas Render & Physics)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let lastTime = performance.now();
    let walkTimer = 0;

    const gameLoop = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      // 1. Calculate Player Movement
      let dx = 0;
      let dy = 0;

      // Keyboard Inputs
      if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= 1;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += 1;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= 1;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += 1;

      // Touch / Virtual Joystick Input
      if (touchMovement.x !== 0 || touchMovement.y !== 0) {
        dx = touchMovement.x;
        dy = touchMovement.y;
      }

      // Base Speed (Boosted if player owns Okada / Keke / Car)
      let speed = 190; // pixels per second
      if (player.vehicleId === 'bajaj-okada') speed = 300;
      else if (player.vehicleId === 'keke-tvs') speed = 260;
      else if (player.vehicleId === 'toyota-corolla') speed = 360;
      else if (player.vehicleId === 'mercedes-gwagon') speed = 420;

      if (keysPressed.current['shift']) speed *= 1.4; // Sprint

      let moving = false;

      setPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (dx !== 0 || dy !== 0) {
          // Normalize diagonal
          const len = Math.hypot(dx, dy);
          const ndx = (dx / len) * speed * dt;
          const ndy = (dy / len) * speed * dt;

          newX = Math.max(60, Math.min(WORLD_WIDTH - 60, prev.x + ndx));
          newY = Math.max(60, Math.min(WORLD_HEIGHT - 60, prev.y + ndy));

          moving = true;

          if (Math.abs(dx) > Math.abs(dy)) {
            setFacing(dx > 0 ? 'right' : 'left');
          } else {
            setFacing(dy > 0 ? 'down' : 'up');
          }
        } else if (targetPos) {
          // Click-to-move interpolation
          const distX = targetPos.x - prev.x;
          const distY = targetPos.y - prev.y;
          const dist = Math.hypot(distX, distY);

          if (dist > 8) {
            const step = Math.min(dist, speed * dt);
            newX = prev.x + (distX / dist) * step;
            newY = prev.y + (distY / dist) * step;
            moving = true;
            if (Math.abs(distX) > Math.abs(distY)) {
              setFacing(distX > 0 ? 'right' : 'left');
            } else {
              setFacing(distY > 0 ? 'down' : 'up');
            }
          } else {
            setTargetPos(null);
          }
        }

        return { x: newX, y: newY };
      });

      setIsMoving(moving);

      // Walk cycle animation frame
      if (moving) {
        walkTimer += dt * 10;
        if (walkTimer > 1) {
          walkTimer = 0;
          setWalkFrame((f) => (f + 1) % 4);
        }
      }

      // 2. Update NPCs
      npcsRef.current.forEach((npc) => {
        const ndx = npc.targetX - npc.x;
        const ndy = npc.targetY - npc.y;
        const ndist = Math.hypot(ndx, ndy);
        if (ndist > 5) {
          npc.x += (ndx / ndist) * npc.speed * 60 * dt;
          npc.y += (ndy / ndist) * npc.speed * 60 * dt;
        } else {
          // Reverse or pick new patrol point
          const tmp = npc.targetX;
          npc.targetX = npc.x + (Math.random() > 0.5 ? 120 : -120);
          npc.targetX = Math.max(100, Math.min(WORLD_WIDTH - 100, npc.targetX));
        }

        // Periodic speech bubble toggle
        npc.timer = (npc.timer || 0) + dt;
        if (npc.timer > 8) {
          npc.timer = 0;
          npc.showBubble = Math.random() > 0.4;
        }
      });

      // 3. Check proximity to Interactive Buildings
      let closest = null;
      let closestDist = 9999;
      WORLD_BUILDINGS.forEach((b) => {
        const d = Math.hypot(pos.x - b.doorX, pos.y - b.doorY);
        if (d < 120 && d < closestDist) {
          closest = b;
          closestDist = d;
        }
      });
      setNearbyBuilding(closest);

      // 4. Render Living World Canvas
      renderWorld(ctx, canvas.width, canvas.height, pos, npcsRef.current, world);

      animFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pos, targetPos, touchMovement, player.vehicleId, world]);

  // Handle Resize of canvas to fill container
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Render Function for Town of Offa
  const renderWorld = (ctx, viewWidth, viewHeight, playerPos, npcs, worldState) => {
    // Camera transform: Center on player
    ctx.save();
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    const camX = viewWidth / 2 - playerPos.x;
    const camY = viewHeight / 2 - playerPos.y;
    ctx.translate(camX, camY);

    // --- A. Ground / Streets of Offa ---
    // Warm Kwara earth backdrop
    ctx.fillStyle = '#1e293b'; // ground foundation
    ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    // Grass & Green verges
    ctx.fillStyle = '#164e63';
    ctx.fillRect(50, 50, WORLD_WIDTH - 100, WORLD_HEIGHT - 100);

    // Asphalt Main Roads (Olofa Way, Railway Rd, Adeleke Ave, Popo Rd)
    ctx.fillStyle = '#0f172a';

    // Horizontal Arteries
    ctx.fillRect(0, 500, WORLD_WIDTH, 120); // North Boulevard
    ctx.fillRect(0, 1100, WORLD_WIDTH, 130); // Olofa Way Central Expressway

    // Vertical Arteries
    ctx.fillRect(400, 0, 140, WORLD_HEIGHT); // Railway Axis
    ctx.fillRect(1130, 0, 140, WORLD_HEIGHT); // Palace & Popo Spine
    ctx.fillRect(1730, 0, 140, WORLD_HEIGHT); // FedPoly & Adeleke Corridor

    // Road Markings (Dashed Yellow/White center line)
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 4;
    ctx.setLineDash([25, 25]);

    ctx.beginPath();
    // Central lines
    ctx.moveTo(0, 560);
    ctx.lineTo(WORLD_WIDTH, 560);
    ctx.moveTo(0, 1165);
    ctx.lineTo(WORLD_WIDTH, 1165);
    ctx.moveTo(470, 0);
    ctx.lineTo(470, WORLD_HEIGHT);
    ctx.moveTo(1200, 0);
    ctx.lineTo(1200, WORLD_HEIGHT);
    ctx.moveTo(1800, 0);
    ctx.lineTo(1800, WORLD_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // Reset dash

    // Railway Line (Tracks & Sleepers)
    ctx.fillStyle = '#78350f';
    for (let rx = 100; rx < 850; rx += 25) {
      ctx.fillRect(rx, 1420, 12, 50);
    }
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(100, 1432);
    ctx.lineTo(850, 1432);
    ctx.moveTo(100, 1458);
    ctx.lineTo(850, 1458);
    ctx.stroke();

    // Sweet Potato Farmland Ridges along Ojoku Road
    ctx.fillStyle = '#365314';
    ctx.fillRect(320, 180, 480, 290);
    ctx.strokeStyle = '#65a30d';
    ctx.lineWidth = 6;
    for (let ry = 210; ry < 450; ry += 24) {
      ctx.beginPath();
      ctx.moveTo(340, ry);
      ctx.lineTo(780, ry);
      ctx.stroke();
    }

    // --- B. Draw Buildings ---
    WORLD_BUILDINGS.forEach((b) => {
      // Drop Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(b.x - b.width / 2 + 10, b.y - b.height / 2 + 15, b.width, b.height);

      // Building Base Body
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);

      // Stylized Roof / Trim
      ctx.fillStyle = b.roofColor;
      ctx.fillRect(b.x - b.width / 2 - 6, b.y - b.height / 2 - 6, b.width + 12, 32);

      // Front Entrance Doorway & Step
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(b.doorX - 25, b.doorY - 35, 50, 35);
      ctx.fillStyle = b.accentColor;
      ctx.fillRect(b.doorX - 28, b.doorY - 3, 56, 6); // Step

      // Windows
      ctx.fillStyle = worldState.timeOfDay === 'Night' ? '#fde047' : '#93c5fd';
      const winW = 20;
      const winH = 24;
      ctx.fillRect(b.x - b.width / 2 + 25, b.y - 15, winW, winH);
      ctx.fillRect(b.x - b.width / 2 + 65, b.y - 15, winW, winH);
      ctx.fillRect(b.x + b.width / 2 - 45, b.y - 15, winW, winH);
      ctx.fillRect(b.x + b.width / 2 - 85, b.y - 15, winW, winH);

      // Building Signage Plaque
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = b.accentColor;
      ctx.lineWidth = 2;
      const plaqueW = 190;
      const plaqueH = 34;
      ctx.fillRect(b.x - plaqueW / 2, b.y - b.height / 2 - 38, plaqueW, plaqueH);
      ctx.strokeRect(b.x - plaqueW / 2, b.y - b.height / 2 - 38, plaqueW, plaqueH);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, b.x, b.y - b.height / 2 - 20);

      // Doorway interaction indicator when player is close
      const dist = Math.hypot(playerPos.x - b.doorX, playerPos.y - b.doorY);
      if (dist < 120) {
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(b.doorX, b.doorY + 12, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('▼', b.doorX, b.doorY + 16);
      }
    });

    // --- C. Draw Living NPCs ---
    npcs.forEach((npc) => {
      // NPC Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(npc.x, npc.y + 12, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (npc.isVehicle === 'keke') {
        // Draw TVS Keke Tricycle
        ctx.fillStyle = '#10b981'; // Green Nigerian Keke
        ctx.fillRect(npc.x - 22, npc.y - 14, 44, 28);
        ctx.fillStyle = '#facc15'; // Yellow canopy
        ctx.fillRect(npc.x - 18, npc.y - 18, 36, 12);
        ctx.fillStyle = '#0f172a'; // Wheels
        ctx.fillRect(npc.x - 20, npc.y + 10, 8, 5);
        ctx.fillRect(npc.x + 12, npc.y + 10, 8, 5);
      } else if (npc.isVehicle === 'okada') {
        // Draw Bajaj Motorcycle
        ctx.fillStyle = '#eab308';
        ctx.fillRect(npc.x - 14, npc.y - 8, 28, 14);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(npc.x - 10, npc.y + 6, 6, 0, Math.PI * 2);
        ctx.arc(npc.x + 10, npc.y + 6, 6, 0, Math.PI * 2);
        ctx.fill();
      } else if (npc.isAnimal) {
        // Draw Stray Goat
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(npc.x - 12, npc.y - 8, 24, 14);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(npc.x + 8, npc.y - 14, 10, 10); // Head
      } else {
        // Human Pedestrian
        ctx.fillStyle = npc.color;
        ctx.beginPath();
        ctx.arc(npc.x, npc.y - 10, 9, 0, Math.PI * 2); // Head
        ctx.fill();

        ctx.fillStyle = npc.color;
        ctx.fillRect(npc.x - 8, npc.y - 2, 16, 16); // Torso / Clothes
      }

      // NPC Name & Title Tag
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(npc.name, npc.x, npc.y - 24);

      // NPC Speech Bubble
      if (npc.showBubble && npc.bubble) {
        const bubbleW = ctx.measureText(npc.bubble).width + 16;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(npc.x - bubbleW / 2, npc.y - 54, bubbleW, 22);
        ctx.strokeRect(npc.x - bubbleW / 2, npc.y - 54, bubbleW, 22);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(npc.bubble, npc.x, npc.y - 39);
      }
    });

    // --- D. Draw Player Character ---
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(playerPos.x, playerPos.y + 14, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Vehicle if riding
    if (player.vehicleId === 'bajaj-okada') {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(playerPos.x - 18, playerPos.y - 8, 36, 16);
    } else if (player.vehicleId === 'keke-tvs') {
      ctx.fillStyle = '#10b981';
      ctx.fillRect(playerPos.x - 26, playerPos.y - 16, 52, 32);
    } else if (player.vehicleId === 'mercedes-gwagon') {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(playerPos.x - 34, playerPos.y - 20, 68, 40);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(playerPos.x - 34, playerPos.y - 20, 68, 40);
    }

    // Player Body
    ctx.fillStyle = '#059669'; // Emerald Yoruba Buba / Shirt
    ctx.fillRect(playerPos.x - 10, playerPos.y - 4, 20, 18);

    // Legs with walk cycle offset
    ctx.fillStyle = '#1e293b';
    const legOffset = isMoving ? Math.sin(walkFrame * Math.PI) * 5 : 0;
    ctx.fillRect(playerPos.x - 8, playerPos.y + 14, 6, 10 + legOffset);
    ctx.fillRect(playerPos.x + 2, playerPos.y + 14, 6, 10 - legOffset);

    // Player Head
    ctx.fillStyle = '#78350f'; // Warm complexion
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y - 12, 11, 0, Math.PI * 2);
    ctx.fill();

    // Traditional Yoruba Fila (Cap)
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(playerPos.x, playerPos.y - 20, 9, Math.PI, 0);
    ctx.fill();

    // Player Name Tag & Title
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${player.name} (${player.title})`, playerPos.x, playerPos.y - 32);

    // Click Destination Marker
    if (targetPos) {
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(targetPos.x, targetPos.y, 14, 0, Math.PI * 2);
      ctx.stroke();
    }

    // --- E. Day / Night Lighting Ambient Overlay ---
    if (worldState.timeOfDay === 'Night') {
      ctx.fillStyle = 'rgba(8, 14, 26, 0.72)'; // Dark night tint
      ctx.fillRect(-camX, -camY, viewWidth, viewHeight);

      // Light glow around player
      const grad = ctx.createRadialGradient(playerPos.x, playerPos.y, 20, playerPos.x, playerPos.y, 220);
      grad.addColorStop(0, 'rgba(253, 224, 71, 0.28)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(playerPos.x, playerPos.y, 220, 0, Math.PI * 2);
      ctx.fill();
    } else if (worldState.timeOfDay === 'Evening') {
      ctx.fillStyle = 'rgba(217, 119, 6, 0.18)'; // Golden hour sunset
      ctx.fillRect(-camX, -camY, viewWidth, viewHeight);
    }

    ctx.restore();
  };

  // Click on Canvas to Walk Directly to that Point in Offa
  const handleCanvasClick = (e) => {
    sound.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickScreenX = e.clientX - rect.left;
    const clickScreenY = e.clientY - rect.top;

    // Convert Screen to World Space
    const camX = canvas.width / 2 - pos.x;
    const camY = canvas.height / 2 - pos.y;
    const worldClickX = clickScreenX - camX;
    const worldClickY = clickScreenY - camY;

    // Check if clicked directly on a building
    const clickedB = WORLD_BUILDINGS.find(
      (b) =>
        worldClickX >= b.x - b.width / 2 &&
        worldClickX <= b.x + b.width / 2 &&
        worldClickY >= b.y - b.height / 2 &&
        worldClickY <= b.y + b.height / 2
    );

    if (clickedB) {
      setTargetPos({ x: clickedB.doorX, y: clickedB.doorY + 20 });
    } else {
      setTargetPos({ x: worldClickX, y: worldClickY });
    }
  };

  // Open Building Actions Modal
  const handleEnterBuilding = (building) => {
    sound.playClick();
    const fullLoc = LOCATIONS.find((l) => l.id === building.id);
    if (fullLoc) {
      setPlayer((prev) => ({
        ...prev,
        currentLocationId: building.id,
      }));
      if (onInteractLocation) {
        onInteractLocation(fullLoc);
      }
    }
  };

  // Touch Virtual Joystick Handlers
  const handleTouchPad = (dx, dy) => {
    sound.playClick();
    setTouchMovement({ x: dx, y: dy });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[450px] sm:h-[580px] lg:h-[640px] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 select-none"
    >
      {/* The Live Interactive Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair touch-none"
      />

      {/* Top Left: Live Reality HUD Banner */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs shadow-xl text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-bold tracking-wide text-emerald-400 font-mono">
            OFFA LIVE REALITY ENGINE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-medium">
            Tap or WASD to Walk Through Streets
          </span>
        </div>

        {/* Vehicle / Sprint Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
          <Footprints className="w-3.5 h-3.5 text-teal-400" />
          <span>Mobility: <strong className="text-white capitalize">{player.vehicleId.replace('-', ' ')}</strong></span>
        </div>
      </div>

      {/* Top Right: Quick Fast Travel to Key Offa Hubs */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl overflow-x-auto max-w-[280px] sm:max-w-none">
        {WORLD_BUILDINGS.slice(0, 4).map((b) => (
          <button
            key={b.id}
            onClick={() => {
              sound.playClick();
              setPos({ x: b.doorX, y: b.doorY + 40 });
              setTargetPos(null);
            }}
            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-bold text-slate-200 transition shrink-0"
          >
            {b.label.split(' ')[0]} {b.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Interactive Building Proximity Alert Banner (Centered Bottom) */}
      {nearbyBuilding && (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom duration-200">
          <button
            onClick={() => handleEnterBuilding(nearbyBuilding)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-extrabold text-sm shadow-2xl flex items-center gap-3 border border-emerald-300/40 transform hover:scale-105 transition"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>ENTER {nearbyBuilding.name.toUpperCase()} (Press [E] or Tap)</span>
          </button>
        </div>
      )}

      {/* Virtual On-Screen Direction Pad / Joystick (Bottom Left on Mobile/Touch) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1 bg-slate-950/85 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-2xl sm:hidden">
        <button
          onTouchStart={() => handleTouchPad(0, -1)}
          onTouchEnd={() => handleTouchPad(0, 0)}
          className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          <button
            onTouchStart={() => handleTouchPad(-1, 0)}
            onTouchEnd={() => handleTouchPad(0, 0)}
            className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-bold">
            🕹️
          </div>
          <button
            onTouchStart={() => handleTouchPad(1, 0)}
            onTouchEnd={() => handleTouchPad(0, 0)}
            className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onTouchStart={() => handleTouchPad(0, 1)}
          onTouchEnd={() => handleTouchPad(0, 0)}
          className="w-10 h-10 rounded-xl bg-slate-800 active:bg-emerald-600 text-white flex items-center justify-center font-black"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Reality Controls Guide (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-800 text-xs text-slate-400">
        <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-200">
          W A S D
        </span>
        <span>or</span>
        <span className="font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-200">
          Arrows
        </span>
        <span>to Walk • Tap Ground to Move</span>
      </div>
    </div>
  );
};
