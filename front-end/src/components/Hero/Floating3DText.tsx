import { Center, Float, Text3D } from '@react-three/drei'

type Floating3DTextProps = {
  text: string
  size: number
  floatSpeed?: number
  floatIntensity?: number
  rotationIntensity?: number
  floatingRange?: [number, number]
  position: [number, number, number]
  color?: string
}

export default function Floating3DText({
  text,
  size,
  rotationIntensity = 0,
  floatSpeed = 3,
  floatIntensity = 1,
  floatingRange = [-0.1, 0.1],
  position,
  color = 'white',
  ...props
}: Floating3DTextProps) {
  return (
    <group>
      <Center rotation={[0, 0, 0]} position={position}>
        <Float
          speed={floatSpeed} // Animation speed, defaults to 1
          rotationIntensity={rotationIntensity} // XYZ rotation intensity, defaults to 1
          floatingRange={floatingRange} // Up/down floating range, defaults to [0, 0]
          floatIntensity={floatIntensity} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          {...props}
        >
          <Text3D
            font='/fonts/Inter_Bold.json'
            curveSegments={15}
            bevelEnabled={true}
            bevelThickness={0.05}
            
            size={size}
            rotation={[-0.15, 0, 0]}
          >
            {text}
            <meshNormalMaterial />
          </Text3D>
        </Float>
      </Center>
    </group>
  )
}
