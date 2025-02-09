import { CryTextField } from '@420cry/420cry-lib'
import { JSX } from 'react'

export const renderFormTextField = <T,>(
  label: string,
  name: keyof T,
  value?: string,
  onChange?: (value: string) => void,
  type: 'text' | 'password' = 'text',
  shape: 'circle' | 'square' | 'rounded' = 'circle',
  toggleSlotContent?: (isVisible: boolean) => JSX.Element,
): JSX.Element => (
  <div className="mb-6">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <CryTextField
      type={type}
      modelValue={value || ''}
      name={name as string}
      onChange={onChange}
      shape={shape}
      toggleSlot={
        type === 'password'
          ? (isVisible) =>
              toggleSlotContent ? (
                toggleSlotContent(isVisible)
              ) : (
                <div className="px-2 py-1 text-xs rounded text-black hover:underline">
                  {isVisible ? 'Hide' : 'Show'}
                </div>
              )
          : undefined
      }
    />
  </div>
)
