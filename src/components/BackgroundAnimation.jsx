import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedurally generates high-quality textures for different box types.
 * Avoids external assets while providing realistic print details, barcodes, and shipping labels.
 */
const createProceduralTexture = (type) => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  if (type === "kraft") {
    // 1. Kraft cardboard base
    ctx.fillStyle = "#d4a773";
    ctx.fillRect(0, 0, 512, 512);

    // Subtle corrugated texture lines
    ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
    for (let i = 0; i < 512; i += 12) {
      ctx.fillRect(i, 0, 4, 512);
    }
    
    // Tiny fiber noise
    ctx.fillStyle = "rgba(0, 0, 0, 0.07)";
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const w = Math.random() * 2 + 1;
      const h = Math.random() * 2 + 1;
      ctx.fillRect(x, y, w, h);
    }

    // 2. Printed branding
    ctx.fillStyle = "#1e120a"; // Dark brown ink
    ctx.font = "bold 34px 'Outfit', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("SHUKANPACK", 256, 120);
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("PREMIUM PACKAGING SOLUTIONS", 256, 145);

    // 3. Packaging icons (Fragile, Recycle, Handle with Care)
    // Draw upward arrows (This Side Up)
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#1e120a";
    ctx.beginPath();
    ctx.moveTo(80, 240); ctx.lineTo(80, 200);
    ctx.moveTo(70, 215); ctx.lineTo(80, 200); ctx.lineTo(90, 215);
    ctx.moveTo(100, 240); ctx.lineTo(100, 200);
    ctx.moveTo(90, 215); ctx.lineTo(100, 200); ctx.lineTo(110, 215);
    ctx.stroke();

    // Draw fragile wine glass
    ctx.beginPath();
    ctx.arc(256, 208, 12, 0, Math.PI, false); // Glass cup top
    ctx.lineTo(256, 230); // Stem
    ctx.moveTo(246, 230); ctx.lineTo(266, 230); // Base
    ctx.stroke();

    // Draw recycle symbol
    ctx.font = "32px Arial";
    ctx.fillText("♻", 420, 230);

    // 4. Shipping Label
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(90, 310, 332, 160);
    
    // Address lines
    ctx.fillStyle = "#222222";
    ctx.fillRect(110, 335, 170, 8);
    ctx.fillRect(110, 350, 130, 6);
    ctx.fillRect(110, 362, 150, 6);

    // Barcode on shipping label
    ctx.fillStyle = "#000000";
    let barcodeX = 300;
    while (barcodeX < 400) {
      const width = Math.random() > 0.5 ? 5 : 2;
      ctx.fillRect(barcodeX, 335, width, 55);
      barcodeX += width + (Math.random() > 0.5 ? 3 : 1);
    }
    ctx.font = "bold 10px Courier New";
    ctx.fillText("SP-IN-2026-SHUKAN", 350, 405);

    // Warning text on label
    ctx.fillStyle = "#c2410c"; // Orange-Red warning
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("STANDARD SHIPPING", 110, 435);
    ctx.fillText("HANDLE WITH CARE", 110, 450);

  } else if (type === "premium") {
    // Premium printed box (Navy Blue and Ocean Blue brand packaging)
    ctx.fillStyle = "#0a2d54"; // Navy
    ctx.fillRect(0, 0, 512, 512);

    // Geometric accent curves
    ctx.fillStyle = "#0076a8"; // Ocean Blue
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.bezierCurveTo(150, 200, 350, 450, 512, 280);
    ctx.lineTo(512, 512);
    ctx.lineTo(0, 512);
    ctx.closePath();
    ctx.fill();

    // Gold accent line
    ctx.strokeStyle = "#c59b6c"; // Gold
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.bezierCurveTo(150, 200, 350, 450, 512, 280);
    ctx.stroke();

    // Brand Print
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 36px 'Outfit', sans-serif";
    ctx.fillText("ShukanPack", 40, 90);
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.font = "14px 'Inter', sans-serif";
    ctx.fillText("CUSTOM PACKAGING MANUFACTURER", 40, 115);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px 'Inter', sans-serif";
    ctx.fillText("Premium Box Series", 40, 400);
    ctx.font = "13px 'Inter', sans-serif";
    ctx.fillText("Eco-Friendly & Sustainable Solutions", 40, 425);

    // Barcode on product box
    ctx.fillStyle = "#ffffff";
    let barcodeX = 40;
    while (barcodeX < 200) {
      const width = Math.random() > 0.5 ? 4 : 2;
      ctx.fillRect(barcodeX, 450, width, 30);
      barcodeX += width + (Math.random() > 0.5 ? 2.5 : 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Realistic cardboard shipping box with animated folding flaps and sealing tape.
 */
function RealisticShippingBox({ w = 2, h = 1.6, d = 2, texture, timeOffset = 0, ...props }) {
  const groupRef = useRef();
  const tapeRef = useRef();
  
  // Flap refs
  const flapFront = useRef();
  const flapBack = useRef();
  const flapLeft = useRef();
  const flapRight = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime() + timeOffset;
    
    // Animation timeline: 10 second loop
    // 0s-2.5s: Box is wide open
    // 2.5s-4.5s: Left & Right flaps fold in (Z-axis rotation)
    // 4.5s-6.5s: Front & Back flaps fold in (X-axis rotation)
    // 6.5s-7.5s: Tape seals the box
    // 7.5s-9.5s: Fully sealed box
    // 9.5s-10s: Unseal and open
    const cycle = time % 10;
    
    let leftRightAngle = Math.PI / 3; // 60 degrees open
    let frontBackAngle = Math.PI / 3; // 60 degrees open
    let tapeOpacity = 0;

    if (cycle >= 2.5 && cycle < 4.5) {
      const t = (cycle - 2.5) / 2;
      leftRightAngle = (Math.PI / 3) * (1 - t); // folds to 0
    } else if (cycle >= 4.5) {
      leftRightAngle = 0; // stays closed
    }

    if (cycle >= 4.5 && cycle < 6.5) {
      const t = (cycle - 4.5) / 2;
      frontBackAngle = (Math.PI / 3) * (1 - t); // folds to 0
    } else if (cycle >= 6.5) {
      frontBackAngle = 0; // stays closed
    }

    if (cycle >= 6.5 && cycle < 7.5) {
      tapeOpacity = (cycle - 6.5);
    } else if (cycle >= 7.5 && cycle < 9.5) {
      tapeOpacity = 1;
    } else if (cycle >= 9.5) {
      tapeOpacity = 1 - (cycle - 9.5) * 2;
    }

    // Apply rotations
    if (flapLeft.current) flapLeft.current.rotation.z = leftRightAngle;
    if (flapRight.current) flapRight.current.rotation.z = -leftRightAngle;
    if (flapFront.current) flapFront.current.rotation.x = frontBackAngle;
    if (flapBack.current) flapBack.current.rotation.x = -frontBackAngle;
    
    // Apply tape opacity
    if (tapeRef.current) {
      tapeRef.current.material.opacity = Math.max(0, Math.min(1, tapeOpacity));
      tapeRef.current.visible = tapeOpacity > 0.01;
    }

    // Gentle floating and rotation of the entire box
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.12;
      groupRef.current.rotation.x = Math.sin(time * 0.1) * 0.1;
      groupRef.current.position.y = props.position[1] + Math.sin(time * 0.35) * 0.25;
    }
  });

  const flapLength = d / 2;
  const sideFlapLength = w / 2;

  return (
    <group ref={groupRef} {...props}>
      {/* Main Box Body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial map={texture} roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Outlines of main body for premium 3D look */}
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color="#78350f" linewidth={1.5} transparent opacity={0.3} />
      </lineSegments>

      {/* --- FLAPS --- */}
      {/* Front Flap */}
      <group ref={flapFront} position={[0, h / 2, d / 2]}>
        <mesh position={[0, 0, flapLength / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, flapLength]} />
          <meshStandardMaterial map={texture} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Back Flap */}
      <group ref={flapBack} position={[0, h / 2, -d / 2]}>
        <mesh position={[0, 0, -flapLength / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[w, flapLength]} />
          <meshStandardMaterial map={texture} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Left Flap */}
      <group ref={flapLeft} position={[-w / 2, h / 2, 0]}>
        <mesh position={[-sideFlapLength / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[d, sideFlapLength]} />
          <meshStandardMaterial map={texture} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Right Flap */}
      <group ref={flapRight} position={[w / 2, h / 2, 0]}>
        <mesh position={[sideFlapLength / 2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <planeGeometry args={[d, sideFlapLength]} />
          <meshStandardMaterial map={texture} roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Sealing Tape (Seals the top middle seam) */}
      <mesh ref={tapeRef} position={[0, h / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w + 0.1, 0.18]} />
        <meshStandardMaterial color="#b45309" transparent opacity={0} roughness={0.1} metalness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Premium printed branded product box (closed, glossy).
 */
function PremiumProductBox({ size = [1.6, 2.2, 1.2], texture, timeOffset = 0, ...props }) {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + timeOffset;
    if (ref.current) {
      ref.current.rotation.y = time * 0.15;
      ref.current.rotation.z = Math.sin(time * 0.15) * 0.08;
      ref.current.position.y = props.position[1] + Math.sin(time * 0.4) * 0.2;
    }
  });

  return (
    <group ref={ref} {...props}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial map={texture} roughness={0.2} metalness={0.2} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(...size)]} />
        <lineBasicMaterial color="#005f87" linewidth={1.5} transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

/**
 * Cardboard mailing tube with plastic white end caps.
 */
function MailingTube({ r = 0.35, h = 3, texture, timeOffset = 0, ...props }) {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + timeOffset;
    if (ref.current) {
      ref.current.rotation.x = time * 0.1;
      ref.current.rotation.y = time * 0.08;
      ref.current.position.y = props.position[1] + Math.sin(time * 0.3) * 0.18;
    }
  });

  return (
    <group ref={ref} {...props}>
      {/* Tube Body */}
      <mesh>
        <cylinderGeometry args={[r, r, h, 24]} />
        <meshStandardMaterial map={texture} roughness={0.6} />
      </mesh>
      {/* Top Cap */}
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r + 0.01, r + 0.01, 0.08, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
      {/* Bottom Cap */}
      <mesh position={[0, -h / 2, 0]}>
        <cylinderGeometry args={[r + 0.01, r + 0.01, 0.08, 24]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * Premium Gift Box with cross ribbons and metallic bow structure.
 */
function GiftCrateBox({ size = [1.5, 1.3, 1.5], color = "#c59b6c", ribbonColor = "#0a2d54", timeOffset = 0, ...props }) {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + timeOffset;
    if (ref.current) {
      ref.current.rotation.y = -time * 0.1;
      ref.current.rotation.x = Math.sin(time * 0.1) * 0.08;
      ref.current.position.y = props.position[1] + Math.sin(time * 0.25) * 0.22;
    }
  });

  const [w, h, d] = size;

  return (
    <group ref={ref} {...props}>
      {/* Main Kraft Box */}
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
      
      {/* Vertical Ribbon 1 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.16, h + 0.02, d + 0.02]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Vertical Ribbon 2 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w + 0.02, h + 0.02, 0.16]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.1} />
      </mesh>

      {/* Ribbon Knot / Center Cap */}
      <mesh position={[0, h / 2 + 0.03, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.3} metalness={0.3} />
      </mesh>
    </group>
  );
}

function BlueprintGrid() {
  return (
    <group position={[0, 0, -10]} rotation={[Math.PI / 16, 0, 0]}>
      {/* Design floor grid */}
      <gridHelper args={[50, 50, "#0076a8", "#cbd5e1"]} position={[0, -5, 0]} transparent opacity={0.2} />
    </group>
  );
}

function BackgroundAnimation() {
  // UseMemo to create procedural canvas textures once
  const kraftTexture = useMemo(() => createProceduralTexture("kraft"), []);
  const premiumTexture = useMemo(() => createProceduralTexture("premium"), []);

  // Performance & Rendering optimizations
  const [renderCanvas, setRenderCanvas] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  // Responsive state
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // 1. Delay canvas rendering to allow initial page paints to complete instantly
    const mountTimer = setTimeout(() => {
      setRenderCanvas(true);
    }, 100);

    // 2. Pause WebGL frame loop when canvas scrolls out of viewport to conserve CPU/GPU
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.02 }
    );

    const currentContainer = containerRef.current;
    if (currentContainer) {
      observer.observe(currentContainer);
    }

    return () => {
      clearTimeout(mountTimer);
      if (currentContainer) {
        observer.unobserve(currentContainer);
      }
    };
  }, []);

  // Dynamic box position coordinates based on device screen size
  const box1Pos = isMobile ? [-1.3, 2.5, -1] : [-4.3, 0.6, -1];
  const box1Scale = isMobile ? 0.6 : 1;

  const box2Pos = isMobile ? [1.3, -2.5, -1] : [4.3, -0.6, -1];
  const box2Scale = isMobile ? 0.6 : 1;

  const box3Pos = isMobile ? [-1.4, -4.2, -3] : [-5.0, -2.4, -3];
  const box3Scale = isMobile ? 0.6 : 1;

  const box4Pos = isMobile ? [1.4, 4.2, -3] : [5.0, 2.5, -3];
  const box4Scale = isMobile ? 0.6 : 1;

  const box5Pos = isMobile ? [0, 0, -4] : [-2.5, 3.2, -4];
  const box5Scale = isMobile ? 0.55 : 1;

  // Dynamic light positions based on device screen size to maintain high-quality specular highlights
  const light1Pos = isMobile ? [-1.5, 3.0, 1.5] : [-4.5, 1.2, 1.5];
  const light2Pos = isMobile ? [1.5, -3.0, 1.5] : [4.5, -1.2, 1.5];
  const light3Pos = isMobile ? [-2.0, -4.0, -1] : [-5.0, -2.0, -1];
  const light4Pos = isMobile ? [2.0, 4.0, -1] : [5.0, 2.0, -1];

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        // Multi-layered radial gradient that adds glowing color highlights to the page edges
        background: "radial-gradient(circle at 5% 15%, rgba(197, 155, 108, 0.07) 0%, transparent 35%), radial-gradient(circle at 95% 85%, rgba(0, 118, 168, 0.08) 0%, transparent 45%), radial-gradient(circle at 90% 15%, rgba(10, 45, 84, 0.05) 0%, transparent 35%), linear-gradient(to bottom, #f8fafc, #f1f5f9)",
      }}
    >
      {/* Opacity wrapper (32%) to prevent blocking text/content while maintaining visibility */}
      <div 
        style={{ 
          width: "100%", 
          height: "100%", 
          opacity: renderCanvas ? 0.32 : 0,
          transition: "opacity 0.8s ease" 
        }}
      >
        {renderCanvas && (
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 50 }}
            frameloop={isVisible ? "always" : "never"}
          >
            {/* Quality lighting for shadows and specular highlights */}
            <ambientLight intensity={1.1} />
            <directionalLight position={[10, 15, 10]} intensity={1.4} />
            <directionalLight position={[-10, -5, -10]} intensity={0.5} />
            
            {/* Glowing specular point lights next to the boxes for high-fidelity highlights */}
            <pointLight position={light1Pos} color="#c59b6c" intensity={4} distance={isMobile ? 4 : 6} decay={1.5} />
            <pointLight position={light2Pos} color="#0076a8" intensity={5} distance={isMobile ? 4 : 6} decay={1.5} />
            <pointLight position={light3Pos} color="#0a2d54" intensity={3} distance={isMobile ? 4 : 5} decay={1.5} />
            <pointLight position={light4Pos} color="#c59b6c" intensity={4} distance={isMobile ? 4 : 5} decay={1.5} />

            {/* Subtle grid base */}
            <BlueprintGrid />

            {/* 1. Far Left - Large Cardboard Box with folding flaps and tape */}
            <RealisticShippingBox
              position={box1Pos}
              scale={box1Scale}
              w={1.9}
              h={1.6}
              d={1.9}
              texture={kraftTexture}
              timeOffset={0}
            />

            {/* 2. Far Right - Premium Custom Product Box */}
            <PremiumProductBox
              position={box2Pos}
              scale={box2Scale}
              size={[1.6, 2.3, 1.2]}
              texture={premiumTexture}
              timeOffset={4.5}
            />

            {/* 3. Bottom Far-Left Background - Gift Box with blue ribbons */}
            <GiftCrateBox
              position={box3Pos}
              scale={box3Scale}
              size={[1.4, 1.2, 1.4]}
              color="#c59b6c"
              ribbonColor="#0a2d54"
              timeOffset={2}
            />

            {/* 4. Top Far-Right Background - Mailing Tube (tube packaging) */}
            <MailingTube
              position={box4Pos}
              scale={box4Scale}
              r={0.32}
              h={2.8}
              texture={kraftTexture}
              timeOffset={7.5}
            />

            {/* 5. Left-skewed Background Box (Keeps Center Clear) */}
            <RealisticShippingBox
              position={box5Pos}
              scale={box5Scale}
              w={1.2}
              h={1.0}
              d={1.2}
              texture={kraftTexture}
              timeOffset={11}
            />
          </Canvas>
        )}
      </div>
    </div>
  );
}

export default BackgroundAnimation;
