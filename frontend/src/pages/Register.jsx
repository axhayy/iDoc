import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  FiFileText,
  FiUser,
  FiMail,
  FiLock,
  FiShield,
  FiCloud,
  FiEdit3,
  FiCheckCircle,
} from "react-icons/fi";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {
    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration Successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Registration Failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = jwtDecode(credentialResponse.credential);

      const response = await api.post("/api/auth/google", {
        email: user.email,
        name: user.name,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      alert("Google Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-100 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-8 text-[#071b3d]">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-3xl lg:rounded-[2rem] shadow-2xl overflow-hidden border border-white">
        {/* Left Branding Section */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 text-3xl shadow-lg">
                <FiFileText />
              </div>

              <div>
                <h1 className="text-5xl font-extrabold leading-none">iDocs</h1>
                <p className="mt-2 text-[10px] font-bold tracking-[4px] text-blue-100">
                  DOCUMENT EDITOR
                </p>
              </div>
            </div>

            <h2 className="mt-14 xl:mt-16 text-4xl xl:text-5xl font-extrabold leading-tight">
              Create, edit and save your notes securely.
            </h2>

            <p className="mt-6 text-blue-100 text-base xl:text-lg leading-8">
              A clean cloud-based document editor built with React, Spring Boot,
              JWT authentication and MySQL.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mt-10">
            <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-4">
              <FiShield className="text-2xl shrink-0" />
              <span className="font-medium">Secure JWT authentication</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-4">
              <FiCloud className="text-2xl shrink-0" />
              <span className="font-medium">Cloud-style document storage</span>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/15 p-4">
              <FiEdit3 className="text-2xl shrink-0" />
              <span className="font-medium">Fast editing experience</span>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center justify-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-2xl text-white">
              <FiFileText />
            </div>

            <div>
              <h1 className="text-4xl font-bold leading-7">iDocs</h1>
              <p className="mt-1 text-[9px] font-bold tracking-[3px] text-slate-500">
                DOCUMENT EDITOR
              </p>
            </div>
          </div>

          <div className="text-center lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700">
              <FiCheckCircle />
              Create your free account
            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
              Join iDocs today
            </h2>

            <p className="mt-3 text-sm sm:text-base text-slate-500">
              Start writing and managing your documents in one beautiful place.
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 sm:h-13 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 sm:h-13 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 sm:h-13 rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <button
              type="button"
              onClick={register}
              className="w-full h-12 sm:h-13 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Create Account
            </button>
          </div>

          <div className="my-6 sm:my-7 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm font-medium text-slate-400">OR</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="flex justify-center overflow-hidden">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                alert("Google Login Failed");
              }}
            />
          </div>

          <p className="text-center mt-8 text-sm sm:text-base text-slate-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
