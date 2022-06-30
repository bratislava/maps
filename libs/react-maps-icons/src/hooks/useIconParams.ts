import { useState, useEffect } from "react";
import {
  DEFAULT_STROKE_SIZE,
  DIRECTIONS_STYLES,
  Direction,
  IconSize,
  SIZES,
} from "../types";

export const useIconParams = (inputSize: IconSize, direction: Direction) => {
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [size, setSize] = useState(0);
  const [style, setStyle] = useState<{
    transform: string;
  }>({
    transform: "rotate(0)",
  });

  useEffect(() => {
    setStrokeWidth((DEFAULT_STROKE_SIZE * SIZES.default) / SIZES[inputSize]);
    setSize(SIZES[inputSize]);
    setStyle(DIRECTIONS_STYLES[direction]);
  }, [inputSize, direction]);

  return {
    size,
    strokeWidth,
    style,
  };
};
