import { type SharedValue } from 'react-native-reanimated';
export interface RectDimensions {
  width: number;
  height: number;
}

export interface ManipulateImage {
  rotate: number;
  crop: { originX: number; originY: number } & RectDimensions;
}

export interface TranFormImageProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  children: React.ReactNode;
}

export interface TranFormImageContext {
  showGrid: SharedValue<boolean>;
  imageScale: SharedValue<number>;
  imageAngleDree: SharedValue<number>;
  baseImage: SharedValue<RectDimensions>;
  cropBounds: SharedValue<RectDimensions>;
  cropTranslate: SharedValue<{ x: number; y: number }>;
  imageTranslate: SharedValue<{ x: number; y: number }>;

  cropImage: () => ManipulateImage;
  postScale: (newScale: number) => void;
  postRotate: (newRotate: number) => void;
  setImageToWrapCropBounds: (animate: boolean) => void;
  setCropBoundsAspectRatio: (aspectRadio: number) => void;
  postTranslate: (translate: { x: number; y: number }) => void;
}
