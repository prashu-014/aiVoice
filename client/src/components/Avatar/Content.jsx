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

const AvatarContent = ({ IsmouthChar, stopSpeechToText }) => {
  const avatarRef = useRef();
  const [isBlink, setIsBlink] = useState(false);

  const { scene } = useGLTF("/models/6743df4d75c188cf4dfb0dff.glb");
  const fbx = useFBX("/animation/Idle.fbx");

  const idleAnimation = fbx.animations[0];
  if (!idleAnimation) {
    console.error("No animation found in the FBX file.");
    return null;
  }
  idleAnimation.name = "Idle";

  const { actions, mixer } = useAnimations([idleAnimation], avatarRef);

  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.reset().play();
    }

    return () => {
      if (mixer) mixer.stopAllAction();
    };
  }, [actions, mixer]);

  const corresponding = {
    A: "viseme_PP",
    B: "viseme_kk",
    C: "viseme_I",
    D: "viseme_AA",
    E: "viseme_0",
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

  useFrame(() => {
    lerpMorphTarget("eyeBlinkLeft", isBlink ? 1 : 0, 0.7);
    lerpMorphTarget("eyeBlinkRight", isBlink ? 1 : 0, 0.7);

    lerpMorphTarget("mouthSmileLeft", 0.2, 0.7);
    lerpMorphTarget("mouthSmileRight", 0.2, 0.7);
  });

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      setIsBlink(true);
      setTimeout(() => {
        setIsBlink(false);
      }, 100);
      blinkTimeout = setTimeout(nextBlink, 3000 + Math.random() * 2000); // Randomize next blink
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

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
