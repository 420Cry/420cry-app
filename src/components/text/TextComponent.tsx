import classnames from 'classnames'
import { JSX } from 'react'

type textProps = {
  children: React.ReactNode
  type: 'header' | 'subheader' | 'body'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const TextComponent = ({
  children,
  type,
  size = 'sm',
  className,
}: textProps): JSX.Element => {

  const textClassName = classnames({
    'text-[40px]': type == 'header' && size == 'sm',
    'text-[56px]': type == 'header' && size == 'md',
    'text-[80px]': type == 'header' && size == 'lg',
    'text-[32px]': type == 'subheader',
    'text-[14px]': type == 'body' && size == 'sm',
    'text-[20px]': type == 'body' && size == 'md',
    [className ?? '']: className,
  })

  return (
    <>
      {type == 'header' && <h1 className={`${textClassName}`}>{children}</h1>}
      {type == 'subheader' && (
        <h2 className={`${textClassName}`}>{children}</h2>
      )}
      {type == 'body' && <p className={`${textClassName}`}>{children}</p>}
    </>
  )
}

export default TextComponent
