import Button from "@/components/common/button";
import { CustomInput } from "@/components/common/custom-input/custom-input";
import { useSnackbar } from "@/lib/context/snack-bar-context";
import { PAGE } from "@/utils/enums";
import { signIn } from "@/utils/firebase";
import { useRouter } from "next/router";
import React, { useState } from "react";
import GoogleLoginButton from "../google-login";

const LoginForm = () => {
  const { openSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (event: any) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    setIsLoading(true);
    try {
      await signIn(email, password);
      openSnackbar("Logged in Successfully", false);
      router.push(PAGE.HOME);
    } catch (error: any) {
      let message;
      switch (error.code) {
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          message =
            "This account has been disabled. Please contact support for help.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Incorrect email or password. Please try again.";
          break;
        case "auth/too-many-requests":
          message =
            "Too many attempts. Please try again later or reset your password.";
          break;
        case "auth/network-request-failed":
          message =
            "Network error. Please check your connection and try again.";
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
      onSubmit={handleSignIn}
      className="bg-gray-700 shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <div className="mb-4 ">
        <label
          htmlFor="login__username"
          className="block text-gray-300 text-sm font-bold mb-2"
        >
          Username
        </label>
        <CustomInput
          autoComplete="username"
          id="email"
          type="text"
          name="email"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Email"
          required
        />
      </div>
      <div className="mb-6">
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
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Password"
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>
      </div>
      <hr className="w-full my-5" />
      <GoogleLoginButton />
    </form>
  );
};

export default LoginForm;
