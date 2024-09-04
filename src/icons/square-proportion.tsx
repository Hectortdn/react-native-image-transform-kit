import { Path, Svg } from 'react-native-svg';
interface SquareProportionProps {
  color?: string;
}

export function SquareProportion({ color = 'white' }: SquareProportionProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 36 36" fill="none">
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 2H6a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h24a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4M6 0a6 6 0 0 0-6 6v24a6 6 0 0 0 6 6h24a6 6 0 0 0 6-6V6a6 6 0 0 0-6-6z"
      />
    </Svg>
  );
}
