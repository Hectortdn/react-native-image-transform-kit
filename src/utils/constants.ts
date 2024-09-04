import { Dimensions } from 'react-native';

const screen = Dimensions.get('window');

export const RECT_EDIT_WIDTH = screen.width;
export const RECT_EDIT_HEIGHT = screen.height * 0.55;
export const RECT_ASPECT_RADIO = RECT_EDIT_WIDTH / RECT_EDIT_HEIGHT;
