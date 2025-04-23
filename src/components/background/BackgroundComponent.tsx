import Image from 'next/image'
import React from 'react'

const BackgroundComponent = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <div className="relative overflow-hidden">
      <Image
        src="/background/blackHoneyComb.jpg"
        alt="Dark background"
        width={6400}
        height={4320}
        className="absolute transform w-full h-full z-0 object-cover brightness-75 "
      />
      <div className="w-full h-full absolute bg-neutralDark/50"></div>

      <div className="w-[400px] h-[400px] left-[-5%] bg-[#F9FAFA]/5 absolute blur-[100px] rounded-[100%] z-2"></div>

      <div className="w-[400px] h-[400px] right-[-5%] bottom-0 bg-gradient-to-r from-radialLeft/20 to-radialRight/20 absolute blur-[100px] rounded-[100%] z-2"></div>

      {children}
    </div>
  )
}

export default BackgroundComponent
