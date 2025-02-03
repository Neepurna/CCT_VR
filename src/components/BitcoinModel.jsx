import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import bitcoinModel from '../assets/bitcoin.glb';

export function BitcoinModel() {
  const modelRef = useRef();
  const { nodes, materials } = useGLTF(bitcoinModel);

  useEffect(() => {
    // Debug log to inspect model structure
    console.log('Model nodes:', nodes);
    console.log('Model materials:', materials);
  }, [nodes, materials]);

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * 0.5;
    }
  });

  if (!nodes || !materials) {
    return null;
  }

  // Find the first mesh in the nodes object
  const firstMeshKey = Object.keys(nodes).find(key => nodes[key].type === 'Mesh');
  if (!firstMeshKey) {
    console.error('No mesh found in the model');
    return null;
  }

  return (
    <>
      {/* Three-point lighting setup */}
      <ambientLight intensity={0.6} /> {/* Overall ambient light */}
      
      {/* Key light - main light source */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1.5}
        color="#ffffff"
      />
      
      {/* Fill light - softer secondary light */}
      <pointLight 
        position={[-5, 5, -5]} 
        intensity={0.8}
        color="#b1e1ff"
      />
      
      {/* Back light - rim lighting */}
      <spotLight
        position={[0, -10, -5]}
        intensity={0.5}
        angle={0.5}
        penumbra={1}
        color="#ffffff"
      />

      <group 
        ref={modelRef} 
        dispose={null}
        rotation={[0, 5, 15]} // Rotated to lay flat and face forward
        position={[0, -.9, 0]} // Center position
      >
        <mesh
          geometry={nodes[firstMeshKey].geometry}
          material={materials[Object.keys(materials)[0]]}
          scale={[0.05, 0.05, 0.05]} // Reduced scale from 2 to 0.5
        />
      </group>
    </>
  );
}

useGLTF.preload(bitcoinModel);