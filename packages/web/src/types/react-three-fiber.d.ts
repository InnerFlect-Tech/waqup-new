/**
 * Extends JSX.IntrinsicElements with React Three Fiber's Three.js elements
 * (mesh, sphereGeometry, shaderMaterial, etc.)
 */
import type { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}
