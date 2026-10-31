import * as THREE from 'three';

// High-fidelity Free Fire & Call of Duty styled 3D Character Rig
export class Character3D {
  constructor({
    skinColor = 0x8d5524,
    shirtColor = 0x1e293b, // Tactical black / charcoal
    vestColor = 0x0f172a,  // Combat plate carrier
    pantsColor = 0x334155, // Tactical cargo pants
    bootsColor = 0x090d16, // High-top combat boots
    camoAccent = 0x059669, // Emerald Nigerian camo accent
    operatorType = 'tactical', // 'tactical' | 'street' | 'rebel' | 'spec-ops'
    name = 'Major Marshall',
    isNPC = false,
  } = {}) {
    this.group = new THREE.Group();
    this.name = name;
    this.isNPC = isNPC;
    this.operatorType = operatorType;

    this.currentAnim = 'idle';
    this.animTime = 0;
    this.walkCycle = 0;
    this.comboStep = 0;

    // Materials
    this.skinMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.6,
      metalness: 0.1,
    });
    this.shirtMat = new THREE.MeshStandardMaterial({
      color: shirtColor,
      roughness: 0.8,
    });
    this.vestMat = new THREE.MeshStandardMaterial({
      color: vestColor,
      roughness: 0.5,
      metalness: 0.2,
    });
    this.pantsMat = new THREE.MeshStandardMaterial({
      color: pantsColor,
      roughness: 0.8,
    });
    this.bootsMat = new THREE.MeshStandardMaterial({
      color: bootsColor,
      roughness: 0.4,
      metalness: 0.3,
    });
    this.accentMat = new THREE.MeshStandardMaterial({
      color: camoAccent,
      roughness: 0.5,
      metalness: 0.3,
    });
    this.goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
    });

    this.buildBody();
  }

  buildBody() {
    // 1. Root Pelvis / Combat Belt
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = 1.05;
    this.group.add(this.pelvis);

    // Tactical Duty Belt with pouches
    const beltGeo = new THREE.BoxGeometry(0.56, 0.14, 0.34);
    const belt = new THREE.Mesh(beltGeo, this.bootsMat);
    belt.position.y = 0.02;
    this.pelvis.add(belt);

    // Belt Ammo Pouches & Holster
    const pouchGeo = new THREE.BoxGeometry(0.12, 0.12, 0.08);
    const pouchLeft = new THREE.Mesh(pouchGeo, this.accentMat);
    pouchLeft.position.set(-0.25, 0, 0.14);
    const pouchRight = new THREE.Mesh(pouchGeo, this.accentMat);
    pouchRight.position.set(0.25, 0, 0.14);
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.22, 0.12), this.vestMat);
    holster.position.set(0.3, -0.15, 0);
    this.pelvis.add(pouchLeft, pouchRight, holster);

    // 2. Torso (Muscular Chest & Tactical Plate Carrier Vest)
    this.torso = new THREE.Group();
    this.torso.position.y = 0.18;
    this.pelvis.add(this.torso);

    // Inner Shirt / Undersuit
    const innerShirtGeo = new THREE.BoxGeometry(0.52, 0.62, 0.3);
    const innerShirt = new THREE.Mesh(innerShirtGeo, this.shirtMat);
    innerShirt.position.y = 0.3;
    this.torso.add(innerShirt);

    // Free Fire / CoD Tactical Plate Carrier (Vest)
    const vestGeo = new THREE.BoxGeometry(0.56, 0.54, 0.36);
    this.vestMesh = new THREE.Mesh(vestGeo, this.vestMat);
    this.vestMesh.position.y = 0.34;
    this.torso.add(this.vestMesh);

    // Vest Details: Mag Pouches & Tactical Patch
    const magPouchGeo = new THREE.BoxGeometry(0.32, 0.18, 0.08);
    const magPouches = new THREE.Mesh(magPouchGeo, this.accentMat);
    magPouches.position.set(0, 0.26, 0.21);
    this.torso.add(magPouches);

    // Shoulder Straps
    const strapGeo = new THREE.BoxGeometry(0.14, 0.38, 0.4);
    const leftStrap = new THREE.Mesh(strapGeo, this.vestMat);
    leftStrap.position.set(-0.22, 0.44, 0);
    const rightStrap = new THREE.Mesh(strapGeo, this.vestMat);
    rightStrap.position.set(0.22, 0.44, 0);
    this.torso.add(leftStrap, rightStrap);

    // Gold / Silver Tactical Dog Tags / Chain
    const chainGeo = new THREE.TorusGeometry(0.12, 0.02, 6, 12);
    const chain = new THREE.Mesh(chainGeo, this.goldMat);
    chain.position.set(0, 0.52, 0.14);
    chain.rotation.x = Math.PI / 3;
    this.torso.add(chain);

    // 3. Neck & Head (Free Fire / CoD Styled)
    this.neckGroup = new THREE.Group();
    this.neckGroup.position.y = 0.62;
    this.torso.add(this.neckGroup);

    const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.15, 8);
    const neck = new THREE.Mesh(neckGeo, this.skinMat);
    neck.position.y = 0.06;
    this.neckGroup.add(neck);

    this.head = new THREE.Group();
    this.head.position.y = 0.24;
    this.neckGroup.add(this.head);

    // Head base
    const headGeo = new THREE.BoxGeometry(0.32, 0.36, 0.32);
    const headMesh = new THREE.Mesh(headGeo, this.skinMat);
    this.head.add(headMesh);

    // Free Fire Hair / Fade Style
    const hairGeo = new THREE.BoxGeometry(0.34, 0.12, 0.34);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.18;
    this.head.add(hair);

    // Tactical Shades / Sunglasses (CoD Style)
    const shadesGeo = new THREE.BoxGeometry(0.3, 0.08, 0.06);
    const shadesMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a,
      metalness: 0.9,
      roughness: 0.1,
    });
    this.shades = new THREE.Mesh(shadesGeo, shadesMat);
    this.shades.position.set(0, 0.06, 0.17);
    this.head.add(this.shades);

    // Headset / Comms Earpiece
    const headsetGeo = new THREE.BoxGeometry(0.36, 0.08, 0.08);
    const headset = new THREE.Mesh(headsetGeo, this.bootsMat);
    headset.position.set(0, 0.08, 0);
    this.head.add(headset);

    // Cap / Beret (CoD Operator)
    const beretGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.09, 8);
    const beret = new THREE.Mesh(beretGeo, this.accentMat);
    beret.position.set(0.04, 0.25, 0);
    beret.rotation.z = -0.2;
    this.head.add(beret);

    // 4. Arms & Hands (Muscular with Tactical Gloves & Arm Guards)
    const shoulderGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
    const bicepGeo = new THREE.BoxGeometry(0.14, 0.28, 0.14);
    const forearmGeo = new THREE.BoxGeometry(0.13, 0.26, 0.13);
    const gloveGeo = new THREE.BoxGeometry(0.13, 0.15, 0.13);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.35, 0.52, 0);
    const leftShoulder = new THREE.Mesh(shoulderGeo, this.vestMat);
    this.leftArm.add(leftShoulder);

    this.leftBicep = new THREE.Group();
    this.leftBicep.position.y = -0.16;
    const lBicepMesh = new THREE.Mesh(bicepGeo, this.skinMat);
    this.leftBicep.add(lBicepMesh);

    this.leftForearm = new THREE.Group();
    this.leftForearm.position.y = -0.26;
    const lForearmMesh = new THREE.Mesh(forearmGeo, this.shirtMat);
    this.leftForearm.add(lForearmMesh);

    const lGlove = new THREE.Mesh(gloveGeo, this.bootsMat);
    lGlove.position.y = -0.2;
    this.leftForearm.add(lGlove);

    this.leftBicep.add(this.leftForearm);
    this.leftArm.add(this.leftBicep);
    this.torso.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.35, 0.52, 0);
    const rightShoulder = new THREE.Mesh(shoulderGeo, this.vestMat);
    this.rightArm.add(rightShoulder);

    this.rightBicep = new THREE.Group();
    this.rightBicep.position.y = -0.16;
    const rBicepMesh = new THREE.Mesh(bicepGeo, this.skinMat);
    this.rightBicep.add(rBicepMesh);

    this.rightForearm = new THREE.Group();
    this.rightForearm.position.y = -0.26;
    const rForearmMesh = new THREE.Mesh(forearmGeo, this.shirtMat);
    this.rightForearm.add(rForearmMesh);

    const rGlove = new THREE.Mesh(gloveGeo, this.bootsMat);
    rGlove.position.y = -0.2;
    this.rightForearm.add(rGlove);

    this.rightBicep.add(this.rightForearm);
    this.rightArm.add(this.rightBicep);
    this.torso.add(this.rightArm);

    // 5. Legs & Feet (Cargo Pants, Kneepads, High-Top Combat Boots)
    const thighGeo = new THREE.BoxGeometry(0.2, 0.44, 0.2);
    const calfGeo = new THREE.BoxGeometry(0.18, 0.42, 0.18);
    const kneePadGeo = new THREE.BoxGeometry(0.16, 0.14, 0.08);
    const bootGeo = new THREE.BoxGeometry(0.2, 0.22, 0.32);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.16, -0.05, 0);
    const lThigh = new THREE.Mesh(thighGeo, this.pantsMat);
    lThigh.position.y = -0.22;
    this.leftLeg.add(lThigh);

    this.leftShin = new THREE.Group();
    this.leftShin.position.y = -0.44;
    const lCalf = new THREE.Mesh(calfGeo, this.pantsMat);
    lCalf.position.y = -0.21;
    this.leftShin.add(lCalf);

    const lKneepad = new THREE.Mesh(kneePadGeo, this.bootsMat);
    lKneepad.position.set(0, 0, 0.11);
    this.leftShin.add(lKneepad);

    const lBoot = new THREE.Mesh(bootGeo, this.bootsMat);
    lBoot.position.set(0, -0.38, 0.06);
    this.leftShin.add(lBoot);

    this.leftLeg.add(this.leftShin);
    this.pelvis.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.16, -0.05, 0);
    const rThigh = new THREE.Mesh(thighGeo, this.pantsMat);
    rThigh.position.y = -0.22;
    this.rightLeg.add(rThigh);

    this.rightShin = new THREE.Group();
    this.rightShin.position.y = -0.44;
    const rCalf = new THREE.Mesh(calfGeo, this.pantsMat);
    rCalf.position.y = -0.21;
    this.rightShin.add(rCalf);

    const rKneepad = new THREE.Mesh(kneePadGeo, this.bootsMat);
    rKneepad.position.set(0, 0, 0.11);
    this.rightShin.add(rKneepad);

    const rBoot = new THREE.Mesh(bootGeo, this.bootsMat);
    rBoot.position.set(0, -0.38, 0.06);
    this.rightShin.add(rBoot);

    this.rightLeg.add(this.rightShin);
    this.pelvis.add(this.rightLeg);

    // Shadows
    this.group.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    // Shadow blob
    const shadowGeo = new THREE.CircleGeometry(0.5, 16);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.45,
      transparent: true,
    });
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.02;
    this.group.add(this.shadow);
  }

  setAnimation(anim) {
    if (this.currentAnim !== anim) {
      this.currentAnim = anim;
      this.animTime = 0;
    }
  }

  update(dt, isMoving = false, speed = 1) {
    this.animTime += dt;

    if (isMoving) {
      this.walkCycle += dt * 9.5 * speed;
      this.animateTacticalRun(speed);
    } else {
      switch (this.currentAnim) {
        case 'fight_punch':
          this.animatePunchCombo();
          break;
        case 'fight_kick':
          this.animateFlyingKick();
          break;
        case 'fight_block':
          this.animateCombatBlock();
          break;
        case 'club_dance':
          this.animateClubDance();
          break;
        case 'club_drink':
          this.animateClubDrink();
          break;
        case 'victory_flex':
          this.animateVictoryFlex();
          break;
        case 'drive':
          this.animateDrive();
          break;
        case 'idle':
        default:
          this.animateCoDIdle();
          break;
      }
    }
  }

  // --- Call of Duty / Free Fire Style Animations ---

  animateCoDIdle() {
    // Combat ready breathing stance
    const breath = Math.sin(this.animTime * 2.5);
    this.pelvis.position.y = 1.05 + breath * 0.02;
    this.torso.rotation.x = 0.05 + breath * 0.02;
    this.torso.rotation.y = 0.08; // tactical angled stance

    this.leftArm.rotation.x = -0.3 + breath * 0.04;
    this.leftArm.rotation.z = -0.25;
    this.leftForearm.rotation.x = -0.5;

    this.rightArm.rotation.x = -0.4 - breath * 0.04;
    this.rightArm.rotation.z = 0.25;
    this.rightForearm.rotation.x = -0.6;

    this.leftLeg.rotation.x = 0.05;
    this.rightLeg.rotation.x = -0.05;
    this.head.rotation.x = -0.04;
    this.head.rotation.y = -0.08;
  }

  animateTacticalRun(speed) {
    // CoD Tactical Sprint / Combat Stride
    const swing = Math.sin(this.walkCycle);
    const bob = Math.abs(Math.sin(this.walkCycle * 2)) * 0.12;

    this.pelvis.position.y = 1.05 + bob;
    this.torso.rotation.x = 0.22; // forward tactical lean
    this.torso.rotation.y = -swing * 0.14;

    this.leftLeg.rotation.x = swing * 0.85;
    this.leftShin.rotation.x = swing < 0 ? -swing * 0.9 : 0;

    this.rightLeg.rotation.x = -swing * 0.85;
    this.rightShin.rotation.x = swing > 0 ? swing * 0.9 : 0;

    // Pumped arms with clenched tactical fists
    this.leftArm.rotation.x = -swing * 0.95;
    this.leftForearm.rotation.x = -0.9;

    this.rightArm.rotation.x = swing * 0.95;
    this.rightForearm.rotation.x = -0.9;
  }

  animatePunchCombo() {
    // 3-hit martial strike combo (Jab, Cross, Hook)
    const step = (this.animTime * 8) % 3;
    this.pelvis.position.y = 0.98;
    this.torso.rotation.x = 0.15;

    if (step < 1) {
      // Left Jab
      this.torso.rotation.y = -0.35;
      this.leftArm.rotation.x = -1.6;
      this.leftForearm.rotation.x = -0.1;
      this.rightArm.rotation.x = -0.8;
      this.rightForearm.rotation.x = -1.2; // Guard
    } else if (step < 2) {
      // Right Heavy Cross
      this.torso.rotation.y = 0.45;
      this.rightArm.rotation.x = -1.75;
      this.rightForearm.rotation.x = -0.05;
      this.leftArm.rotation.x = -0.8;
      this.leftForearm.rotation.x = -1.2;
    } else {
      // Left Hook
      this.torso.rotation.y = -0.6;
      this.leftArm.rotation.x = -1.3;
      this.leftArm.rotation.z = -0.8;
      this.leftForearm.rotation.x = -1.1;
    }
  }

  animateFlyingKick() {
    // Free Fire High Martial Kick
    const t = Math.min(this.animTime * 4, Math.PI);
    this.pelvis.position.y = 1.1 + Math.sin(t) * 0.35; // leap
    this.torso.rotation.x = -0.2;
    this.torso.rotation.z = -0.3;

    // Right Leg High Kick
    this.rightLeg.rotation.x = -1.7 * Math.sin(t);
    this.rightShin.rotation.x = 0;

    // Left Leg Ground Base
    this.leftLeg.rotation.x = 0.3;

    // Balance arms
    this.leftArm.rotation.z = -0.9;
    this.rightArm.rotation.z = 0.9;
  }

  animateCombatBlock() {
    // Tactical Shield / Forearm Block Stance
    this.pelvis.position.y = 0.92;
    this.torso.rotation.x = 0.1;
    this.leftArm.rotation.x = -1.4;
    this.leftArm.rotation.z = -0.3;
    this.leftForearm.rotation.x = -1.5;

    this.rightArm.rotation.x = -1.4;
    this.rightArm.rotation.z = 0.3;
    this.rightForearm.rotation.x = -1.5;
  }

  animateClubDance() {
    // Nightclub Afrobeats / Amapiano groove
    const beat = Math.sin(this.animTime * 9);
    const sway = Math.cos(this.animTime * 4.5);

    this.pelvis.position.y = 1.0 + Math.abs(beat) * 0.14;
    this.torso.rotation.z = sway * 0.25;
    this.torso.rotation.y = beat * 0.2;

    this.leftArm.rotation.x = -1.2 + beat * 0.4;
    this.leftArm.rotation.z = -0.6;
    this.rightArm.rotation.x = -1.2 - beat * 0.4;
    this.rightArm.rotation.z = 0.6;

    this.head.rotation.x = beat * 0.15;
  }

  animateClubDrink() {
    // Raising VIP cup / beverage at the bar
    const cycle = Math.sin(this.animTime * 5);
    this.pelvis.position.y = 1.05;
    this.rightArm.rotation.x = -1.8 + cycle * 0.1;
    this.rightArm.rotation.z = -0.25;
    this.rightForearm.rotation.x = -0.8;
    this.head.rotation.x = 0.25;
  }

  animateVictoryFlex() {
    // Free Fire Winner Emote (Double Bicep Flex)
    this.pelvis.position.y = 1.1;
    this.torso.rotation.x = -0.08;
    this.leftArm.rotation.x = -1.4;
    this.leftArm.rotation.z = -1.2;
    this.leftForearm.rotation.x = -1.8;

    this.rightArm.rotation.x = -1.4;
    this.rightArm.rotation.z = 1.2;
    this.rightForearm.rotation.x = -1.8;
  }

  animateDrive() {
    // Seated behind the wheel or motorcycle handles
    this.pelvis.position.y = 0.68;
    this.leftLeg.rotation.x = -1.3;
    this.rightLeg.rotation.x = -1.3;
    this.leftArm.rotation.x = -0.9;
    this.rightArm.rotation.x = -0.9;
    this.torso.rotation.x = 0.15;
  }
}
