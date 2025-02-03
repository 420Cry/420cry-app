"use client";
import { CryButton } from "@420cry/420cry-lib";
import React, { useState } from "react";
import { useAlert } from "@/src/context/AlertContext";
import {
  formValidate,
  showAlert,
  renderTextField,
} from "@/src/utils";
import { ISignIn } from "@/src/types";

const initialFormState: ISignIn = {
  username: "",
  password: "",
};

const LoginForm: React.FC = () => {
  const [formState, setFormState] = useState<ISignIn>(initialFormState);
  const { setAlert } = useAlert();

  const updateFormState = (key: keyof ISignIn) => (value: string) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const formValidateHandler = (): boolean => {
    const validations: Array<(data: ISignIn) => boolean> = [
      (data) => {
        if (!data.username || !data.password) {
          showAlert(
            "danger",
            "Both username and password are required.",
            setAlert,
          );
          return false;
        }
        return true;
      },
    ];

    return formValidate(formState, validations, setAlert);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formValidateHandler()) {
      showAlert("success", "Login successful!", setAlert);
    }
  };

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-32 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          {renderTextField(
            "Username",
            "username",
            formState.username,
            updateFormState("username"),
            "text",
            "circle",
          )}
          {renderTextField(
            "Password",
            "password",
            formState.password,
            updateFormState("password"),
            "password",
            "circle",
          )}
          <div className="flex justify-center">
            <CryButton
              circle
              className="bg-green-600 w-52 sm:w-60 text-white"
              onClick={handleSubmit}
            >
              Login
            </CryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
