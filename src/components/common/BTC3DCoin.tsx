'use client'

import { JSX, useRef, useState, useEffect } from 'react'

interface BTC3DCoinProps {
  size?: number
  className?: string
}

export default function BTC3DCoin({
  size = 200,
  className = '',
}: BTC3DCoinProps): JSX.Element {
  const coinRef = useRef<HTMLDivElement>(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isInteracting, setIsInteracting] = useState(false)
  const autoRotateRef = useRef<number>()

  useEffect(() => {
    // Auto-rotation state
    let angle = 0
    let isAutoRotating = true

    const handleMouseMove = (e: MouseEvent) => {
      if (!coinRef.current) return

      isAutoRotating = false
      setIsInteracting(true)
      const rect = coinRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      const maxRotation = 30
      const rotationX = (deltaY / rect.height) * maxRotation
      const rotationY = (deltaX / rect.width) * maxRotation

      setRotation({ x: rotationX, y: rotationY })
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!coinRef.current || e.touches.length === 0) return

      isAutoRotating = false
      setIsInteracting(true)
      const rect = coinRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const touch = e.touches[0]
      const deltaX = touch.clientX - centerX
      const deltaY = touch.clientY - centerY

      const maxRotation = 30
      const rotationX = (deltaY / rect.height) * maxRotation
      const rotationY = (deltaX / rect.width) * maxRotation

      setRotation({ x: rotationX, y: rotationY })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      setIsInteracting(false)
      isAutoRotating = true
      angle = 0
      setRotation({ x: 0, y: 0 })
    }

    const handleTouchEnd = () => {
      setIsInteracting(false)
      isAutoRotating = true
      angle = 0
      setRotation({ x: 0, y: 0 })
    }

    // Auto-rotation when not interacting
    const rotate = () => {
      if (isAutoRotating && !isInteracting) {
        angle += 0.3
        setRotation({
          x: Math.sin(angle * 0.01) * 8,
          y: angle * 0.3,
        })
      }
      autoRotateRef.current = requestAnimationFrame(rotate)
    }
    rotate()

    const coin = coinRef.current
    if (coin) {
      coin.addEventListener('mousemove', handleMouseMove)
      coin.addEventListener('mouseenter', () => setIsHovered(true))
      coin.addEventListener('mouseleave', handleMouseLeave)
      coin.addEventListener('touchmove', handleTouchMove, { passive: true })
      coin.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      if (coin) {
        coin.removeEventListener('mousemove', handleMouseMove)
        coin.removeEventListener('mouseenter', () => setIsHovered(true))
        coin.removeEventListener('mouseleave', handleMouseLeave)
        coin.removeEventListener('touchmove', handleTouchMove)
        coin.removeEventListener('touchend', handleTouchEnd)
      }
      if (autoRotateRef.current) {
        cancelAnimationFrame(autoRotateRef.current)
      }
    }
  }, [isInteracting])

  return (
    <div
      ref={coinRef}
      className={`relative cursor-pointer ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        perspective: '1000px',
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${
            isHovered ? 'scale(1.05)' : 'scale(1)'
          }`,
        }}
      >
        {/* Coin front face */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 30% 30%, rgba(251, 191, 36, 0.9), rgba(249, 115, 22, 0.8))',
            boxShadow: `
              inset 0 0 40px rgba(0, 0, 0, 0.3),
              0 0 60px rgba(251, 191, 36, 0.4),
              0 0 100px rgba(249, 115, 22, 0.3)
            `,
            transform: 'translateZ(12px)',
            border: '2px solid rgba(251, 191, 36, 0.3)',
          }}
        >
          {/* Bitcoin symbol */}
          <div
            className="text-white font-bold select-none"
            style={{
              fontSize: `${size * 0.4}px`,
              textShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
              transform: 'translateZ(10px)',
            }}
          >
            ₿
          </div>
        </div>

        {/* Coin edge/rim - cylindrical effect */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              rgba(184, 134, 11, 0.95) 0deg,
              rgba(217, 119, 6, 0.95) 90deg,
              rgba(184, 134, 11, 0.95) 180deg,
              rgba(217, 119, 6, 0.95) 270deg,
              rgba(184, 134, 11, 0.95) 360deg
            )`,
            width: `${size}px`,
            height: `${size}px`,
            transform: 'rotateY(90deg)',
            transformOrigin: 'center center',
            clipPath: `inset(0 ${size / 2 - 12}px 0 ${size / 2 - 12}px)`,
            boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* Coin back face */}
        <div
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background:
              'radial-gradient(circle at 70% 70%, rgba(249, 115, 22, 0.8), rgba(184, 134, 11, 0.9))',
            boxShadow: `
              inset 0 0 40px rgba(0, 0, 0, 0.3),
              0 0 60px rgba(249, 115, 22, 0.4),
              0 0 100px rgba(251, 191, 36, 0.3)
            `,
            transform: 'translateZ(-12px) rotateY(180deg)',
            border: '2px solid rgba(249, 115, 22, 0.3)',
          }}
        >
          {/* Pattern on back */}
          <div
            className="w-3/4 h-3/4 rounded-full border-4 border-white/20"
            style={{
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.3)',
            }}
          />
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent 70%)',
            opacity: isHovered ? 0.8 : 0.4,
            filter: 'blur(20px)',
            transform: 'translateZ(-20px)',
          }}
        />
      </div>

      {/* Animated ring around coin */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none animate-spin"
        style={{
          border: '2px solid transparent',
          borderTopColor: 'rgba(251, 191, 36, 0.5)',
          borderRightColor: 'rgba(249, 115, 22, 0.5)',
          animationDuration: '3s',
          transform: 'scale(1.1)',
        }}
      />
    </div>
  )
}
