/* eslint-disable @typescript-eslint/no-explicit-any */
import { Center, Float, Sparkles, useGLTF } from '@react-three/drei'
import { forwardRef } from 'react'
import * as THREE from 'three'

useGLTF.preload('/scene.gltf')

type Props = {
  scale?: number
  position?: [number, number, number]
  floatSpeed?: number
  floatIntensity?: number
  rotationIntensity?: number
  floatingRange?: [number, number]
}

const Computer = forwardRef<THREE.Group, Props>(
  (
    {
      rotationIntensity = 0,
      floatSpeed = 3,
      floatIntensity = 1,
      floatingRange = [-0.1, 0.1],
      scale,
      position = [0, 0, 0],
      ...props
    },
    ref
  ) => {
    /* const textures = useTexture({
    map: '/textures/retro_computer_setup_Mat_baseColor.png',
    alphaMap: '/textures/retro_computer_setup_Mat_specularf0.png',
    normalMap: '/textures/retro_computer_setup_Mat_normal.png',
    roughnessMap: '/textures/retro_computer_setup_Mat_metallicRoughness.png',
    emissiveMap: '/textures/retro_computer_setup_Mat_emissive.png'
  }) */

    const { nodes, materials } = useGLTF('/scene.gltf')

    const geometry = nodes.retro_computer_setup_retro_computer_setup_Mat_0 as any

    const material = materials.retro_computer_setup_Mat as any

    return (
      <group ref={ref} scale={scale} {...props} dispose={null} rotation={[-Math.PI / 2, 0, Math.PI / 18]}>
        <Center position={position}>
          <Float
            speed={floatSpeed} // Animation speed, defaults to 1
            rotationIntensity={rotationIntensity} // XYZ rotation intensity, defaults to 1
            floatingRange={floatingRange} // Up/down floating range, defaults to [0, 0]
            floatIntensity={floatIntensity} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
          >
            <mesh castShadow receiveShadow geometry={geometry.geometry} material={material}></mesh>
          </Float>
          <Sparkles color='white' speed={0.4} size={6} count={50} scale={50 * 2} position={[-10, 0, 30]} />
        </Center>
      </group>
    )
  }
)

Computer.displayName = 'Computer'

export default Computer
