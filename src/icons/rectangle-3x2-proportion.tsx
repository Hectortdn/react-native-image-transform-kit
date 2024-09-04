import { Path, Svg } from 'react-native-svg';

interface Rectangle3x2ProportionProps {
  color?: string;
}

export function Rectangle3x2Proportion({
  color = 'white',
}: Rectangle3x2ProportionProps) {
  return (
    <Svg width={24} height={24} viewBox="0 0 40 36">
      <Path
        fill={color}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.2 2H4.8C3.033 2 1.6 3.79 1.6 6v24c0 2.21 1.433 4 3.2 4h30.4c1.767 0 3.2-1.79 3.2-4V6c0-2.21-1.433-4-3.2-4M4.8 0C2.149 0 0 2.686 0 6v24c0 3.314 2.149 6 4.8 6h30.4c2.651 0 4.8-2.686 4.8-6V6c0-3.314-2.149-6-4.8-6z"
      />
    </Svg>
  );
}
