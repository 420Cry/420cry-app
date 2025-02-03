import { IAlert, ISignIn, ISignUp } from "@/src/types";
import { CryTextField } from "@420cry/420cry-lib";
import { JSX } from "react";
import { showAlert } from "./showAlert";

export const renderTextField = <T extends { [key: string]: ISignIn | ISignUp }>(
  label: string,
  name: keyof T,
  value: string,
  onChange: (value: string) => void,
  type: "text" | "password" = "text",
  shape: "circle" | "square" | "rounded" | undefined,
  toggleSlotContent?: (isVisible: boolean) => JSX.Element,
): JSX.Element => (
  <div className="mb-6">
    <label className="block text-gray-700 text-sm font-bold mb-2">
      {label}
    </label>
    <CryTextField
      type={type}
      modelValue={value}
      name={name as string}
      onChange={onChange}
      shape={shape}
      toggleSlot={
        type === "password"
          ? (isVisible) =>
              toggleSlotContent ? (
                toggleSlotContent(isVisible)
              ) : (
                <div className="px-2 py-1 text-xs rounded text-black">
                  {isVisible ? "Hide" : "Show"}
                </div>
              )
          : undefined
      }
    />
  </div>
);


export const formValidate = <T extends { [key: string]: string }>(
  formData: T,
  validations: Array<(data: T) => boolean>,
  setAlert: (alert: IAlert) => void,
): boolean => {
  for (const validation of validations) {
    if (!validation(formData)) {
      return false;
    }
  }
  showAlert("info", "", setAlert);
  return true;
};
