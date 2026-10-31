import * as THREE from 'three';

// Articulated 3D Human Character Rig for Offa Life
export class Character3D {
  constructor({
    color = 0x059669, // Emerald Yoruba buba
    skinColor = 0x78350f, // Nigerian skin tone
    capColor = 0xfbbf24, // Golden Yoruba Fila cap
    pantsColor = 0x1e293b,
    isNPC = false,
    name = 'Adeyemi'
  } = {}) {
    this.group = new THREE.Group();
    this.isNPC = isNPC;
    this.name = name;

    this.currentAnim = 'idle';
    this.animTime = 0;
    this.walkCycle = 0;

    // Materials
    const skinMat = new THREE.MeshLambertMaterial({ color: skinColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: color });
    const capMat = new THREE.MeshLambertMaterial({ color: capColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: pantsColor });
    const shoeMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    // Root Pelvis
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = 1.0;
    this.group.add(this.pelvis);

    // Torso (Upper body)
    const torsoGeo = new THREE.BoxGeometry(0.55, 0.65, 0.32);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 0.35;
    this.pelvis.add(this.torso);

    // Neck & Head
    this.headGroup = new THREE.Group();
    this.headGroup.position.y = 0.45;
    this.torso.add(this.headGroup);

    const headGeo = new THREE.BoxGeometry(0.35, 0.38, 0.35);
    this.head = new THREE.Mesh(headGeo, skinMat);
    this.head.position.y = 0.22;
    this.headGroup.add(this.head);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.08, 0.05, 0.02);
    const pupilGeo = new THREE.BoxGeometry(0.04, 0.04, 0.025);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.09, 0.05, 0.18);
    const leftPupil = new THREE.Mesh(pupilGeo, pupilMat);
    leftPupil.position.set(-0.09, 0.05, 0.185);
    this.head.add(leftEye, leftPupil);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.09, 0.05, 0.18);
    const rightPupil = new THREE.Mesh(pupilGeo, pupilMat);
    rightPupil.position.set(0.09, 0.05, 0.185);
    this.head.add(rightEye, rightPupil);

    // Traditional Yoruba Cap (Fìlà)
    const capGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.18, 8);
    this.cap = new THREE.Mesh(capGeo, capMat);
    this.cap.position.y = 0.26;
    this.cap.rotation.z = -0.15; // tilted in traditional swagger
    this.head.add(this.cap);

    // --- Arms ---
    const armGeo = new THREE.BoxGeometry(0.14, 0.42, 0.14);
    const handGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);

    // Left Arm
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.35, 0.28, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, shirtMat);
    leftArmMesh.position.y = -0.21;
    this.leftArm.add(leftArmMesh);
    this.leftHand = new THREE.Mesh(handGeo, skinMat);
    this.leftHand.position.y = -0.46;
    this.leftArm.add(this.leftHand);
    this.torso.add(this.leftArm);

    // Right Arm (Hand can hold food, hoe, etc.)
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.35, 0.28, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, shirtMat);
    rightArmMesh.position.y = -0.21;
    this.rightArm.add(rightArmMesh);
    this.rightHand = new THREE.Mesh(handGeo, skinMat);
    this.rightHand.position.y = -0.46;
    this.rightArm.add(this.rightHand);
    this.torso.add(this.rightArm);

    // Tool / Item Prop in Hand
    const propGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.25, 6);
    this.heldProp = new THREE.Mesh(propGeo, new THREE.MeshLambertMaterial({ color: 0xd97706 }));
    this.heldProp.position.set(0, -0.1, 0.1);
    this.heldProp.rotation.x = Math.PI / 2;
    this.heldProp.visible = false;
    this.rightHand.add(this.heldProp);

    // --- Legs ---
    const legGeo = new THREE.BoxGeometry(0.18, 0.55, 0.18);
    const shoeGeo = new THREE.BoxGeometry(0.19, 0.12, 0.28);

    // Left Leg
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.16, 0, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
    leftLegMesh.position.y = -0.28;
    this.leftLeg.add(leftLegMesh);
    const leftShoe = new THREE.Mesh(shoeGeo, shoeMat);
    leftShoe.position.set(0, -0.58, 0.05);
    this.leftLeg.add(leftShoe);
    this.pelvis.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.16, 0, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
    rightLegMesh.position.y = -0.28;
    this.rightLeg.add(rightLegMesh);
    const rightShoe = new THREE.Mesh(shoeGeo, shoeMat);
    rightShoe.position.set(0, -0.58, 0.05);
    this.rightLeg.add(rightShoe);
    this.pelvis.add(this.rightLeg);

    // Cast shadows
    this.group.traverse((obj) => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    // Shadow blob
    const shadowGeo = new THREE.CircleGeometry(0.45, 16);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.35, transparent: true });
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadow.rotation.x = -Math.PI / 2;
    this.shadow.position.y = 0.02;
    this.group.add(this.shadow);
  }

  setAnimation(animName) {
    if (this.currentAnim !== animName) {
      this.currentAnim = animName;
      this.animTime = 0;
      this.heldProp.visible = animName === 'eat' || animName === 'harvest';
      if (animName === 'eat') {
        this.heldProp.material.color.setHex(0xd97706); // Sweet potato / roasted anamo
      } else if (animName === 'harvest') {
        this.heldProp.material.color.setHex(0x64748b); // Hoe / digging tool
      }
    }
  }

  update(dt, isMoving = false, speed = 1) {
    this.animTime += dt;

    if (isMoving) {
      this.walkCycle += dt * 8 * speed;
      this.animateWalk();
    } else {
      switch (this.currentAnim) {
        case 'eat':
          this.animateEat();
          break;
        case 'harvest':
          this.animateHarvest();
          break;
        case 'wrestle':
          this.animateWrestle();
          break;
        case 'prostrate':
          this.animateProstrate();
          break;
        case 'dance':
          this.animateDance();
          break;
        case 'sleep':
          this.animateSleep();
          break;
        case 'drive':
          this.animateDrive();
          break;
        case 'idle':
        default:
          this.animateIdle();
          break;
      }
    }
  }

  // --- Animations ---

  animateIdle() {
    this.pelvis.position.y = 1.0 + Math.sin(this.animTime * 2) * 0.02;
    this.torso.rotation.x = 0;
    this.torso.rotation.y = 0;
    this.torso.rotation.z = 0;
    this.headGroup.rotation.x = Math.sin(this.animTime * 1.5) * 0.05;
    this.headGroup.rotation.y = Math.sin(this.animTime * 0.8) * 0.1;

    this.leftArm.rotation.x = Math.sin(this.animTime * 2) * 0.05;
    this.leftArm.rotation.z = -0.05;
    this.rightArm.rotation.x = -Math.sin(this.animTime * 2) * 0.05;
    this.rightArm.rotation.z = 0.05;

    this.leftLeg.rotation.x = 0;
    this.rightLeg.rotation.x = 0;
    this.pelvis.rotation.x = 0;
    this.pelvis.rotation.z = 0;
  }

  animateWalk() {
    const swing = Math.sin(this.walkCycle);
    this.pelvis.position.y = 1.0 + Math.abs(Math.sin(this.walkCycle * 2)) * 0.08;

    this.leftLeg.rotation.x = swing * 0.65;
    this.rightLeg.rotation.x = -swing * 0.65;

    this.leftArm.rotation.x = -swing * 0.65;
    this.rightArm.rotation.x = swing * 0.65;

    this.torso.rotation.y = -swing * 0.1;
    this.torso.rotation.z = swing * 0.04;
  }

  animateEat() {
    // Bring right arm up to mouth and chew
    const cycle = Math.sin(this.animTime * 6);
    this.pelvis.position.y = 1.0;
    this.rightArm.rotation.x = -1.8 + cycle * 0.2;
    this.rightArm.rotation.z = -0.3;
    this.leftArm.rotation.x = -0.4;
    this.headGroup.rotation.x = 0.2 + cycle * 0.1; // nodding and chewing
    this.torso.rotation.y = 0.1;
  }

  animateHarvest() {
    // Bend at waist and swing hoe into the ground
    const cycle = (Math.sin(this.animTime * 4) + 1) / 2; // 0 to 1
    this.pelvis.position.y = 0.85 - cycle * 0.15;
    this.torso.rotation.x = 0.4 + cycle * 0.5; // bend forward
    this.rightArm.rotation.x = -1.2 + cycle * 1.6;
    this.leftArm.rotation.x = -0.8 + cycle * 1.2;
    this.headGroup.rotation.x = 0.2;
    this.leftLeg.rotation.x = 0.2;
    this.rightLeg.rotation.x = -0.2;
  }

  animateWrestle() {
    // Combat stance: deep squat, arms out, bobbing
    const bob = Math.sin(this.animTime * 6) * 0.05;
    this.pelvis.position.y = 0.78 + bob;
    this.leftLeg.rotation.x = 0.4;
    this.rightLeg.rotation.x = -0.35;
    this.torso.rotation.x = 0.2;

    this.leftArm.rotation.x = -0.9 + Math.sin(this.animTime * 8) * 0.3;
    this.leftArm.rotation.z = -0.3;
    this.rightArm.rotation.x = -0.9 - Math.sin(this.animTime * 8) * 0.3;
    this.rightArm.rotation.z = 0.3;
  }

  animateProstrate() {
    // Traditional Yoruba Ìdọ̀bálẹ̀ (Prostration on the ground in royal respect)
    this.pelvis.position.y = 0.25;
    this.pelvis.rotation.x = Math.PI / 2.3;
    this.leftArm.rotation.x = -2.2;
    this.rightArm.rotation.x = -2.2;
    this.headGroup.rotation.x = -0.4;
    this.leftLeg.rotation.x = 0.1;
    this.rightLeg.rotation.x = 0.1;
  }

  animateDance() {
    // Owambe celebration dance (Gbe body e)
    const beat = Math.sin(this.animTime * 8);
    this.pelvis.position.y = 0.95 + Math.abs(beat) * 0.15;
    this.torso.rotation.z = beat * 0.2;
    this.torso.rotation.y = Math.cos(this.animTime * 4) * 0.25;

    this.leftArm.rotation.x = -1.2 + beat * 0.4;
    this.leftArm.rotation.z = -0.4 + beat * 0.2;
    this.rightArm.rotation.x = -1.2 - beat * 0.4;
    this.rightArm.rotation.z = 0.4 - beat * 0.2;

    this.headGroup.rotation.x = beat * 0.15;
  }

  animateSleep() {
    // Lie down flat
    this.pelvis.position.y = 0.3;
    this.pelvis.rotation.z = Math.PI / 2;
    this.headGroup.rotation.x = 0;
    this.leftArm.rotation.x = 0;
    this.rightArm.rotation.x = 0;
    this.leftLeg.rotation.x = 0;
    this.rightLeg.rotation.x = 0;
  }

  animateDrive() {
    // Seated driving posture with hands on steering/handlebars
    this.pelvis.position.y = 0.65;
    this.leftLeg.rotation.x = -1.2;
    this.rightLeg.rotation.x = -1.2;
    this.leftArm.rotation.x = -0.8;
    this.leftArm.rotation.z = -0.2;
    this.rightArm.rotation.x = -0.8;
    this.rightArm.rotation.z = 0.2;
    this.torso.rotation.x = 0.1;
  }
}
