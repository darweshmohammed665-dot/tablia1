import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Camera as CameraIcon, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InteractiveExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [controlActive, setControlActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Stars (Nebula)
    const starsCount = 400;
    const starsGeometry = new THREE.BufferGeometry();
    const starsPositions = new Float32Array(starsCount * 3);
    const starsPhases = new Float32Array(starsCount);

    for (let i = 0; i < starsCount; i++) {
      const phi = Math.random() * 2 * Math.PI;
      const costheta = Math.random() * 2 - 1;
      const r = 200 * Math.pow(Math.random(), 1/3);
      const theta = Math.acos(costheta);
      
      starsPositions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      starsPositions[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi);
      starsPositions[i * 3 + 2] = r * Math.cos(theta);
      starsPhases[i] = Math.random() * 2 * Math.PI;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));
    starsGeometry.setAttribute('phase', new THREE.BufferAttribute(starsPhases, 1));

    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x28beF0) }, // Default Goldish-Blue
        activeColor: { value: new THREE.Color(0xF0BE28) }, // Gold
        controlActive: { value: 0.0 }
      },
      vertexShader: `
        attribute float phase;
        varying float vPhase;
        void main() {
          vPhase = phase;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 4.0 * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 activeColor;
        uniform float controlActive;
        varying float vPhase;
        void main() {
          float twinkle = abs(sin(time * 3.0 + vPhase));
          vec3 finalColor = mix(vec3(0.2, 0.2, 0.2), mix(color, activeColor, controlActive), twinkle);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      transparent: true
    });

    const starPoints = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starPoints);

    camera.position.z = 500;

    // --- MediaPipe Hands Setup ---
    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 0,
      minDetectionConfidence: 0.8,
      minTrackingConfidence: 0.7
    });

    let targetRotationX = 0;
    let targetRotationY = 0;

    hands.onResults((results: Results) => {
      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // Control logic: Index finger up, others down
        const indexUp = landmarks[8].y < landmarks[6].y;
        const middleDown = landmarks[12].y > landmarks[10].y;
        const ringDown = landmarks[16].y > landmarks[14].y;
        const pinkyDown = landmarks[20].y > landmarks[18].y;

        if (indexUp && middleDown && ringDown && pinkyDown) {
          setControlActive(true);
          starsMaterial.uniforms.controlActive.value = 1.0;
          
          // Update rotation based on index finger position
          targetRotationY = (landmarks[8].x - 0.5) * Math.PI * 2;
          targetRotationX = (landmarks[8].y - 0.5) * -Math.PI * 2;
        } else {
          setControlActive(false);
          starsMaterial.uniforms.controlActive.value = 0.0;
        }
      } else {
        setControlActive(false);
        starsMaterial.uniforms.controlActive.value = 0.0;
      }
    });

    if (videoRef.current) {
      const cameraPipe = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await hands.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });
      cameraPipe.start().then(() => {
        setIsCameraActive(true);
        setLoading(false);
      });
    }

    // Animation Loop
    let animationId: number;
    const animate = (time: number) => {
      animationId = requestAnimationFrame(animate);
      
      starsMaterial.uniforms.time.value = time / 1000;
      
      // Smooth rotation
      starPoints.rotation.x += (targetRotationX - starPoints.rotation.x) * 0.1;
      starPoints.rotation.y += (targetRotationY - starPoints.rotation.y) * 0.1;

      renderer.render(scene, camera);
    };
    animate(0);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      hands.close();
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-brand-secondary z-[100] overflow-hidden flex flex-col items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(to right, #444 1px, transparent 1px), linear-gradient(to bottom, #444 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Three.js Container */}
      <div ref={containerRef} className="absolute inset-0 z-10"></div>

      {/* Camera Feed (Hidden) */}
      <video ref={videoRef} className="hidden" playsInline muted></video>

      {/* HUD & UI */}
      <div className="relative z-20 w-full h-full flex flex-col pointer-events-none">
        {/* Header */}
        <div className="p-8 flex justify-between items-start">
          <div className="text-right">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 mb-2"
            >
              <div className={`w-3 h-3 rounded-full ${controlActive ? 'bg-brand-primary animate-pulse' : 'bg-stone-500'}`}></div>
              <span className={`font-black text-xl tracking-wider ${controlActive ? 'text-brand-primary' : 'text-stone-500'}`}>
                {controlActive ? 'نظام التحكم نشط' : 'النظام مقفل: ارفع السبابة للتحكم'}
              </span>
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              سحر <span className="text-brand-primary italic font-serif">طبلية</span> التفاعلي
            </h1>
          </div>
          
          <Link to="/" className="pointer-events-auto bg-white/10 hover:bg-white/20 p-4 rounded-full text-white transition-all backdrop-blur-md">
            <X size={32} />
          </Link>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-secondary z-50">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-brand-primary animate-spin mx-auto mb-4" />
              <p className="text-white font-bold text-2xl">جاري تشغيل السحر...</p>
            </div>
          </div>
        )}

        {/* Instructions Overlay */}
        {!controlActive && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-auto mb-20 mx-auto bg-white/10 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 text-center max-w-2xl"
          >
            <div className="flex justify-center gap-8 mb-8">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
                  <CameraIcon size={40} />
                </div>
                <span className="text-white font-bold">افتح الكاميرا</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
                  <span className="text-4xl font-black">☝️</span>
                </div>
                <span className="text-white font-bold">ارفع السبابة</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary">
                  <ShieldCheck size={40} />
                </div>
                <span className="text-white font-bold">تحكم في النجوم</span>
              </div>
            </div>
            <p className="text-white/80 text-xl font-medium">
              ارفع إصبع السبابة فقط أمام الكاميرا للتحكم في دوران سديم طبلية الذهبي.
            </p>
          </motion.div>
        )}

        {/* Active HUD */}
        {controlActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-auto mb-20 mx-auto"
          >
            <div className="px-12 py-6 bg-brand-primary text-white rounded-full font-black text-3xl shadow-[0_0_50px_rgba(225,79,51,0.5)] animate-pulse">
              JOYSTICK ACTIVE
            </div>
          </motion.div>
        )}
      </div>

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[99] opacity-[0.05] bg-grain"></div>
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3L14.5 9L21 11.5L14.5 14L12 21L9.5 14L3 11.5L9.5 9L12 3Z" fill="currentColor" />
  </svg>
);
