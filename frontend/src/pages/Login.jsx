import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import {
  FiFileText,
  FiMail,
  FiLock,
  FiEye,
  FiShield,
  FiCloud,
  FiUsers,
  FiEdit3,
  FiDownloadCloud,
} from "react-icons/fi";
import { CgFileDocument } from "react-icons/cg";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-white via-blue-50 to-blue-100 text-[#071b3d]">
      <nav className="fixed left-0 top-0 z-50 flex h-[90px] w-full items-center justify-between border-b border-blue-100 bg-white px-8 shadow-sm lg:px-14">
        <div className="flex items-center gap-3">
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

        <Link
          to="/register"
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
        >
          Sign up Free
        </Link>
      </nav>

      <section className="flex min-h-screen flex-col gap-12 px-8 pt-[130px] lg:flex-row lg:px-14">
        <div className="flex w-full flex-col justify-center lg:w-[52%]">
          <div className="mb-7 flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-blue-600 shadow-sm">
            <FiShield />
            Powerful. Simple. Secure.
          </div>

          <h1 className="text-5xl font-extrabold leading-tight tracking-[-2px] md:text-7xl">
            Edit documents <br />
            smarter with <span className="text-blue-600">iDocs</span>
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-8 text-slate-500">
            Create, edit, and manage your documents all in one place.
          </p>

          <div className="mt-10 flex flex-wrap gap-7 text-sm text-slate-600">
            <span className="flex items-center gap-2">
              <FiShield /> Safe & Secure
            </span>
            <span className="flex items-center gap-2">
              <CgFileDocument /> One stop destination for all your documents
            </span>
          </div>

          <div className="mt-12 grid max-w-3xl gap-5 sm:grid-cols-3">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <FiEdit3 className="mb-3 text-2xl text-blue-600" />
              <h3 className="font-bold">Smart Editing</h3>
              <p className="mt-2 text-sm text-slate-500">
                Format and manage documents easily.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <FiShield className="mb-3 text-2xl text-blue-600" />
              <h3 className="font-bold">Protected</h3>
              <p className="mt-2 text-sm text-slate-500">
                Your documents stay safe.
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center pb-12 lg:w-[48%]">
          <div className="relative w-full max-w-[430px]">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-blue-300 blur-3xl opacity-40"></div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-cyan-300 blur-3xl opacity-40"></div>

            <div className="relative rounded-3xl border border-blue-100 bg-white p-8 shadow-[0_30px_80px_rgba(20,121,255,0.18)]">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-blue-600 text-3xl text-white">
                  <FiFileText />
                </div>

                <h2 className="text-4xl font-bold">Welcome Back</h2>
                <p className="mt-2 text-slate-500">
                  Login to continue to iDocs
                </p>
              </div>

              <div className="mb-4 flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 text-slate-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <FiMail />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700"
                />
              </div>

              <div className="mb-5 flex h-14 items-center gap-3 rounded-xl border border-slate-200 px-4 text-slate-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                <FiLock />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-700"
                />
                <FiEye />
              </div>

              {/* <div className="mb-6 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input type="checkbox" />
                  Remember me
                </label>

                <a href="/" className="font-semibold text-blue-600">
                  Forgot password?
                </a>
              </div> */}

              <button
                onClick={login}
                className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 mt-2"
              >
                Login
              </button>

              <p className="mt-6 text-center text-slate-600">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="font-semibold text-blue-600">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
