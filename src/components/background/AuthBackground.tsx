import Image from 'next/image'
import React from 'react'
import { IBackground } from '@/types'

const AuthBackground = ({
  children,
  bgSelection,
}: {
  children: React.ReactNode
  bgSelection: IBackground
}): React.ReactElement => {
  const { width, height, backgroundName, altName } = bgSelection

  return (
    <div className="relative overflow-hidden">
      <Image
        src={`/background/${backgroundName}.jpg`}
        alt={altName}
        width={width}
        height={height}
        className="absolute transform w-full h-full z-0 object-cover brightness-75 "
      />
      <div className="w-full h-full absolute bg-neutral-dark/30"></div>

      <div className="w-[400px] h-[400px] left-[-5%] bg-[#F9FAFA]/5 absolute blur-[50px] rounded-[100%] z-2"></div>

      <div className="w-[400px] h-[400px] right-[-5%] bottom-0 bg-gradient-to-r from-radial-left/20 to-radial-right/20 absolute blur-[100px] rounded-[100%] z-2"></div>

      {children}
    </div>
  )
}

export default AuthBackground
