import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, Sphere } from "@react-three/drei";
import * as THREE from "three";

// Helper to convert Lat/Lon to 3D position
const latLngToVector3 = (lat, lng, radius) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

function Globe({ data }) {
  const groupRef = useRef();

  // Create geometry from GeoJSON
  const lines = useMemo(() => {
    if (!data || !data.features) return [];

    const allLines = [];
    const radius = 5; // Globe radius

    data.features.forEach((feature) => {
      const geometry = feature.geometry;
      if (!geometry) return;

      const processPolygon = (coords) => {
        const points = coords.map((coord) =>
          latLngToVector3(coord[1], coord[0], radius),
        );
        allLines.push(points);
      };

      if (geometry.type === "Polygon") {
        geometry.coordinates.forEach(processPolygon);
      } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          polygon.forEach(processPolygon);
        });
      }
    });

    return allLines;
  }, [data]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001; // Slow rotation
    }
  });

  return (
    <group ref={groupRef}>
      {/* Inner Sphere (Water/Background) */}
      <Sphere args={[4.95, 64, 64]}>
        <meshBasicMaterial color="#f0f9ff" transparent opacity={0.3} />
      </Sphere>

      {/* Country Borders */}
      {lines.map((points, i) => (
        <Line
          key={i}
          points={points}
          color="#0076a8" // Brand ocean blue
          lineWidth={1.5} // Slightly thicker lines for visibility
          transparent
          opacity={0.6} // More opaque
        />
      ))}
    </group>
  );
}

import geoData from "../../public/data/countries.json";

function BackgroundAnimation() {
  // Use imported data directly
  console.log(
    "GeoData loaded:",
    geoData ? "Yes" : "No",
    geoData?.features?.length,
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0.9, // Increased overall visibility
        background: "linear-gradient(to bottom, #ffffff, #f3f4f6)", // Subtle gradient background
      }}
    >
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={1} />
        <Globe data={geoData} />
      </Canvas>
    </div>
  );
}

export default BackgroundAnimation;
