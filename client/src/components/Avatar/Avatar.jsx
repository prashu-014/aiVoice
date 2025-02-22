import React, { Suspense, lazy } from "react";
import { Canvas } from "@react-three/fiber";
import AvatarLoading from "../AvatarLoading";

const AvatarContent = lazy(() => import("./Content"));

const Avatar = ({ Ismouthviseme, stopSpeechToText}) => {
  return (
    <Suspense fallback={<AvatarLoading />}>
      <Canvas style={{
        position: "absolute", 
        top: "0",         
        left: "0",       
        width: "100%",
        height: "100%",  
        zIndex: "1",
        pointerEvents:'none'
      }}
        camera={{ position: [-0.5, 1, 10], fov: 45 }}>
        <AvatarContent Ismouthviseme={Ismouthviseme} stopSpeechToText={stopSpeechToText}/>
      </Canvas>
    </Suspense>
  );
};

export default Avatar;

