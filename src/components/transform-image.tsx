/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext } from 'react';
import {
  Easing,
  withTiming,
  useSharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import {
  trapToRect,
  rotatePoint,
  resizeImage,
  calculateRectCenter,
  calculateRectCoords,
  calculateImageAspect,
  isRectangleContained,
  rotateRectangleCorners,
  getRectSidesFromCorners,
  getIntrinsicImageDimensions,
  calculateBoundsRotatedImage,
} from '../utils/functions';

import { type TranFormImageProps, type TranFormImageContext } from './types';

import { RECT_EDIT_HEIGHT, RECT_EDIT_WIDTH } from '../utils/constants';

const Context = createContext<TranFormImageContext>({} as TranFormImageContext);

export function TranFormImage({
  children,
  imageWidth = 0,
  imageHeight = 0,
}: TranFormImageProps) {
  const showGrid = useSharedValue<boolean>(false);

  const cropTranslate = useSharedValue({ x: 0, y: 0 });
  const cropBounds = useSharedValue({
    width: RECT_EDIT_WIDTH,
    height: RECT_EDIT_HEIGHT,
  });

  const imageScale = useSharedValue(1);
  const imageAngleDree = useSharedValue(0);
  const imageTranslate = useSharedValue({ x: 0, y: 0 });
  const baseImage = useSharedValue(
    resizeImage({ height: imageHeight, width: imageWidth })
  );

  function postTranslate(translate: { x: number; y: number }) {
    'worklet';
    imageTranslate.value = translate;
  }

  function postScale(newScale: number) {
    'worklet';
    imageScale.value = newScale;
  }

  function postRotate(newAngle: number) {
    'worklet';
    imageAngleDree.value = newAngle;
  }

  const retrieveCurrentImageMetadata = React.useCallback(() => {
    'worklet';
    const scale = imageScale.value;
    const dimensions = baseImage.value;
    const coord = imageTranslate.value;
    const angleDree = imageAngleDree.value;

    const width = dimensions.width * scale;
    const height = dimensions.height * scale;

    return { coord, angleDree, width, height, scale };
  }, [
    baseImage.value,
    imageScale.value,
    imageAngleDree.value,
    imageTranslate.value,
  ]);

  const retrieveCurrentCropMetadata = React.useCallback(() => {
    'worklet';
    const { height, width } = cropBounds.value;
    const coord = cropTranslate.value;

    return { height, width, coord };
  }, [cropBounds.value, cropTranslate.value]);

  const getCurrentImageCorners = React.useCallback(() => {
    'worklet';
    const cropMetadata = retrieveCurrentCropMetadata();
    const currentImage = retrieveCurrentImageMetadata();

    let deltaX =
      currentImage.coord.x -
      (currentImage.width - cropMetadata.width) / 2 +
      cropMetadata.coord.x;
    let deltaY =
      currentImage.coord.y -
      (currentImage.height - cropMetadata.height) / 2 +
      cropMetadata.coord.y;

    let corners = calculateRectCoords({
      x: deltaX,
      y: deltaY,
      width: currentImage.width,
      height: currentImage.height,
    });

    if (currentImage.angleDree !== 0) {
      return rotateRectangleCorners(corners, currentImage.angleDree);
    }

    return corners;
  }, [retrieveCurrentCropMetadata, retrieveCurrentImageMetadata]);

  const getCropBoundsCorners = React.useCallback(() => {
    'worklet';
    const { coord, height, width } = retrieveCurrentCropMetadata();
    return calculateRectCoords({ height, width, ...coord });
  }, [retrieveCurrentCropMetadata]);

  const calculateImageIndents = React.useCallback(
    (deltaScale: number) => {
      'worklet';
      const baseImageDimensions = baseImage.value;
      const cropMetadata = retrieveCurrentCropMetadata();
      const currentImage = retrieveCurrentImageMetadata();

      const cropLimits = calculateBoundsRotatedImage({
        width: cropMetadata.width,
        height: cropMetadata.height,
        angleDree: currentImage.angleDree,
      });

      const newScale = Math.max(deltaScale, 0) + currentImage.scale;

      const currentWidth = baseImageDimensions.width * newScale;
      const currentHeight = baseImageDimensions.height * newScale;

      const maxX = (currentWidth - cropLimits.width) / 2;
      const maxY = (currentHeight - cropLimits.height) / 2;

      const rotated = rotatePoint(currentImage.coord, -currentImage.angleDree);

      let safePoint = {
        x: Math.max(-maxX, Math.min(rotated.x, maxX)),
        y: Math.max(-maxY, Math.min(rotated.y, maxY)),
      };

      const safePointRotated = rotatePoint(safePoint, currentImage.angleDree);

      return { deltaX: safePointRotated.x, deltaY: safePointRotated.y };
    },
    [baseImage.value, retrieveCurrentCropMetadata, retrieveCurrentImageMetadata]
  );

  const isImageWrapCropBounds = React.useCallback(
    (imageCorners: Array<number[]>) => {
      'worklet';
      const inverseAngle = -imageAngleDree.value;
      const cropBoundsCorners = getCropBoundsCorners();
      const center = calculateRectCenter(imageCorners);

      const tempImageCorners = rotateRectangleCorners(
        imageCorners,
        inverseAngle
      );
      const tempCropCorners = rotateRectangleCorners(
        cropBoundsCorners,
        inverseAngle,
        center
      );

      return isRectangleContained(tempImageCorners, tempCropCorners);
    },
    [getCropBoundsCorners, imageAngleDree.value]
  );

  const wrapCropBoundsRunnable = React.useCallback(
    (props: {
      deltaX: number;
      deltaY: number;
      deltaScale: number;
      needScaleUpdate: boolean;
    }) => {
      'worklet';

      const { deltaScale, deltaX, deltaY, needScaleUpdate } = props;

      imageTranslate.value = withTiming(
        { x: deltaX, y: deltaY },
        { easing: Easing.inOut(Easing.cubic) }
      );

      if (needScaleUpdate) {
        imageScale.value = withTiming(imageScale.value + deltaScale, {
          easing: Easing.inOut(Easing.cubic),
        });
      }
    },
    [imageScale, imageTranslate]
  );

  const setImageToWrapCropBounds = React.useCallback(
    (animated = true) => {
      'worklet';
      const imageCorners = getCurrentImageCorners();

      if (!isImageWrapCropBounds(imageCorners)) {
        const cropMetadata = retrieveCurrentCropMetadata();
        const { angleDree, scale } = retrieveCurrentImageMetadata();
        const currentImageSides = getRectSidesFromCorners(imageCorners);

        const cropRotated = calculateBoundsRotatedImage({
          angleDree: angleDree,
          width: cropMetadata.width,
          height: cropMetadata.height,
        });

        const widthScale = cropRotated.width / currentImageSides.width;
        const heightScale = cropRotated.height / currentImageSides.height;
        const maxScale = Math.max(widthScale, heightScale);

        const deltaScale = (maxScale - 1) * scale;
        const { deltaX, deltaY } = calculateImageIndents(deltaScale);

        const needScaleUpdate = scale < scale + deltaScale;

        if (animated) {
          wrapCropBoundsRunnable({
            deltaX,
            deltaY,
            deltaScale,
            needScaleUpdate,
          });
        } else {
          postTranslate({ x: deltaX, y: deltaY });

          if (needScaleUpdate) {
            postScale(scale + deltaScale);
          }
        }
      }
    },
    [
      postScale,
      postTranslate,
      isImageWrapCropBounds,
      calculateImageIndents,
      wrapCropBoundsRunnable,
      getCurrentImageCorners,
      retrieveCurrentCropMetadata,
      retrieveCurrentImageMetadata,
    ]
  );

  const setCropBoundsAspectRatio = (aspectRadio: number) => {
    'worklet';
    cropBounds.value = calculateImageAspect(aspectRadio);
    setImageToWrapCropBounds();
  };

  const cropImage = React.useCallback(() => {
    const imageCorners = getCurrentImageCorners();
    const cropMetadata = retrieveCurrentCropMetadata();
    const image = trapToRect(imageCorners);

    const boundsImage = calculateBoundsRotatedImage({
      angleDree: imageAngleDree.value,
      width: imageWidth,
      height: imageHeight,
    });

    const imageDimensions = {
      height: image.bottom - image.top,
      width: image.right - image.left,
    };

    const translateCrop = {
      x: cropTranslate.value.x - image.left,
      y: cropTranslate.value.y - image.top,
    };

    const crop = {
      originX: (boundsImage.width * translateCrop.x) / imageDimensions.width,
      originY: (boundsImage.height * translateCrop.y) / imageDimensions.height,
      width: Math.floor(
        (boundsImage.width * cropMetadata.width) / imageDimensions.width
      ),
      height: Math.floor(
        (boundsImage.height * cropMetadata.height) / imageDimensions.height
      ),
    };

    return { rotate: imageAngleDree.value, crop };
  }, [
    trapToRect,
    imageWidth,
    imageHeight,
    imageAngleDree,
    getCurrentImageCorners,
    retrieveCurrentCropMetadata,
    getIntrinsicImageDimensions,
    calculateBoundsRotatedImage,
  ]);

  useAnimatedReaction(
    () => baseImage.value,
    (value, prev) => {
      if (
        prev &&
        (value.width !== prev.width || value.height !== prev.height)
      ) {
        setImageToWrapCropBounds(false);
      }
    },
    [baseImage.value]
  );

  useAnimatedReaction(
    () => cropBounds.value,
    (value, prev) => {
      if (value.width !== 0 || value.height !== prev?.width) {
        setImageToWrapCropBounds();
      }
    },
    [cropBounds.value]
  );

  return (
    <Context.Provider
      value={{
        showGrid,
        baseImage,
        postScale,
        cropImage,
        postRotate,
        imageScale,
        cropBounds,
        cropTranslate,
        postTranslate,
        imageAngleDree,
        imageTranslate,
        setCropBoundsAspectRatio,
        setImageToWrapCropBounds,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useTransformImage() {
  try {
    const context = useContext(Context);
    return context;
  } catch (error) {
    throw new Error('');
  }
}
