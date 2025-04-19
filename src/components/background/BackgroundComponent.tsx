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

      {children}
    </div>
  )
}

export default BackgroundComponent
