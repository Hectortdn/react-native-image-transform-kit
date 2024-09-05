import type { ImageStyle } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';

export type Dimensions = {
  width: number;
  height: number;
};

export type Coords = {
  x: number;
  y: number;
};

export interface ManipulateImage {
  rotate: number;
  crop: { originX: number; originY: number } & Dimensions;
}

export interface TranFormImageProps {
  imageUri: string;
  imageWidth: number;
  imageHeight: number;
  children: React.ReactNode;
}

export type ImageData = { coord: Coords; center: Coords } & Dimensions;

export interface TranFormImageContext {
  showGrid: SharedValue<boolean>;
  imageScale: SharedValue<number>;
  baseImage: SharedValue<ImageData>;
  imageAngleDree: SharedValue<number>;
  cropBounds: SharedValue<Dimensions>;
  cropTranslate: SharedValue<Coords>;
  imageTranslate: SharedValue<Coords>;

  cropImage: () => ManipulateImage;
  postScale: (newScale: number) => void;
  postRotate: (newRotate: number) => void;
  setImageToWrapCropBounds: (animate: boolean) => void;
  setCropBoundsAspectRatio: (aspectRadio: number) => void;
  postTranslate: (translate: Coords) => void;
  retrieveCurrentCropMetadata(): { coord: Coords } & Dimensions;
  retrieveCurrentImageMetadata(): {
    coord: Coords;
    scale: number;
    angleDree: number;
  } & Dimensions;
}

export interface TransformImageViewProps extends Dimensions {
  imageUri: string;
  style?: ImageStyle;
}
export interface TransformImageViewRefProps {
  getCurrentScale: () => number;
  getCurrentAngle: () => number;
  currentImageCorners: number[];
  currentImageCenter: number[];
  postTranslate: (deltaX: number, deltaY: number) => void;
  postScale: (deltaScale: number, px: number, py: number) => void;
  postRotate: (deltaAngle: number, px: number, py: number) => void;
}

export interface TransformerHeaderProps {
  onCancel: () => void;
  onConclude: (imageUriEdited: string) => void;
  onManipulate?: (manipulate: ManipulateImage) => Promise<{ uri: string }>;
}
