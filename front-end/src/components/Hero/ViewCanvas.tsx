import { Canvas } from '@react-three/fiber'
import {  View } from '@react-three/drei'
import { Suspense } from 'react'

type Props = {}

export default function ViewCanvas({}: Props) {
  return (
    <div id='canvas-container'>
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 30
        }}
        camera={{
          position: [0, 0, 5],
          fov: 30
        }}
        shadows={true}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={1} />
        <pointLight position={[1, 1, 1]} />

        <Suspense fallback={null}>
          <View.Port />
        </Suspense>
      </Canvas>
    </div>
  )
}
