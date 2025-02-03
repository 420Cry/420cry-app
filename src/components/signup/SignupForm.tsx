"use client";
import { CryButton, GoogleIcon, DiscordIcon } from "@420cry/420cry-lib";
import React, { useState } from "react";
import { useAlert } from "@/src/context/AlertContext";
import { ISignUp } from "@/src/types";
import {
  formValidate,
  renderTextField,
  showAlert,
} from "@/src/utils";

const initialFormState: ISignUp = {
  fullname: "",
  email: "",
  username: "",
  password: "",
  repeatedPassword: "",
};

const SignupForm: React.FC = () => {
  const [formState, setFormState] = useState<ISignUp>(initialFormState);
  const { setAlert } = useAlert();

  const updateFormState = (key: keyof ISignUp) => (value: string) =>
    setFormState((prev) => ({ ...prev, [key]: value }));

  const formValidateHandler = (): boolean => {
    const validations = [
      (data: ISignUp) => {
        if (
          !data.fullname ||
          !data.email ||
          !data.username ||
          !data.password ||
          !data.repeatedPassword
        ) {
          showAlert("danger", "All fields are required.", setAlert);
          return false;
        }
        return true;
      },
      (data: ISignUp) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
          showAlert("danger", "Invalid email address.", setAlert);
          return false;
        }
        return true;
      },
      (data: ISignUp) => {
        if (data.password !== data.repeatedPassword) {
          showAlert("danger", "Passwords do not match.", setAlert);
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
      showAlert("success", "Signup successful!", setAlert);
    }
  };

  return (
    <div className="flex items-center justify-center mt-16 sm:mt-24 px-4">
      <div className="bg-transparent p-8 sm:p-16 w-full sm:w-5/12 rounded-2xl shadow-lg">
        <h1 className="text-center text-2xl sm:text-3xl mb-6 sm:mb-10 font-bold">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mb-4">
            <div className="w-full sm:w-1/2 sm:pr-2">
              {renderTextField(
                "Full Name",
                "fullname",
                formState.fullname,
                updateFormState("fullname"),
                "text",
                "circle",
              )}
            </div>
            <div className="w-full sm:w-1/2">
              {renderTextField(
                "Email",
                "email",
                formState.email,
                updateFormState("email"),
                "text",
                "circle",
              )}
            </div>
          </div>
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
          {renderTextField(
            "Repeated Password",
            "repeatedPassword",
            formState.repeatedPassword,
            updateFormState("repeatedPassword"),
            "password",
            "circle",
          )}
          <div className="flex justify-center">
            <CryButton
              circle
              className="bg-green-600 w-52 sm:w-60 text-white"
              onClick={handleSubmit}
            >
              Sign Up
            </CryButton>
          </div>
        </form>
        <div className="text-center text-sm sm:text-base mt-6 sm:mt-10 text-yellow-600">
          Or sign up using
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { icon: GoogleIcon, label: "Google" },
            { icon: DiscordIcon, label: "Discord" },
          ].map(({ icon: Icon, label }) => (
            <CryButton
              key={label}
              size="lg"
              className="bg-transparent w-40"
              circle
              outlined
            >
              <div className="flex items-center justify-center">
                <Icon className="h-5 w-5 mr-2" />
                <div>{label}</div>
              </div>
            </CryButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
