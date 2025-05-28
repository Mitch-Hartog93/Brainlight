import React from 'react';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface BrainlightLogoProps {
  size?: number;
  color?: string;
}

export default function BrainlightLogo({ size = 160, color = '#6366F1' }: BrainlightLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 1000 1000">
      <G transform="translate(100, 100) scale(0.8)">
        {/* Brain shape */}
        <Path
          d="M500 100C350 100 200 250 200 450C200 550 250 600 300 650C200 700 150 800 150 900C150 1050 300 1200 500 1200C700 1200 850 1050 850 900C850 800 800 700 700 650C750 600 800 550 800 450C800 250 650 100 500 100Z"
          fill={color}
          opacity={0.9}
        />
        
        {/* Light rays */}
        <G opacity={0.7}>
          <Path
            d="M500 50L500 150"
            stroke={color}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <Path
            d="M350 100L400 180"
            stroke={color}
            strokeWidth="30"
            strokeLinecap="round"
          />
          <Path
            d="M650 100L600 180"
            stroke={color}
            strokeWidth="30"
            strokeLinecap="round"
          />
        </G>
        
        {/* Neural connections */}
        <Circle cx="400" cy="400" r="20" fill={color} opacity={0.8} />
        <Circle cx="600" cy="400" r="20" fill={color} opacity={0.8} />
        <Circle cx="500" cy="600" r="20" fill={color} opacity={0.8} />
        
        <Path
          d="M400 400C450 450 550 450 600 400"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        <Path
          d="M400 400C450 500 500 550 500 600"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
        <Path
          d="M600 400C550 500 500 550 500 600"
          stroke={color}
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
      </G>
    </Svg>
  );
}