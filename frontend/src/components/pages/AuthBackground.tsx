'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type AuthBackgroundProps = {
  children: React.ReactNode
}

// generate random positions for decorative icons
const generateEvenlyDistributedPositions = (count: number, iconType: string) => {
  const positions = [];
  const iconSizes = {
    compass: { width: 64, height: 64 },
    plane: { width: 80, height: 80 },
    suitcase: { width: 72, height: 72 },
    map: { width: 90, height: 90 }
  };

  const size = iconSizes[iconType as keyof typeof iconSizes];
  const gridSize = Math.ceil(Math.sqrt(count));
  const cellWidth = 100 / gridSize;
  const cellHeight = 100 / gridSize;
  const cells = [];

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      cells.push({ row: i, col: j });
    }
  }

  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }

  for (let i = 0; i < Math.min(count, cells.length); i++) {
    const cell = cells[i];
    const topOffset = cell.row * cellHeight + (Math.random() * 0.6 + 0.2) * cellHeight;
    const leftOffset = cell.col * cellWidth + (Math.random() * 0.6 + 0.2) * cellWidth;
    const top = Math.max(10, Math.min(90, topOffset));
    const left = Math.max(10, Math.min(90, leftOffset));

    positions.push({
      top: `${top}%`,
      left: `${left}%`,
      rotate: `${Math.random() * 60 - 30}deg`,
      size: {
        width: size.width * (0.7 + Math.random() * 0.6),
        height: size.height * (0.7 + Math.random() * 0.6)
      },
      delay: `${Math.random() * 5}s`,
      duration: `${7 + Math.random() * 6}s`
    });
  }

  return positions;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const [compassPositions] = useState(() => generateEvenlyDistributedPositions(4, 'compass'));
  const [planePositions] = useState(() => generateEvenlyDistributedPositions(3, 'plane'));
  const [suitcasePositions] = useState(() => generateEvenlyDistributedPositions(3, 'suitcase'));
  const [mapPositions] = useState(() => generateEvenlyDistributedPositions(4, 'map'));

  useEffect(() => {
    setMounted(true)
  }, [])

  const generateDecorativeElements = () => {
    return (
      <>
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: "url('/assets/backgrounds/world-map-dots.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "contrast(1.2)"
            }}
          />
        </div>

        <div className="absolute top-10 left-10 opacity-30">
          <Image src="/assets/icons/compass.svg" alt="Compass icon" width={64} height={64} unoptimized />
        </div>

        <div className="absolute top-20 right-20 opacity-30">
          <Image src="/assets/icons/plane.svg" alt="Plane icon" width={80} height={80} unoptimized />
        </div>

        <div className="absolute bottom-16 left-20 opacity-30">
          <Image src="/assets/icons/suitcase.svg" alt="Suitcase icon" width={72} height={72} unoptimized />
        </div>

        <div className="absolute bottom-24 right-16 opacity-30">
          <Image src="/assets/icons/map.svg" alt="Map icon" width={90} height={90} unoptimized />
        </div>

        {compassPositions.map((pos, index) => (
          <div key={`compass-${index}`} className={`absolute opacity-0 ${mounted ? 'animate-custom-float opacity-20' : ''}`}
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate})`,
              animationDelay: pos.delay,
              animationDuration: pos.duration
            }}>
            <Image src="/assets/icons/compass.svg" alt="" width={pos.size.width} height={pos.size.height} unoptimized />
          </div>
        ))}

        {planePositions.map((pos, index) => (
          <div key={`plane-${index}`} className={`absolute opacity-0 ${mounted ? 'animate-custom-float opacity-20' : ''}`}
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate})`,
              animationDelay: pos.delay,
              animationDuration: pos.duration
            }}>
            <Image src="/assets/icons/plane.svg" alt="" width={pos.size.width} height={pos.size.height} unoptimized />
          </div>
        ))}

        {suitcasePositions.map((pos, index) => (
          <div key={`suitcase-${index}`} className={`absolute opacity-0 ${mounted ? 'animate-custom-float opacity-20' : ''}`}
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate})`,
              animationDelay: pos.delay,
              animationDuration: pos.duration
            }}>
            <Image src="/assets/icons/suitcase.svg" alt="" width={pos.size.width} height={pos.size.height} unoptimized />
          </div>
        ))}

        {mapPositions.map((pos, index) => (
          <div key={`map-${index}`} className={`absolute opacity-0 ${mounted ? 'animate-custom-float opacity-20' : ''}`}
            style={{
              top: pos.top,
              left: pos.left,
              transform: `rotate(${pos.rotate})`,
              animationDelay: pos.delay,
              animationDuration: pos.duration
            }}>
            <Image src="/assets/icons/map.svg" alt="" width={pos.size.width} height={pos.size.height} unoptimized />
          </div>
        ))}

        {/* floating glow background remains unchanged */}
        {/* <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-custom-float" style={{ animationDuration: '12s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-custom-float animation-delay-2000" style={{ animationDuration: '15s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-custom-float animation-delay-4000" style={{ animationDuration: '18s' }}></div> */}
      </>
    )
  }

  return (
    <div className="relative h-screen bg-gray-0 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
      {/* background decorative layer (absolute positioning, does not affect content) */}
      {mounted && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {generateDecorativeElements()}
        </div>
      )}

      {/* form content layer */}
      <div className="z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  )
}