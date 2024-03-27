export type AbsoluteSnapPoint = number;

export type PercentageSnapPoint = `${number}%`;

export type ContentSnapPoint = 'content';

export type SnapPoint =
  | AbsoluteSnapPoint
  | PercentageSnapPoint
  | ContentSnapPoint;
