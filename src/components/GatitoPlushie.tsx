import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GatitoPlushie(props: any) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF('/models/Gatito Plushie.glb') as any;
  const { actions } = useAnimations(animations, group);

  // Intentar identificar el hueso de la cabeza. 
  // En el código original se listaban Bone, Bone006, Bone007, Bone010.
  // Bone014 identificado por el usuario como la cabeza.
  
  useFrame((state) => {
    // Verificar si el hueso existe antes de intentar rotarlo
    const headBone = nodes.Bone014; 

    if (headBone) {
      // Obtener posición del mouse (normalizada de -1 a 1)
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;

      // Suavizar la rotación (Lerp)
      // Ajustamos la intensidad de la rotación dividiendo por números (ej. / 5)
      // Los ejes pueden variar dependiendo de cómo fue exportado el modelo (Y-up vs Z-up en Blender)
      // Generalmente Y es rotación izquierda/derecha, y X es arriba/abajo en Three.js
      
      const targetRotationY = mouseX * 0.5; // Rango de rotación horizontal
      const targetRotationX = mouseY * 0.5; // Rango de rotación vertical

      headBone.rotation.y = THREE.MathUtils.lerp(headBone.rotation.y, targetRotationY, 0.1);
      headBone.rotation.z = THREE.MathUtils.lerp(headBone.rotation.z, targetRotationX, 0.1);
      
      // Si el eje de rotación es distinto (ej. Z), se puede probar:
      // headBone.rotation.z = THREE.MathUtils.lerp(headBone.rotation.z, targetRotationProperties, 0.1);
    }
  });

  useEffect(() => {
    // Reproducir animación si existe alguna por defecto, opcional
    // if (actions['nombre_animacion']) actions['nombre_animacion'].play();
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature001" position={[-0.101, 0.055, -0.015]}>
          <group name="Cube002">
            <skinnedMesh
              name="Cube002_1"
              geometry={nodes.Cube002_1.geometry}
              material={materials['Material.001']}
              skeleton={nodes.Cube002_1.skeleton}
            />
            <skinnedMesh
              name="Cube002_2"
              geometry={nodes.Cube002_2.geometry}
              material={materials.Material}
              skeleton={nodes.Cube002_2.skeleton}
            />
            <skinnedMesh
              name="Cube002_3"
              geometry={nodes.Cube002_3.geometry}
              material={materials['Ojitosrig-001']}
              skeleton={nodes.Cube002_3.skeleton}
            />
          </group>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone006} />
          <primitive object={nodes.Bone007} />
          <primitive object={nodes.Bone010} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/Gatito Plushie.glb');

export default GatitoPlushie;
