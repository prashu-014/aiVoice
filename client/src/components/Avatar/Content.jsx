
import React, { useEffect, useRef, useState } from "react";
import {
  OrbitControls,
  Environment,
  useAnimations,
  useFBX,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

const AvatarContent = ({Ismouthviseme}) => {
  const avatarRef = useRef();
  const [isBlink, setIsBlink] = useState(false);
  const { scene } = useGLTF("/models/6743df4d75c188cf4dfb0dff.glb");
  const animationTime = useRef(0);
  const idleAnimation = useFBX("/animation/Idle.fbx"); 
  const { animations } = idleAnimation;
  const { actions, mixer } = useAnimations(animations, scene);

  useEffect(() => {
    if (scene && animations.length > 0) {
      scene.animations = animations; 
    }

    if (actions && actions[animations[0]?.name]) {
      actions[animations[0].name].reset().fadeIn(0.5).play(); 
    }

  }, [scene, animations, actions]);

  const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    E: "viseme_O",
    F: "viseme_U",
    G: "viseme_FF",
    H: "viseme_TH",
    X: "viseme_PP",
  };

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.name === "Wolf3D_Head" || child.name === "Wolf3D_Teeth") {
        if (child.morphTargetDictionary && child.morphTargetInfluences) {
          const visemeIndex = child.morphTargetDictionary[target];
          if (visemeIndex !== undefined) {
            child.morphTargetInfluences[visemeIndex] = MathUtils.lerp(
              child.morphTargetInfluences[visemeIndex],
              value,
              speed
            );
          } else {
            console.warn(`Morph target "${target}" not found.`);
          }
        } else {
          console.warn(`Morph targets not found on "${child.name}".`);
        }
      }
    });
  };

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      setIsBlink(true);
      setTimeout(() => setIsBlink(false), 100);
      blinkTimeout = setTimeout(nextBlink, 3000 + Math.random() * 2000);
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useFrame((_, delta) => {
    
    Object.values(corresponding).forEach((value) => {
      lerpMorphTarget(value, 0, 0.2);
    });

    if(Ismouthviseme.length > 1)
    {
    animationTime.current += delta;
  
    const mouthCue = Ismouthviseme.find(
      (cue) => animationTime.current >= cue.start && animationTime.current <= cue.end
    );
    

      if (mouthCue) {
        const viseme = corresponding[mouthCue.value];
        if (viseme) {
          lerpMorphTarget(viseme, 1, 0.2);
          console.log("work",viseme);
          
        }
      }
    }
    else {
      animationTime.current = 0;
    }

    lerpMorphTarget("eyeBlinkLeft", isBlink ? 1 : 0, 0.7);
    lerpMorphTarget("eyeBlinkRight", isBlink ? 1 : 0, 0.7);
    lerpMorphTarget("mouthSmileLeft", 0.2, 0.7);
    lerpMorphTarget("mouthSmileRight", 0.2, 0.7);   
  });

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2.05}
        maxPolarAngle={Math.PI / 2.05}
      />
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} />
      <primitive
        object={scene}
        scale={8}
        position={[0, -12, 4]}
        ref={avatarRef}
      />
    </>
  );
};

export default AvatarContent;
