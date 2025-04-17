import { CryTextField } from '@420cry/420cry-lib'
import { JSX } from 'react'

export const FormTextField = <T,>({
  label,
  name,
  type = 'text',
  value,
  onChange,
  shape = 'circle',
  toggleSlotContent,
  hideLabel,
  showLabel,
}: {
  label: string
  name: keyof T
  type?: 'text' | 'password'
  value?: string
  onChange?: (value: string) => void
  shape?: 'circle' | 'square' | 'rounded'
  toggleSlotContent?: (isVisible: boolean) => JSX.Element
  hideLabel?: JSX.Element | string
  showLabel?: JSX.Element | string
}): JSX.Element => {
  const renderToggleSlot =
    type === 'password' && toggleSlotContent
      ? (isVisible: boolean) => toggleSlotContent(isVisible)
      : undefined

  return (
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
          renderToggleSlot ||
          (type === 'password' && hideLabel && showLabel
            ? (isVisible: boolean) => (
                <div className="px-2 py-1 text-xs rounded text-black hover:underline">
                  {isVisible ? hideLabel : showLabel}
                </div>
              )
            : undefined)
        }
      />
    </div>
  )
}
