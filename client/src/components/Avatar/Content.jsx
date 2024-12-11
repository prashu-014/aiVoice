import React, { useEffect, useRef } from "react";
import { OrbitControls, Environment, useAnimations, useFBX, useGLTF } from "@react-three/drei";

const AvatarContent = () => {
  const avatarRef = useRef();

  
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

  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} />
      <primitive object={scene} scale={8} position={[0, -12.5, 2]} ref={avatarRef} />
    </>
  );
};

export default AvatarContent;
