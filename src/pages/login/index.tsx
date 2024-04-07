import React, { useState } from "react";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";

const Login = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="w-full max-w-xs">
        <div className="text-xl text-white py-5 w-full text-center">
          Welcome to your Task Manager
        </div>
        <div className={`flip-container ${isFlipped ? "flipped" : ""}`}>
          <div className="flipper">
            <div className="front">
              <LoginForm />
              <p className="text-center text-gray-300 text-xs">
                Not a member?
                <button
                  onClick={handleFlip}
                  className="text-blue-500 hover:text-blue-800"
                >
                  Signup now
                </button>
              </p>
            </div>
            <div className="back">
              <SignupForm />

              <p className="text-center text-gray-300 text-xs">
                Already a member?
                <button
                  onClick={handleFlip}
                  className="text-blue-500 hover:text-blue-800"
                >
                  Login now
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
