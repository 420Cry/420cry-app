import Image from 'next/image'
import { JSX, ReactNode } from 'react'

const HoneyCombBackground = ({
  children,
}: {
  children: ReactNode
}): JSX.Element => {
  return (
    <div className="relative overflow-hidden">
      <Image
        src="/background/blackHoneyComb.jpg"
        fill
        alt="Honeycomb background"
        className="absolute z-0 object-cover brightness-75"
      />
      <div className="w-full h-full absolute bg-neutral-dark/30"></div>

      <div className="w-[400px] h-[400px] left-[-5%] bg-secondary/5 absolute blur-[50px] rounded-[100%] z-2"></div>

      <div className="w-[400px] h-[400px] right-[-5%] bottom-0 bg-gradient-to-r from-primary/20 to-secondary/20 absolute blur-[100px] rounded-[100%] z-2"></div>

      {children}
    </div>
  )
}

export default HoneyCombBackground
