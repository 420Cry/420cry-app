/**
 * CSS utility classes for consistent form styling
 * Reduces duplication and ensures consistent UI across forms
 */

export const formStyles = {
  // Input field styles
  input: {
    default: 'bg-black text-white hover:bg-gray-800 dark:bg-gray-900',
    focus: 'focus:border-green-500 focus:ring-green-500',
    error: 'border-red-500 focus:border-red-500',
    success: 'border-green-500 focus:border-green-500',
  },

  // Label styles
  label: {
    default: 'text-neutral-gray-3',
    required:
      "text-neutral-gray-3 after:content-['*'] after:text-red-500 after:ml-1", // eslint-disable-line quotes
  },

  // Container styles
  container: {
    card: 'p-8 sm:p-14 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10',
    form: 'w-full max-w-[500px] m-auto',
    field: 'mb-4',
    fieldHalf: 'w-full sm:w-1/2',
    fieldHalfLeft: 'w-full sm:w-1/2 sm:pr-4',
    fieldHalfRight: 'w-full sm:w-1/2',
  },

  // Button styles
  button: {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    submit: 'bg-green-600 w-52 sm:w-60 text-white',
    confirm: 'max-w-52 h-12 w-full',
  },

  // Layout styles
  layout: {
    center: 'flex items-center justify-center',
    centerVertical: 'flex items-center justify-center mt-16 sm:mt-32 px-4',
    centerHorizontal: 'flex justify-center',
    spaceBetween: 'flex justify-between w-full',
    spaceBetweenVertical: 'flex justify-between items-center',
  },

  // Text styles
  text: {
    title: 'text-center text-white text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold',
    subtitle:
      'text-white m-auto text-center max-w-[400px] w-full font-bold text-md sm:text-lg',
    link: 'text-sm font-bold text-white hover:underline',
    error: 'text-red-500 text-sm mt-1',
    success: 'text-green-500 text-sm mt-1',
  },

  // Spacing
  spacing: {
    small: 'mb-2',
    medium: 'mb-4',
    large: 'mb-6',
    extraLarge: 'mb-8',
    section: 'mt-10',
  },
} as const

/**
 * Helper function to combine multiple style classes
 */
export const combineStyles = (...styles: (string | undefined)[]): string => {
  return styles
    .filter(Boolean)
    .map((style) => style?.trim())
    .filter(Boolean)
    .join(' ')
}

/**
 * Helper function to conditionally apply styles
 */
export const conditionalStyles = (
  condition: boolean,
  trueStyles: string,
  falseStyles = '',
): string => {
  return condition ? trueStyles : falseStyles
}
