declare module 'three/examples/jsm/postprocessing/OutputPass' {
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  export class OutputPass extends Pass {
    constructor();
  }
}

declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { WebGLRenderer } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  export class EffectComposer {
    constructor(renderer: WebGLRenderer);
    addPass(pass: Pass): void;
    render(deltaTime?: number): void;
    dispose(): void;
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Scene, Camera } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  export class RenderPass extends Pass {
    constructor(scene: Scene, camera: Camera);
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three';
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  export class UnrealBloomPass extends Pass {
    constructor(resolution: Vector2, strength: number, radius: number, threshold: number);
  }
}

declare module 'three/examples/jsm/postprocessing/ShaderPass' {
  import { Pass } from 'three/examples/jsm/postprocessing/Pass';
  import { ShaderMaterial } from 'three';
  export class ShaderPass extends Pass {
    constructor(shader: object, textureID?: string);
    uniforms: { [key: string]: { value: any } };
    material: ShaderMaterial;
  }
}

declare module 'three/examples/jsm/shaders/RGBShiftShader' {
  export const RGBShiftShader: object;
}
