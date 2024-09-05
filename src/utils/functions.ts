import type { Coords } from '../components/types';
import { RECT_EDIT_HEIGHT, RECT_EDIT_WIDTH } from './constants';

type Point = number[];
type Points = Array<Point>;

type PinchOptions = {
  toScale: number;
  fromScale: number;
  origin: Coords;
  offset: Coords;
};

function calculateRectCenter(rect: Points) {
  'worklet';
  let x = (rect[0][0] + rect[1][0] + rect[2][0] + rect[3][0]) / 4;
  let y = (rect[0][1] + rect[1][1] + rect[2][1] + rect[3][1]) / 4;
  return { x, y };
}

function calculateRectCoords({
  x = 0,
  y = 0,
  height,
  width,
}: {
  x?: number;
  y?: number;
  width: number;
  height: number;
}) {
  'worklet';
  const topLeft = [x, y];
  const topRight = [x + width, y];
  const bottomLeft = [x, y + height];
  const bottomRight = [x + width, y + height];

  return [topLeft, topRight, bottomRight, bottomLeft];
}

function rotateRectangleCorners(
  coords: Points,
  angleDegrees: number,
  center?: Coords
) {
  'worklet';

  const angleRadians = (angleDegrees * Math.PI) / 180;
  const cosAngle = Math.cos(angleRadians);
  const sinAngle = Math.sin(angleRadians);
  const c = center ?? calculateRectCenter(coords);

  return coords.map(([x, y]) => {
    const translatedX = x - c.x;
    const translatedY = y - c.y;

    const rotatedX = translatedX * cosAngle - translatedY * sinAngle;
    const rotatedY = translatedX * sinAngle + translatedY * cosAngle;

    const finalX = rotatedX + c.x;
    const finalY = rotatedY + c.y;

    return [finalX, finalY];
  });
}

function trapToRect(rectCorners: Points) {
  'worklet';

  let left = Infinity;
  let top = Infinity;
  let right = -Infinity;
  let bottom = -Infinity;

  const array = rectCorners.flat();

  for (let i = 0; i < array.length; i += 2) {
    const x = Math.round(array[i] * 10) / 10;
    const y = Math.round(array[i + 1] * 10) / 10;

    left = Math.min(left, x);
    top = Math.min(top, y);
    right = Math.max(right, x);
    bottom = Math.max(bottom, y);
  }

  return { left, top, right, bottom };
}

function isRectangleContained(rectCorns1: Points, rectCorns2: number[][]) {
  'worklet';

  const rect1 = trapToRect(rectCorns1);
  const rect2 = trapToRect(rectCorns2);

  return (
    rect1.left < rect1.right &&
    rect1.top < rect1.bottom &&
    rect1.left <= rect2.left &&
    rect1.top <= rect2.top &&
    rect1.right >= rect2.right &&
    rect1.bottom >= rect2.bottom
  );
}

function rotateIndents(indents: number[], angleDegrees: number) {
  'worklet';

  const [left, top, right, bottom] = indents;

  const corns = [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ];

  const rotated = rotateRectangleCorners(corns, angleDegrees);

  return trapToRect(rotated);
}

function getRectSidesFromCorners(corners: Points) {
  'worklet';

  const cornersFlat = corners.flat();

  const width = Math.sqrt(
    Math.pow(cornersFlat[0] - cornersFlat[2], 2) +
      Math.pow(cornersFlat[1] - cornersFlat[3], 2)
  );
  const height = Math.sqrt(
    Math.pow(cornersFlat[2] - cornersFlat[4], 2) +
      Math.pow(cornersFlat[3] - cornersFlat[5], 2)
  );

  return { width, height };
}

function calculateBoundsRotatedImage({
  angleDree,
  height,
  width,
}: {
  height: number;
  width: number;
  angleDree: number;
}) {
  'worklet';

  const rotationAngleRad = (Math.abs(angleDree) * Math.PI) / 180;

  const newWidth =
    width * Math.cos(rotationAngleRad) + height * Math.sin(rotationAngleRad);

  const newHeight =
    height * Math.cos(rotationAngleRad) + width * Math.sin(rotationAngleRad);

  return { width: newWidth, height: newHeight };
}

function rotatePoint(point: Coords, angle: number) {
  'worklet';
  const rad = angle * (Math.PI / 180);
  const cosAngle = Math.cos(rad);
  const sinAngle = Math.sin(rad);
  return {
    x: point.x * cosAngle - point.y * sinAngle,
    y: point.x * sinAngle + point.y * cosAngle,
  };
}

function calculateImageAspect(aspectRatio: number) {
  'worklet';
  let width, height;

  if (RECT_EDIT_WIDTH / RECT_EDIT_HEIGHT > aspectRatio) {
    height = RECT_EDIT_HEIGHT;
    width = height * aspectRatio;
  } else {
    width = RECT_EDIT_WIDTH;
    height = width / aspectRatio;
  }

  return { width, height };
}

function resizeImage(image: { width: number; height: number }) {
  'worklet';
  const originalAspectRatio = image.width / image.height;
  const areaAspectRatio = RECT_EDIT_WIDTH / RECT_EDIT_HEIGHT;

  let width, height;

  if (originalAspectRatio > areaAspectRatio) {
    width = RECT_EDIT_WIDTH;
    height = RECT_EDIT_WIDTH / originalAspectRatio;
  } else {
    height = RECT_EDIT_HEIGHT;
    width = RECT_EDIT_HEIGHT * originalAspectRatio;
  }

  return { width, height };
}

function calculateCurrentValue(
  scrollPosition: number,
  stepWidth: number,
  gapBetweenItems: number,
  min: number,
  max: number,
  step: number
) {
  const index = Math.round(scrollPosition / (stepWidth + gapBetweenItems));
  return Math.min(Math.max(index * step + min, min), max);
}

function pinchTransform(options: PinchOptions): Coords {
  'worklet';

  const { toScale, fromScale, origin, offset } = options;
  const scaleDiff = toScale / fromScale;

  const x = origin.x + (offset.x - origin.x) * scaleDiff;
  const y = origin.y + (offset.y - origin.y) * scaleDiff;

  return { x, y };
}

function clamp(value: number, min: number, max: number): number {
  'worklet';
  return Math.max(min, Math.min(value, max));
}

export {
  clamp,
  trapToRect,
  rotatePoint,
  resizeImage,
  rotateIndents,
  pinchTransform,
  calculateRectCenter,
  calculateRectCoords,
  isRectangleContained,
  calculateImageAspect,
  calculateCurrentValue,
  rotateRectangleCorners,
  getRectSidesFromCorners,
  calculateBoundsRotatedImage,
};
