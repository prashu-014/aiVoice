import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  useAnimations,
  useFBX,
  useGLTF,
} from "@react-three/drei";

const AvatarContent = () => {
  const avatarRef = useRef();

  // Load the avatar model (GLTF)
  const { scene } = useGLTF("public/models/6743df4d75c188cf4dfb0dff.glb");

  // Load the Idle animation (FBX)
  const fbx = useFBX("/animation/Idle.fbx");
  const idleAnimation = fbx.animations[0]; // Get the first animation

  if (!idleAnimation) {
    console.error("No animation found in the FBX file.");
    return null;
  }

  // Rename the animation for consistency
  idleAnimation.name = "Idle";

  // Hook to manage animations
  const { actions, mixer } = useAnimations([idleAnimation], avatarRef);

  // Play the Idle animation
  useEffect(() => {
    if (actions?.Idle) {
      actions.Idle.reset().play();
    }

    return () => {
      if (mixer) mixer.stopAllAction(); // Cleanup on unmount
    };
  }, [actions, mixer]);

  // Debugging the scene structure
  // useEffect(() => {
  //   scene.traverse((child) => {
  //     if (child.isMesh) {
  //       console.log("Mesh Name:", child.name);
  //     }
  //   });
  // }, [scene]);

 

  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <ambientLight intensity={0.8} />
      <primitive
        object={scene}
        scale={8}
        position={[0, -12.5, 2]}
        ref={avatarRef} 
      />
    </>
  );
};

const Avatar = () => {
  return (
    <Canvas>
      <AvatarContent />
    </Canvas>
  );
};

export default Avatar;



 // useEffect(() => {
  //   scene.traverse((child) => {
  //     if (child.isMesh && child.morphTargetDictionary) {
  //       // Check for Wolf3D_Teeth or Wolf3D_Head
  //       if (child.name === "Wolf3D_Teeth" || child.name === "Wolf3D_Head") {
  //         const visemeOIndex = child.morphTargetDictionary['viseme_O'];

  //         if (visemeOIndex !== undefined) {
  //           // Set the influence of 'viseme_O' to 1 (fully activated)
  //           child.morphTargetInfluences[visemeOIndex] = 1;

  //           console.log(`${child.name}: Set viseme_O influence to 1`);
  //         } else {
  //           console.log(`${child.name}: viseme_O not found in morphTargetDictionary`);
  //         }
  //       }
  //     }
  //   });
  // }, []);

  