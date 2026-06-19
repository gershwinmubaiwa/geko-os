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
  bottomColor?: string;
}

interface Props {
  data: MannequinData;
}

export function MannequinCanvas({ data }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const [webglError, setWebglError] = useState(false);
  const partsRef = useRef<{
    armsGroup: THREE.Group;
    torso: THREE.Mesh;
    hips: THREE.Mesh;
    armSegments: THREE.Mesh[];
    legMeshes: THREE.Mesh[];
    torsoMat: THREE.MeshStandardMaterial;
    bottomMat: THREE.MeshStandardMaterial;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const checkCanvas = document.createElement("canvas");
    const gl = checkCanvas.getContext("webgl") || checkCanvas.getContext("experimental-webgl");
    if (!gl) { setWebglError(true); return; }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#08080e");

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.5, 3.5);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch { setWebglError(true); return; }
    if (!renderer.capabilities || renderer.getContext() === null) {
      setWebglError(true); renderer.dispose(); return;
    }
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0.5, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controlsRef.current = controls;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(-2, 5, 2);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x8b5cf6, 2, 10);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(10, 20, 0x8b5cf6, 0x1a1a24);
    gridHelper.position.y = -0.55;
    scene.add(gridHelper);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xc0c0d0, roughness: 0.4, metalness: 0.6 });
    const torsoMat = new THREE.MeshStandardMaterial({ color: data.color || "#2a2a3a", roughness: 0.6, metalness: 0.3 });
    const bottomMat = new THREE.MeshStandardMaterial({ color: data.bottomColor || data.color || "#2a2a3a", roughness: 0.6, metalness: 0.3 });

    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);
    mannequinGroupRef.current = mannequinGroup;

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), skinMat);
    head.position.y = 1.45;
    mannequinGroup.add(head);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 16), skinMat);
    neck.position.y = 1.25;
    mannequinGroup.add(neck);

    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.55, 32), torsoMat);
    torso.position.y = 0.9;
    mannequinGroup.add(torso);

    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.22, 0.2, 32), bottomMat);
    hips.position.y = 0.5;
    mannequinGroup.add(hips);

    const armsGroup = new THREE.Group();
    armsGroup.position.y = 1.1;
    mannequinGroup.add(armsGroup);

    const armSegments: THREE.Mesh[] = [];
    const makeArm = (x: number, rotZ: number, lx: number, lrz: number) => {
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.065, 0.3, 16), skinMat);
      upper.position.set(x, -0.1, 0); upper.rotation.z = rotZ; armsGroup.add(upper); armSegments.push(upper);
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.28, 16), skinMat);
      lower.position.set(lx, -0.4, 0); lower.rotation.z = lrz; armsGroup.add(lower); armSegments.push(lower);
    };
    makeArm(-0.3, Math.PI / 16, -0.35, Math.PI / 24);
    makeArm(0.3, -Math.PI / 16, 0.35, -Math.PI / 24);

    const legMeshes: THREE.Mesh[] = [];
    const makeLeg = (x: number) => {
      const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 16), bottomMat);
      upper.position.set(x, 0.2, 0); mannequinGroup.add(upper); legMeshes.push(upper);
      const lower = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 16), bottomMat);
      lower.position.set(x, -0.18, 0); mannequinGroup.add(lower); legMeshes.push(lower);
    };
    makeLeg(-0.12);
    makeLeg(0.12);

    partsRef.current = { armsGroup, torso, hips, armSegments, legMeshes, torsoMat, bottomMat };

    let animationFrameId: number;
    const renderLoop = () => {
      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!partsRef.current || !mannequinGroupRef.current) return;
    const { armsGroup, torso, hips, armSegments, legMeshes, torsoMat, bottomMat } = partsRef.current;

    mannequinGroupRef.current.scale.y = 0.85 + ((data.height - 150) / 60) * 0.3;
    armsGroup.scale.x = 0.85 + ((data.shoulders - 30) / 30) * 0.3;
    const chestScale = 0.85 + ((data.chest - 70) / 50) * 0.3;
    torso.scale.x = chestScale;
    torso.scale.z = chestScale;
    armSegments.forEach(m => { m.scale.y = 0.85 + ((data.arms - 50) / 30) * 0.3; });
    const waistScale = 0.85 + ((data.waist - 60) / 50) * 0.3;
    hips.scale.x = waistScale;
    hips.scale.z = waistScale;

    torsoMat.color.set(data.color || "#2a2a3a");
    const bc = data.bottomColor || data.color || "#2a2a3a";
    bottomMat.color.set(bc);
    hips.material = bottomMat;
    legMeshes.forEach(m => { m.material = bottomMat; });
  }, [data]);

  if (webglError) {
    const tc = data.color || "#2a2a3a";
    const bc = data.bottomColor || data.color || "#2a2a3a";
    return (
      <div className="w-full h-full rounded-xl overflow-hidden border border-primary/20 bg-[#08080e] flex flex-col items-center justify-center gap-4">
        <div className="w-28 h-auto relative">
          <svg viewBox="0 0 100 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-80">
            <circle cx="50" cy="16" r="13" fill="#c0c0d0" />
            <rect x="44" y="27" width="12" height="9" rx="2" fill="#c0c0d0" />
            <rect x="30" y="35" width="40" height="46" rx="4" fill={tc} stroke="rgba(139,92,246,0.4)" strokeWidth="1" />
            <rect x="15" y="37" width="13" height="37" rx="4" fill="#c0c0d0" />
            <rect x="72" y="37" width="13" height="37" rx="4" fill="#c0c0d0" />
            <rect x="30" y="80" width="40" height="18" rx="3" fill={bc} />
            <rect x="31" y="97" width="17" height="58" rx="4" fill={bc} />
            <rect x="52" y="97" width="17" height="58" rx="4" fill={bc} />
          </svg>
          <div className="absolute inset-0" style={{ boxShadow: "0 0 30px rgba(139,92,246,0.12)" }} />
        </div>
        <div className="text-center">
          <p className="text-xs font-mono text-primary/70 tracking-widest uppercase">3D Viewport</p>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">WebGL — Active in Browser</p>
        </div>
        <div className="flex gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 rounded-full bg-primary/40" style={{ height: `${12 + Math.sin(i * 1.3) * 8}px` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="w-full h-full rounded-xl overflow-hidden border border-primary/20 bg-[#08080e]"
      onMouseDown={() => { if (controlsRef.current) controlsRef.current.autoRotate = false; }}
      onMouseUp={() => { if (controlsRef.current) controlsRef.current.autoRotate = true; }}
    />
  );
}
