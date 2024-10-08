import { Environment } from '@react-three/drei'
import Floating3DText from './Floating3DText'
import Computer from './Computer'
import { Group } from 'three'
import { useEffect, useRef } from 'react'
import { useStore } from '../../hooks/useStore'

export default function Scene() {
  const computerRef = useRef<Group>(null)
  const floating3DTextRef = useRef<Group>(null)

  const isReady = useStore((state) => state.isReady)

  useEffect(() => {
    if (computerRef.current && floating3DTextRef.current) {
      isReady()
    }
  }, [computerRef, floating3DTextRef, isReady])

  return (
    <group>
      <ambientLight intensity={0.5} />
      <Environment files={['/hdrs/field.hdr']} environmentIntensity={1.5} backgroundIntensity={1} />

      <group ref={floating3DTextRef}>
        <Floating3DText
          text='Hello, world!'
          position={[0, 1, 0]}
          size={0.4}
          floatSpeed={3}
          floatingRange={[-0.1, 0.1]}
          floatIntensity={1}
          rotationIntensity={0}
        />
      </group>

      <Computer
        ref={computerRef}
        scale={0.02}
        position={[50, -40, -15]}
        floatIntensity={0}
        floatingRange={[-10, 10]}
        floatSpeed={3}
        rotationIntensity={0}
      />
    </group>
  )
}
