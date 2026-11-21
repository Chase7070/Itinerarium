// src/components/elements/WavyText.tsx
'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface WavyTextProps {
  text: string;
  yOffset?: number;
  duration?: number;
  letterClassName?: string;
}

const WavyText: React.FC<WavyTextProps> = ({
  text,
  yOffset = 4,
  duration = 0.6,
  letterClassName = '',
}) => {
  const letters = text.split('');

  return (
    <motion.span
      initial="rest"
      whileHover="hover"
      className="inline-block cursor-default"
    >
      {letters.map((char, index) => (
        <motion.span
          key={index}
          className={`inline-block ${letterClassName}`}
          variants={{
            rest: { y: 0 },
            hover: {
              y: [0, -yOffset, 0],
              transition: {
                delay: index * 0.03,
                duration: duration,
                repeat: 0,
              },
            },
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default WavyText;
