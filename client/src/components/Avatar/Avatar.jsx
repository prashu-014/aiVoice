import React from "react";
import { Canvas } from "@react-three/fiber";
import AvatarContent from "./Content";

const Avatar = () => {
  return (
    <Canvas>
      <AvatarContent />
    </Canvas>
  );
};

export default Avatar;
