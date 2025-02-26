import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import bitcoinModel from '../assets/bitcoin.glb';

export function BitcoinModel() {
  const modelRef = useRef();
  const { nodes, materials } = useGLTF(bitcoinModel);

  useEffect(() => {
    
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

  
  const firstMeshKey = Object.keys(nodes).find(key => nodes[key].type === 'Mesh');
  if (!firstMeshKey) {
    console.error('No mesh found in the model');
    return null;
  }

  return (
    <>
      
      <ambientLight intensity={1.2} /> 
      
      
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={2}
        color="#ffffff"
      />
      <directionalLight 
        position={[-10, -10, -5]} 
        intensity={1.5}
        color="#ffffff"
      />
      
      
      <pointLight 
        position={[5, 0, 5]} 
        intensity={1}
        color="#ffffff"
      />
      <pointLight 
        position={[-5, 0, -5]} 
        intensity={1}
        color="#ffffff"
      />
      <pointLight 
        position={[0, 5, 0]} 
        intensity={1}
        color="#ffffff"
      />
      <pointLight 
        position={[0, -5, 0]} 
        intensity={1}
        color="#ffffff"
      />

     
      <spotLight
        position={[0, 10, 0]}
        intensity={1}
        angle={0.6}
        penumbra={1}
        color="#ffffff"
      />

      <group 
        ref={modelRef} 
        dispose={null}
        rotation={[0, 5, 15]}
        position={[0, -.9, 0]} 
      >
        <mesh
          geometry={nodes[firstMeshKey].geometry}
          material={materials[Object.keys(materials)[0]]}
          scale={[0.04, 0.04, 0.04]} 
        />
      </group>
    </>
  );
}

useGLTF.preload(bitcoinModel);