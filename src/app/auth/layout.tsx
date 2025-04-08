// const authLayout = ({
//   children,
// }: {
//   children: React.ReactNode
// }): React.ReactElement => {
//   const {
//     props: { srcSet },
//   } = getImageProps({
//     alt: '',
//     width: 6400,
//     height: 4320,
//     src: '/backgroundImg.jpg',
//   })

//   const backgroundImage = getBackgroundImage(srcSet)
//   const style = {
//     height: '',
//     width: '',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     backgroundRepeat: 'no-repeat',
//     backgroundImage,
//   }

//   return <div style={style}>{children}</div>
// }

// export default authLayout

const authLayout = ({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement => {
  return (
    <div className="relative bg-backgroundImg bg-cover z-0 overflow-hidden">
      {/* Color Fill Layout */}
      <div className="absolute inset-0 bg-[#080B1A] z-1 opacity-70 "></div>

      {/* Radial Circle - Top Left */}
      <div
        className="absolute top-[-100px] left-[-140px] w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)',
          filter: 'blur(150px)',
          zIndex: 0,
        }}
      ></div>

      {/* Radial Circle - Bottom Right */}
      <div
        className="absolute bottom-0 right-[-200px] w-[500px] h-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(0, 255, 255, 0.1), transparent)',
          filter: 'blur(150px)',
          zIndex: 0,
        }}
      ></div>

      <div className="w-full h-screen z-10 relative ">{children}</div>
    </div>
  )
}

export default authLayout
