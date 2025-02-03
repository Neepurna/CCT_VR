import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import bitcoinModel from '../assets/bitcoin_01.glb';

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
      {/* Add lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      <group 
        ref={modelRef} 
        dispose={null}
        rotation={[Math.PI / 2, Math.PI / 2, 0]} // Rotated to lay flat and face forward
        position={[0, 0, 0]}
      >
        <mesh
          geometry={nodes[firstMeshKey].geometry}
          material={materials[Object.keys(materials)[0]]}
          scale={[2, 2, 2]}
        />
      </group>
    </>
  );
}

useGLTF.preload(bitcoinModel);