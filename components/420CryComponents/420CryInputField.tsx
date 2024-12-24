import React from 'react';

interface InputFieldProps {
  id: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "search";
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  id,
  type = "text",
  label,
  placeholder = "",
  value,
  onChange
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-left font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-300"
      />
    </div>
  );
}
