import React from "react";

export const SelectArrow = () => {
  return (
    <>
      <svg
        className="absolute w-[100px] max-w-full -top-2 -z-10"
        width={100}
        height={10}
        x="0px"
        y="0px"
        viewBox="0 0 60 6"
        style={{
          filter: "drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.16))",
        }}
      >
        <path fill="white" d="M60,6L30,0L0,6h1.1H60z" />
      </svg>
      <svg
        className="absolute w-[100px] max-w-full -top-2 z-20"
        width={100}
        height={10}
        x="0px"
        y="0px"
        viewBox="0 0 60 6"
      >
        <path fill="white" d="M60,6L30,0L0,6h1.1H60z" />
      </svg>
    </>
  );
};
