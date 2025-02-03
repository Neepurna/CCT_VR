import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls, Text, Float, useTexture, Html } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { Vector3, Matrix4, TextureLoader } from 'three';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import axios from 'axios';

function HolographicCard({ coin, position }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Make the card group face the camera
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
        {/* Card Background */}
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

        {/* Coin Logo */}
        <mesh position={[-3, 1.5, 0.06]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial 
            map={texture} 
            transparent 
            alphaTest={0.5}
          />
        </mesh>

        {/* Coin Name and Symbol */}
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

        {/* Price */}
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

        {/* 24h Change */}
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

        {/* Market Cap */}
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

// New SearchBox component
function SearchBox({ onSearch, visible }) {
  if (!visible) return null;
  
  return (
    <Html center position={[0, 4, -23.5]}> {/* Moved forward and lower */}
      <div style={{ 
        width: '400px', 
        background: 'rgba(26, 35, 53, 0.9)', 
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)'
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

  useEffect(() => {
    // Generate obstacle positions in a circle
    const positions = [...Array(8)].map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 30;
      return [
        Math.sin(angle) * radius,
        2, // Height of obstacles
        Math.cos(angle) * radius
      ];
    });
    obstaclePositions.current = positions;

    // Fetch coins data
    const fetchCoins = async () => {
      try {
        const response = await axios.get(
          'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=8', // Limit to 8 to match obstacles
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
      if (e.code === 'KeyE') {
        setSearchVisible(prev => !prev);
        setMovementEnabled(prev => !prev); // Toggle movement when E is pressed
        if (searchVisible) {
          setSearchResults([]); // Clear search results when closing
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [searchVisible]);

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
      ).slice(0, 1); // Get only first match

      setSearchResults(filtered);
      setSearchVisible(false); // Hide search after finding result
      setMovementEnabled(true); // Re-enable movement after search
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <group>
      {/* Floor with brighter color */}
      <RigidBody type="fixed">
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[100, 100]} /> {/* Increased floor size */}
          <meshStandardMaterial 
            color="#2196f3" 
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
      </RigidBody>

      {/* Title - repositioned */}
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
        Crypto Coin Tracker
      </Text>

      {/* Search Box Obstacle */}
      <RigidBody type="fixed">
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
        
        {/* Enhanced text visibility */}
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
          {/* Glow effect layer */}
          <Text
            fontSize={0.6}
            color="#00ffff"
            anchorX="center"
            anchorY="middle"
            opacity={0.5}
            position={[0, 0, -0.1]}
          >
            Press E to Search
          </Text>
        </group>
      </RigidBody>

      {/* Search Interface */}
      <SearchBox onSearch={handleSearch} visible={searchVisible} />

      {/* Search Results - positioned as a floating card */}
      {searchResults.map((coin, index) => (
        <HolographicCard
          key={coin.id}
          coin={coin}
          position={[0, 6, -24]} // Lowered and brought forward
        />
      ))}

      {/* Obstacles with colliders and cards above them */}
      <RigidBody type="fixed">
        {obstaclePositions.current.map((position, i) => (
          <group key={i}>
            {/* Obstacle cube */}
            <mesh position={position} castShadow>
              <boxGeometry args={[2, 4, 2]} />
              <meshStandardMaterial 
                color={`hsl(${i * 45}, 70%, 50%)`}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
            <CuboidCollider args={[1, 2, 1]} position={position} />
            
            {/* Holographic card above cube */}
            {coins[i] && (
              <HolographicCard
                coin={coins[i]}
                position={[
                  position[0],     // Same X as obstacle
                  position[1] + 6, // 6 units above obstacle
                  position[2]      // Same Z as obstacle
                ]}
              />
            )}
          </group>
        ))}
      </RigidBody>

      {/* Pass movement state to Player */}
      <Player movementEnabled={movementEnabled} />
    </group>
  );
}

function Player({ movementEnabled = true }) {
  const { camera } = useThree();
  const moveSpeed = 0.15;
  const keys = useRef({});
  const playerHeight = 1.8;

  useEffect(() => {
    camera.position.set(0, playerHeight, 5); // Start position

    const handleKeyDown = (e) => keys.current[e.code] = true;
    const handleKeyUp = (e) => keys.current[e.code] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [camera]);

  useFrame(() => {
    if (!movementEnabled) return; // Skip movement processing if disabled

    // Movement direction
    const forward = keys.current['KeyW'] ? -1 : (keys.current['KeyS'] ? 1 : 0);
    const sideways = keys.current['KeyA'] ? -1 : (keys.current['KeyD'] ? 1 : 0);

    if (forward || sideways) {
      // Get camera's forward and right vectors
      const matrix = new Matrix4();
      matrix.extractRotation(camera.matrix);
      
      const forwardVector = new Vector3(0, 0, 1).applyMatrix4(matrix);
      const sidewaysVector = new Vector3(1, 0, 0).applyMatrix4(matrix);

      // Calculate movement
      const movement = new Vector3()
        .addScaledVector(forwardVector, forward * moveSpeed)
        .addScaledVector(sidewaysVector, sideways * moveSpeed);
      movement.y = 0; // Keep vertical position constant

      // Apply movement
      camera.position.add(movement);
    }

    // Maintain height
    camera.position.y = playerHeight;
  });

  return <PointerLockControls enabled={movementEnabled} />;
}

const GameplayBoard = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Physics gravity={[0, -9.81, 0]}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} castShadow />
          <Environment />
          <Player />
          <PointerLockControls />
        </Physics>
      </Canvas>
    </div>
  );
};

export default GameplayBoard;
