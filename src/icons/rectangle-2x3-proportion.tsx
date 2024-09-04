import { Path, Svg } from 'react-native-svg';

interface Rectangle2x3ProportionProps {
  color?: string;
}

export function Rectangle2x3Proportion({
  color = 'white',
}: Rectangle2x3ProportionProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 36 40">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M30 1.6H6c-2.21 0-4 1.433-4 3.2v30.4c0 1.767 1.79 3.2 4 3.2h24c2.21 0 4-1.433 4-3.2V4.8c0-1.767-1.79-3.2-4-3.2M6 0C2.686 0 0 2.149 0 4.8v30.4C0 37.851 2.686 40 6 40h24c3.314 0 6-2.149 6-4.8V4.8C36 2.149 33.314 0 30 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}
