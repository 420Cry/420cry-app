'use client';

import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Cry420Button({
  type = 'button',
  onClick,
  children,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full py-3 ${className} transition-transform hover:scale-105 focus:outline-none focus:ring-2`}
    >
      {children}
    </button>
  );
}
