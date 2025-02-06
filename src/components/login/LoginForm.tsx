"use client";
import { CryButton, DiscordIcon, GoogleIcon } from "@420cry/420cry-lib";
import React, { useState } from "react";
import { useAlert } from "@/src/context/AlertContext";
import { formValidate, showAlert, renderTextField } from "@/src/utils";
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
        </form>
        <div className="text-right">
          <a
            href="/reset-password"
            className="text-sm font-bold text-white hover:underline"
          >
            Forgot your password?
          </a>
        </div>
        <div className="flex flex-wrap justify-center my-6 gap-4">
          {[
            { icon: DiscordIcon, label: "Discord" },
            { icon: GoogleIcon, label: "Google" },
          ].map(({ icon: Icon, label }) => (
            <CryButton key={label} className="bg-transparent w-12" circle>
              <div className="flex items-center justify-center">
                <Icon className="h-8 w-8" />
              </div>
            </CryButton>
          ))}
        </div>
        <div className="flex justify-center">
          <CryButton
            circle
            className="bg-green-600 w-52 sm:w-60 text-white"
            onClick={handleSubmit}
          >
            Login
          </CryButton>
        </div>

        <div className="text-center sm:text-base sm:mt-4">
          <a href="/signup" className="text-sm text-yellow-600 hover:underline">
            Don't have an account? Signup here
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
