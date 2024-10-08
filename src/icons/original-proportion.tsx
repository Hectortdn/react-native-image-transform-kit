import { Path, Svg } from 'react-native-svg';

interface OriginalProportionProps {
  color?: string;
}

export function OriginalProportion({
  color = 'white',
}: OriginalProportionProps) {
  return (
    <Svg width={24} height={24} fill="none" viewBox="0 0 36 36">
      <Path
        fill={color}
        d="M8.47 0a6.353 6.353 0 0 0-6.352 6.353v7.412a1.059 1.059 0 0 0 2.117 0V6.353a4.235 4.235 0 0 1 4.236-4.235h7.411a1.059 1.059 0 0 0 0-2.118zm13.765 0a1.059 1.059 0 0 0 0 2.118h7.412a4.235 4.235 0 0 1 4.235 4.235v7.412a1.059 1.059 0 1 0 2.118 0V6.353A6.353 6.353 0 0 0 29.647 0zM36 20.118a1.06 1.06 0 0 0-2.118 0v7.411a4.236 4.236 0 0 1-4.235 4.236h-7.412a1.06 1.06 0 0 0 0 2.117h7.412A6.353 6.353 0 0 0 36 27.53zM0 22.235a5.294 5.294 0 0 1 5.294-5.294h8.47a5.294 5.294 0 0 1 5.295 5.294v8.47c0 1.08-.322 2.083-.877 2.921l-6.408-6.406a3.18 3.18 0 0 0-4.494 0L.875 33.626A5.3 5.3 0 0 1 0 30.706zm14.824.53a1.588 1.588 0 1 0-3.176 0 1.588 1.588 0 0 0 3.175 0M2.374 35.123a5.27 5.27 0 0 0 2.92.877h8.47c1.08 0 2.082-.322 2.92-.877l-6.405-6.408a1.06 1.06 0 0 0-1.5 0z"
      />
    </Svg>
  );
}
