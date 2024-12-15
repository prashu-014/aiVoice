import React, { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import AvatarLoading from "../AvatarLoading";

const AvatarContent = lazy(() => import("./Content"));

const Avatar = () => {
  return (
    <Suspense fallback={<AvatarLoading />}>
      <Canvas>
        <AvatarContent />
      </Canvas>
    </Suspense>
  );
};

export default Avatar;
