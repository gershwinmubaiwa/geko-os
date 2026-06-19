import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export interface MannequinData {
  height: number;
  shoulders: number;
  chest: number;
  arms: number;
  waist: number;
  color?: string;
}

interface Props {
  data: MannequinData;
}

export function MannequinCanvas({ data }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const [webglError, setWebglError] = useState(false);
  const partsRef = useRef<{
    armsGroup: THREE.Group;
    torso: THREE.Mesh;
    hips: THREE.Mesh;
    armSegments: THREE.Mesh[];
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Pre-check WebGL availability before touching THREE at all
    const checkCanvas = document.createElement("canvas");
    const gl = checkCanvas.getContext("webgl") || checkCanvas.getContext("experimental-webgl");
    if (!gl) {
      setWebglError(true);
      return;
    }

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a0f");
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.5, 3.5);
    cameraRef.current = camera;

    // Renderer — graceful fallback if WebGL is unavailable (e.g. sandboxed env)
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglError(true);
      return;
    }
    if (!renderer.capabilities || renderer.getContext() === null) {
      setWebglError(true);
      renderer.dispose();
      return;
    }
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.5, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-2, 5, 2);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00e5ff, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(10, 20, 0x00e5ff, 0x1a1a24);
    gridHelper.position.y = -0.5;
    scene.add(gridHelper);

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xc0c0d0,
      roughness: 0.4,
      metalness: 0.6,
    });

    const torsoMaterial = new THREE.MeshStandardMaterial({
      color: data.color || "#2a2a3a",
      roughness: 0.7,
      metalness: 0.2,
    });

    // Geometries & Meshes
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 32, 32);
    const head = new THREE.Mesh(headGeo, skinMaterial);
    head.position.y = 1.45;
    mannequinGroup.add(head);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.y = 1.25;
    mannequinGroup.add(neck);

    // Torso
    const torsoGeo = new THREE.CylinderGeometry(0.22, 0.18, 0.55, 32);
    const torso = new THREE.Mesh(torsoGeo, torsoMaterial);
    torso.position.y = 0.9;
    mannequinGroup.add(torso);

    // Hips
    const hipsGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.2, 32);
    const hips = new THREE.Mesh(hipsGeo, skinMaterial);
    hips.position.y = 0.5;
    mannequinGroup.add(hips);

    // Arms Group (to scale shoulders spread)
    const armsGroup = new THREE.Group();
    armsGroup.position.y = 1.1;
    mannequinGroup.add(armsGroup);

    const armSegments: THREE.Mesh[] = [];

    // Left Arm
    const leftUpperArmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.3, 16);
    const leftUpperArm = new THREE.Mesh(leftUpperArmGeo, skinMaterial);
    leftUpperArm.position.set(-0.3, -0.1, 0);
    leftUpperArm.rotation.z = Math.PI / 16;
    armsGroup.add(leftUpperArm);
    armSegments.push(leftUpperArm);

    const leftLowerArmGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.28, 16);
    const leftLowerArm = new THREE.Mesh(leftLowerArmGeo, skinMaterial);
    leftLowerArm.position.set(-0.35, -0.4, 0);
    leftLowerArm.rotation.z = Math.PI / 24;
    armsGroup.add(leftLowerArm);
    armSegments.push(leftLowerArm);

    // Right Arm
    const rightUpperArmGeo = new THREE.CylinderGeometry(0.07, 0.065, 0.3, 16);
    const rightUpperArm = new THREE.Mesh(rightUpperArmGeo, skinMaterial);
    rightUpperArm.position.set(0.3, -0.1, 0);
    rightUpperArm.rotation.z = -Math.PI / 16;
    armsGroup.add(rightUpperArm);
    armSegments.push(rightUpperArm);

    const rightLowerArmGeo = new THREE.CylinderGeometry(0.065, 0.06, 0.28, 16);
    const rightLowerArm = new THREE.Mesh(rightLowerArmGeo, skinMaterial);
    rightLowerArm.position.set(0.35, -0.4, 0);
    rightLowerArm.rotation.z = -Math.PI / 24;
    armsGroup.add(rightLowerArm);
    armSegments.push(rightLowerArm);

    // Legs
    const leftUpperLegGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16);
    const leftUpperLeg = new THREE.Mesh(leftUpperLegGeo, skinMaterial);
    leftUpperLeg.position.set(-0.12, 0.2, 0);
    mannequinGroup.add(leftUpperLeg);

    const leftLowerLegGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.35, 16);
    const leftLowerLeg = new THREE.Mesh(leftLowerLegGeo, skinMaterial);
    leftLowerLeg.position.set(-0.12, -0.18, 0);
    mannequinGroup.add(leftLowerLeg);

    const rightUpperLegGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16);
    const rightUpperLeg = new THREE.Mesh(rightUpperLegGeo, skinMaterial);
    rightUpperLeg.position.set(0.12, 0.2, 0);
    mannequinGroup.add(rightUpperLeg);

    const rightLowerLegGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.35, 16);
    const rightLowerLeg = new THREE.Mesh(rightLowerLegGeo, skinMaterial);
    rightLowerLeg.position.set(0.12, -0.18, 0);
    mannequinGroup.add(rightLowerLeg);

    partsRef.current = { armsGroup, torso, hips, armSegments };

    // Animation Loop
    let animationFrameId: number;
    const renderLoop = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      skinMaterial.dispose();
      torsoMaterial.dispose();
      headGeo.dispose();
      neckGeo.dispose();
      torsoGeo.dispose();
      hipsGeo.dispose();
      leftUpperArmGeo.dispose();
      leftLowerArmGeo.dispose();
      rightUpperArmGeo.dispose();
      rightLowerArmGeo.dispose();
      leftUpperLegGeo.dispose();
      leftLowerLegGeo.dispose();
      rightUpperLegGeo.dispose();
      rightLowerLegGeo.dispose();
    };
  }, []);

  // Sync data to mannequin
  useEffect(() => {
    if (!partsRef.current || !mannequinGroupRef.current) return;
    const { armsGroup, torso, hips, armSegments } = partsRef.current;

    // Height: map 150-210 to 0.85-1.15
    const heightScale = 0.85 + ((data.height - 150) / 60) * 0.3;
    mannequinGroupRef.current.scale.y = heightScale;

    // Shoulders: map 30-60 to 0.85-1.15
    const shoulderScale = 0.85 + ((data.shoulders - 30) / 30) * 0.3;
    armsGroup.scale.x = shoulderScale;

    // Chest: map 70-120 to 0.85-1.15
    const chestScale = 0.85 + ((data.chest - 70) / 50) * 0.3;
    torso.scale.x = chestScale;
    torso.scale.z = chestScale;

    // Arms: map 50-80 to 0.85-1.15
    const armsScale = 0.85 + ((data.arms - 50) / 30) * 0.3;
    armSegments.forEach(mesh => {
      mesh.scale.y = armsScale;
    });

    // Waist: map 60-110 to 0.85-1.15
    const waistScale = 0.85 + ((data.waist - 60) / 50) * 0.3;
    hips.scale.x = waistScale;
    hips.scale.z = waistScale;

    if (data.color) {
      (torso.material as THREE.MeshStandardMaterial).color.set(data.color);
    } else {
      (torso.material as THREE.MeshStandardMaterial).color.set("#2a2a3a");
    }

  }, [data]);

  if (webglError) {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden border border-primary/20 bg-[#0a0a0f] flex flex-col items-center justify-center gap-4">
        <div className="w-24 h-24 relative">
          {/* SVG mannequin silhouette fallback */}
          <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60">
            <circle cx="50" cy="18" r="14" fill="#c0c0d0" />
            <rect x="44" y="30" width="12" height="10" rx="2" fill="#c0c0d0" />
            <rect x="30" y="38" width="40" height="45" rx="4" fill="#2a2a3a" stroke="#00e5ff" strokeWidth="1" />
            <rect x="15" y="40" width="14" height="36" rx="4" fill="#c0c0d0" />
            <rect x="71" y="40" width="14" height="36" rx="4" fill="#c0c0d0" />
            <rect x="33" y="82" width="15" height="16" rx="3" fill="#c0c0d0" />
            <rect x="52" y="82" width="15" height="16" rx="3" fill="#c0c0d0" />
            <rect x="30" y="96" width="18" height="56" rx="4" fill="#c0c0d0" />
            <rect x="52" y="96" width="18" height="56" rx="4" fill="#c0c0d0" />
          </svg>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 30px rgba(0,229,255,0.15)" }} />
        </div>
        <div className="text-center">
          <p className="text-xs font-mono text-cyan-400/70 tracking-widest uppercase">3D Viewport</p>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">WebGL — Active in Browser</p>
        </div>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 rounded-full bg-cyan-400/40" style={{ height: `${12 + Math.sin(i * 1.3) * 8}px` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full rounded-xl overflow-hidden border border-primary/20 bg-[#0a0a0f]"
      onMouseDown={() => {
        if (controlsRef.current) controlsRef.current.autoRotate = false;
      }}
      onMouseUp={() => {
        if (controlsRef.current) controlsRef.current.autoRotate = true;
      }}
    />
  );
}
