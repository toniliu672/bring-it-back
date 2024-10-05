import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

const BackgroundScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const materialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const { theme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    cameraRef.current = camera;
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    rendererRef.current = renderer;

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const gridHelper = new THREE.GridHelper(20, 20, 0x000000, 0x000000);
    const material = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.1,
    });
    materialRef.current = material;
    gridHelper.material = material;
    scene.add(gridHelper);

    camera.position.z = 10;
    camera.position.y = 5;
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const animate = () => {
      if (gridHelper && rendererRef.current && sceneRef.current && cameraRef.current) {
        gridHelper.rotation.x += 0.0005;
        gridHelper.rotation.y += 0.0005;
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const currentTheme = theme === 'system' ? systemTheme : theme;
    if (materialRef.current && sceneRef.current && rendererRef.current && cameraRef.current) {
      if (currentTheme === 'dark') {
        materialRef.current.color.setHex(0xffffff);
        sceneRef.current.background = new THREE.Color(0x111827);
      } else {
        materialRef.current.color.setHex(0x000000);
        sceneRef.current.background = new THREE.Color(0xf3f4f6);
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [theme, systemTheme, isMounted]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default BackgroundScene;