"use client";

import { appHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

interface formData {
  name?: string;
  email: string;
  password: string;
  password_confirmation?: string;
}

export default function Auth() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [formData, setFormData] = useState<formData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const router = useRouter();

  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { login, register, authToken, isLoading } = appHook();

  useEffect(() => {
    if (authToken) {
      router.push("/dashboard");
      return;
    }
  }, [isLoading, authToken]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      try {
        await login(formData.email, formData.password);
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      try {
        await register(
          formData.name ?? "",
          formData.email,
          formData.password,
          formData.password_confirmation ?? ""
        );
      } catch (error) {
        console.error("Registration failed:", error);
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 w-400">
        <h3 className="text-center">{isLogin ? "Login" : "Register"}</h3>

        <form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <input
              className="form-control mb-2"
              name="name"
              type="text"
              value={formData.name}
              placeholder="Name"
              onChange={handleOnChangeInput}
              required
            />
          )}

          <input
            className="form-control mb-2"
            name="email"
            type="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleOnChangeInput}
            required
          />

          <input
            className="form-control mb-2"
            name="password"
            type="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleOnChangeInput}
            required
          />

          {!isLogin && (
            <input
              className="form-control mb-2"
              name="password_confirmation"
              type="password"
              value={formData.password_confirmation}
              placeholder="Confirm Password"
              onChange={handleOnChangeInput}
              required
            />
          )}

          <button className="btn btn-primary w-100" type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center">
          {isLogin ? "Don't have an account? " : " Already have an account? "}
          <span className="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>

      <style jsx>{`
        .w-400 {
          width: 400px;
        }

        .link {
          color: blue;
          cursor: pointer;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
