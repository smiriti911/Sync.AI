import React from "react";

export default function GradientBackground() {
  return (
    <>
      {/* Dark background layer */}
      <div className="absolute inset-0 z-[-10]" />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5 z-[-10]"
        style={{
          backgroundImage: "url('/noise.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </>
  );
}
