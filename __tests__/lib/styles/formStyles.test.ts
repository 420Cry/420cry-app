import { describe, it, expect } from 'vitest'
import {
  formStyles,
  combineStyles,
  conditionalStyles,
} from '@/lib/styles/formStyles'

describe('formStyles', () => {
  describe('formStyles object', () => {
    it('contains all expected style categories', () => {
      expect(formStyles).toHaveProperty('input')
      expect(formStyles).toHaveProperty('label')
      expect(formStyles).toHaveProperty('container')
      expect(formStyles).toHaveProperty('button')
      expect(formStyles).toHaveProperty('layout')
      expect(formStyles).toHaveProperty('text')
      expect(formStyles).toHaveProperty('spacing')
    })

    it('has correct input styles', () => {
      expect(formStyles.input.default).toBe(
        'bg-black text-white hover:bg-gray-800 dark:bg-gray-900',
      )
      expect(formStyles.input.focus).toBe(
        'focus:border-green-500 focus:ring-green-500',
      )
      expect(formStyles.input.error).toBe('border-red-500 focus:border-red-500')
      expect(formStyles.input.success).toBe(
        'border-green-500 focus:border-green-500',
      )
    })

    it('has correct label styles', () => {
      expect(formStyles.label.default).toBe('text-neutral-gray-3')
      expect(formStyles.label.required).toBe(
        "text-neutral-gray-3 after:content-['*'] after:text-red-500 after:ml-1",
      )
    })

    it('has correct container styles', () => {
      expect(formStyles.container.card).toBe(
        'p-8 sm:p-14 w-full max-w-[900px] rounded-2xl backdrop-blur-md border border-white/10',
      )
      expect(formStyles.container.form).toBe('w-full max-w-[500px] m-auto')
      expect(formStyles.container.field).toBe('mb-4')
    })

    it('has correct button styles', () => {
      expect(formStyles.button.primary).toBe(
        'bg-green-600 hover:bg-green-700 text-white',
      )
      expect(formStyles.button.secondary).toBe(
        'bg-gray-600 hover:bg-gray-700 text-white',
      )
      expect(formStyles.button.danger).toBe(
        'bg-red-600 hover:bg-red-700 text-white',
      )
      expect(formStyles.button.submit).toBe(
        'bg-green-600 w-52 sm:w-60 text-white',
      )
    })

    it('has correct layout styles', () => {
      expect(formStyles.layout.center).toBe('flex items-center justify-center')
      expect(formStyles.layout.centerVertical).toBe(
        'flex items-center justify-center mt-16 sm:mt-32 px-4',
      )
      expect(formStyles.layout.centerHorizontal).toBe('flex justify-center')
      expect(formStyles.layout.spaceBetween).toBe('flex justify-between w-full')
    })

    it('has correct text styles', () => {
      expect(formStyles.text.title).toBe(
        'text-center text-white text-2xl sm:text-3xl mb-4 sm:mb-6 font-bold',
      )
      expect(formStyles.text.subtitle).toBe(
        'text-white m-auto text-center max-w-[400px] w-full font-bold text-md sm:text-lg',
      )
      expect(formStyles.text.link).toBe(
        'text-sm font-bold text-white hover:underline',
      )
      expect(formStyles.text.error).toBe('text-red-500 text-sm mt-1')
      expect(formStyles.text.success).toBe('text-green-500 text-sm mt-1')
    })

    it('has correct spacing styles', () => {
      expect(formStyles.spacing.small).toBe('mb-2')
      expect(formStyles.spacing.medium).toBe('mb-4')
      expect(formStyles.spacing.large).toBe('mb-6')
      expect(formStyles.spacing.extraLarge).toBe('mb-8')
      expect(formStyles.spacing.section).toBe('mt-10')
    })
  })

  describe('combineStyles', () => {
    it('combines multiple style strings', () => {
      const result = combineStyles('class1', 'class2', 'class3')
      expect(result).toBe('class1 class2 class3')
    })

    it('filters out undefined values', () => {
      const result = combineStyles('class1', undefined, 'class3')
      expect(result).toBe('class1 class3')
    })

    it('handles empty array', () => {
      const result = combineStyles()
      expect(result).toBe('')
    })

    it('handles all undefined values', () => {
      const result = combineStyles(undefined, undefined)
      expect(result).toBe('')
    })

    it('trims whitespace', () => {
      const result = combineStyles(' class1 ', ' class2 ')
      expect(result).toBe('class1 class2')
    })
  })

  describe('conditionalStyles', () => {
    it('returns trueStyles when condition is true', () => {
      const result = conditionalStyles(true, 'active-class', 'inactive-class')
      expect(result).toBe('active-class')
    })

    it('returns falseStyles when condition is false', () => {
      const result = conditionalStyles(false, 'active-class', 'inactive-class')
      expect(result).toBe('inactive-class')
    })

    it('returns empty string when condition is false and no falseStyles provided', () => {
      const result = conditionalStyles(false, 'active-class')
      expect(result).toBe('')
    })

    it('handles boolean false condition', () => {
      const result = conditionalStyles(
        Boolean(0),
        'active-class',
        'inactive-class',
      )
      expect(result).toBe('inactive-class')
    })

    it('handles truthy condition', () => {
      const result = conditionalStyles(
        Boolean(1),
        'active-class',
        'inactive-class',
      )
      expect(result).toBe('active-class')
    })
  })
})
