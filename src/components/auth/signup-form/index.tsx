import Button from "@/components/common/button";
import { CustomInput } from "@/components/common/custom-input/CustomInput";
import Google from "@/components/common/icons/google";
import { useSnackbar } from "@/lib/context/snack-bar-context";
import { signUp } from "@/utils/firebase";
import React, { useState } from "react";
import GoogleLoginButton from "../google-login";

const SignupForm = () => {
  const { openSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (
    event: //  React.FormEvent<HTMLFormElement>
    any
  ) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    if (confirmPassword !== password) {
      openSnackbar("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await signUp(email, password);
      openSnackbar("Logged in Successfully", false);
    } catch (error: any) {
      let message;
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already in use. Please try another.";
          break;
        case "auth/weak-password":
          message = "Please use a stronger password, at least 6 characters.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        default:
          message = "An error occurred during registration. Please try again.";
      }
      openSnackbar(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="mb-4 bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4 ">
        <label
          htmlFor="login__username"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Username
        </label>
        <CustomInput
          autoComplete="email"
          id="email"
          type="text"
          name="email"
          placeholder="Username"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Password
        </label>
        <CustomInput
          id="password"
          type="password"
          name="password"
          placeholder="Confirm Password"
          required
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="password"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Confirm Password
        </label>

        <CustomInput
          id="confirmPassword"
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <Button type="submit" isLoading={isLoading}>
          Signup
        </Button>
      </div>
      <hr className="w-full my-5" />
      <GoogleLoginButton />
    </form>
  );
};

export default SignupForm;
