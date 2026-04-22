import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, isLoading, error } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const result = await signup(username, email, password);
      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("An error occurred during signup");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 md:px-8 py-5"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/background_banner.jpg')",
      }}
    >
      <div className="max-w-[450px] w-full bg-black bg-opacity-75 rounded px-8 py-14 mx-auto mt-8">
        
        <h1 className="text-3xl font-medium text-white mb-7">
          Sign Up
        </h1>

        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full h-[50px] bg-[#333] text-white rounded px-5 text-base outline-none focus:ring-2 focus:ring-[#e50914]"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-[50px] bg-[#333] text-white rounded px-5 text-base outline-none focus:ring-2 focus:ring-[#e50914]"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (min 6 characters)"
            className="w-full h-[50px] bg-[#333] text-white rounded px-5 text-base outline-none focus:ring-2 focus:ring-[#e50914]"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e50914] text-white py-2 rounded text-base hover:bg-[#b0060f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-10 text-[#737373] text-sm">
          <p>
            Already have an account?
            <span
              onClick={() => navigate("/signin")}
              className="text-white font-medium cursor-pointer ml-2 hover:underline"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;