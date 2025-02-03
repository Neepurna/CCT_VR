import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls, Text, Float, useTexture, Html } from '@react-three/drei';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Vector3, Matrix4, TextureLoader } from 'three';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import axios from 'axios';

function HolographicCard({ coin, position }) {
  const { camera } = useThree();
  
  useFrame(() => {
    group.current.lookAt(camera.position);
  });
  
  const group = useRef();
  const texture = useTexture(
    `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`
  );

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.1}
      floatIntensity={0.3}
      position={position}
    >
      <group ref={group}>
        <mesh castShadow>
          <boxGeometry args={[8, 5, 0.1]} />
          <meshPhysicalMaterial
            color="#1a1f35"
            transparent
            opacity={0.8}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        <mesh position={[-3, 1.5, 0.06]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            alphaTest={0.5}
          />
        </mesh>

        <Text
          position={[-1.5, 1.5, 0.06]}
          fontSize={0.4}
          color="#ffffff"
          maxWidth={4}
          textAlign="left"
          anchorX="left"
        >
          {`${coin.name} (${coin.symbol})`}
        </Text>

        <Text
          position={[-3, 0.5, 0.06]}
          fontSize={0.35}
          color="#ffffff"
          maxWidth={6}
          textAlign="left"
          anchorX="left"
        >
          {`$${Number(coin.quote?.USD?.price).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}`}
        </Text>

        <Text
          position={[-3, -0.3, 0.06]}
          fontSize={0.35}
          color={coin.quote?.USD?.percent_change_24h >= 0 ? "#00ff00" : "#ff0000"}
          maxWidth={6}
          textAlign="left"
          anchorX="left"
        >
          {`24h: ${coin.quote?.USD?.percent_change_24h >= 0 ? '+' : ''}${coin.quote?.USD?.percent_change_24h?.toFixed(2)}%`}
        </Text>

        <Text
          position={[-3, -1.1, 0.06]}
          fontSize={0.3}
          color="#8e9eaf"
          maxWidth={6}
          textAlign="left"
          anchorX="left"
        >
          {`MCap: $${Number(coin.quote?.USD?.market_cap).toLocaleString(undefined, {
            maximumFractionDigits: 0
          })}`}
        </Text>
      </group>
    </Float>
  );
}

function SearchBox({ onSearch, visible }) {
  if (!visible) return null;
  
  return (
    <Html center position={[0, 4.5, -24]}>
      <div style={{ 
        width: '400px', 
        background: 'rgba(26, 35, 53, 0.95)', 
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
        transform: 'translateY(-50%)',
      }}>
        <input
          type="text"
          placeholder="Type and press Enter to search..."
          style={{
            width: '100%',
            padding: '12px',
            border: '2px solid #00ffff',
            borderRadius: '6px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            outline: 'none',
            fontSize: '16px'
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(e.target.value);
              e.target.value = '';
            }
          }}
          autoFocus
        />
      </div>
    </Html>
  );
}

function Environment() {
  const [coins, setCoins] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const obstaclePositions = useRef([]);
  const [movementEnabled, setMovementEnabled] = useState(true);
  const [controlsEnabled, setControlsEnabled] = useState(true);
  const searchBoxRef = useRef();
  const { camera } = useThree();

  const isSearchBoxVisible = useCallback(() => {
    const searchPosition = new Vector3(0, 3.5, -24);
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    
    const toSearchBox = searchPosition.clone().sub(camera.position).normalize();
    const angle = cameraDirection.angleTo(toSearchBox);
    const distance = camera.position.distanceTo(searchPosition);
    
    return angle < 1.0 && distance < 30;
  }, [camera]);

  useEffect(() => {
    const positions = [...Array(8)].map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 30;
      return [
        Math.sin(angle) * radius,
        2,
        Math.cos(angle) * radius
      ];
    });
    obstaclePositions.current = positions;

    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=8',
          {
            headers: {
              'X-CMC_PRO_API_KEY': import.meta.env.VITE_CMC_API_KEY,
            },
          }
        );
        setCoins(response.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCoins();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'KeyE' && isSearchBoxVisible() && !searchVisible) {
        setSearchVisible(true);
        setControlsEnabled(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchVisible, isSearchBoxVisible]);

  const handleSearch = async (searchTerm) => {
    try {
      const response = await axios.get(
        'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
        {
          headers: {
            'X-CMC_PRO_API_KEY': import.meta.env.VITE_CMC_API_KEY,
          },
        }
      );
      const filtered = response.data.data.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 1);

      setSearchResults(filtered);
      setSearchVisible(false);
      setTimeout(() => {
        setControlsEnabled(true);
        document.body.requestPointerLock();
      }, 100);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <group>
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial 
            color="#2196f3" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
      </RigidBody>

      <Text
        position={[0, 12, -30]}
        fontSize={3}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={30}
        outlineWidth={0.2}
        outlineColor="#000000"
        outlineOpacity={0.8}
      >
       Immersive Crypto Coin Tracker
      </Text>

      <RigidBody type="fixed" ref={searchBoxRef}>
        <mesh position={[0, 2, -25]} castShadow>
          <boxGeometry args={[4, 4, 2]} />
          <meshStandardMaterial 
            color="#1a1f35"
            emissive="#1a1f35"
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <CuboidCollider args={[2, 2, 1]} position={[0, 2, -25]} />
        
        <group position={[0, 3.5, -23.8]}>
          <Text
            fontSize={0.6}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.15}
            outlineColor="#000000"
            outlineOpacity={1}
          >
            Press E to Search
          </Text>
          <Text
            fontSize={0.6}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            opacity={isSearchBoxVisible() ? 0.5 : 0}
            position={[0, 0, -0.1]}
          >
            Press E to Search
          </Text>
        </group>
      </RigidBody>

      <SearchBox onSearch={handleSearch} visible={searchVisible} />

      {searchResults.map((coin, index) => (
        <HolographicCard
          key={coin.id}
          coin={coin}
          position={[0, 6, -24]}
        />
      ))}

      <RigidBody type="fixed">
        {obstaclePositions.current.map((position, i) => (
          <group key={i}>
            <mesh position={position} castShadow>
              <boxGeometry args={[2, 4, 2]} />
              <meshStandardMaterial 
                color={`hsl(${i * 45}, 70%, 50%)`}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            <CuboidCollider args={[1, 2, 1]} position={position} />
            
            {coins[i] && (
              <HolographicCard
                coin={coins[i]}
                position={[
                  position[0],
                  position[1] + 6,
                  position[2]
                ]}
              />
            )}
          </group>
        ))}
      </RigidBody>

      <Player enabled={controlsEnabled} />
    </group>
  );
}

function Player({ enabled }) {
  const { camera } = useThree();
  const moveSpeed = 0.15;
  const keys = useRef({});
  const playerHeight = 1.8;
  const controlsRef = useRef();

  useEffect(() => {
    keys.current = {};
    if (controlsRef.current) {
      if (!enabled) {
        controlsRef.current.unlock();
      }
    }
  }, [enabled]);

  useEffect(() => {
    camera.position.set(0, playerHeight, 5);

    const handleKeyDown = (e) => {
      if (enabled && (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD')) {
        keys.current[e.code] = true;
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e) => {
      if (e.code === 'KeyW' || e.code === 'KeyA' || e.code === 'KeyS' || e.code === 'KeyD') {
        keys.current[e.code] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera, enabled]);

  useFrame(() => {
    if (!enabled) return;

    const forward = keys.current['KeyW'] ? -1 : (keys.current['KeyS'] ? 1 : 0);
    const sideways = keys.current['KeyA'] ? -1 : (keys.current['KeyD'] ? 1 : 0);

    if (forward || sideways) {
      const matrix = new Matrix4();
      matrix.extractRotation(camera.matrix);
      
      const forwardVector = new Vector3(0, 0, 1).applyMatrix4(matrix);
      const sidewaysVector = new Vector3(1, 0, 0).applyMatrix4(matrix);

      const movement = new Vector3()
        .addScaledVector(forwardVector, forward * moveSpeed)
        .addScaledVector(sidewaysVector, sideways * moveSpeed);
      movement.y = 0;

      camera.position.add(movement);
    }

    camera.position.y = playerHeight;
  });

  useEffect(() => {
    if (enabled) {
      document.body.requestPointerLock();
    }
  }, [enabled]);

  return <PointerLockControls ref={controlsRef} enabled={enabled} />;
}

const GameplayBoard = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Physics gravity={[0, -9.81, 0]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />
          <Environment />
        </Physics>
      </Canvas>
    </div>
  );
};

export default GameplayBoard;
