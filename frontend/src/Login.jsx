import React from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const Login = () => {
  const [state, setState] = React.useState("login");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = React.useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsLoading(true);

    try {
      const endpoint =
        state === "login"
          ? "http://localhost:5000/api/auth/login"
          : "http://localhost:5000/api/auth/register";

      const payload =
        state === "login"
          ? {
              email: formData.email,
              password: formData.password,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || "Request failed. Please try again.");
      }

      // If successful, data contains: { success: true, token?, user }
      const { token, user } = data;

      // NEW: Store the token in browser's localStorage
      // This token proves the user is logged in
      if (token) {
        localStorage.setItem("authToken", token);
      }
      localStorage.setItem("user", JSON.stringify(user));

      // Show success message
      setMessage({
        type: "success",
        text: `Welcome ${user.name}!`,
      });

      setTimeout(() => {
        navigate("/generate");
      }, 1000);
    } catch (error) {
      // If something goes wrong, show the error
      let errorMessage = error.message || "Something went wrong";

      if (errorMessage === "Failed to fetch") {
        errorMessage =
          "Cannot reach backend server on port 5000. Start backend and check API URL.";
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button className="back-btn" onClick={() => navigate(-1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5" />
          <path d="m12 5-7 7 7 7" />
        </svg>
        Back
      </button>
      <div className="login-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <h1 className="login-title">
            {state === "login" ? "Login" : "Sign up"}
          </h1>

          <p className="login-subtitle">
            Sign in to create product marketing visuals
          </p>

          {state !== "login" && (
            <div className="input-group">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {" "}
                <circle cx="12" cy="8" r="5" />{" "}
                <path d="M20 21a8 8 0 0 0-16 0" />{" "}
              </svg>
              <input
                type="text"
                name="name"
                autoComplete="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="input-group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />{" "}
              <rect x="2" y="4" width="20" height="16" rx="2" />{" "}
            </svg>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email id"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />{" "}
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />{" "}
            </svg>
            <input
              type="password"
              name="password"
              autoComplete={
                state === "login" ? "current-password" : "new-password"
              }
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="forget-password-container">
            <button type="button" className="forget-password-btn">
              Forget password?
            </button>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading
              ? "Please wait..."
              : state === "login"
                ? "Login"
                : "Sign up"}
          </button>

          {message.text && (
            <p
              className={message.type === "error" ? "error-msg" : "success-msg"}
              role="alert"
              aria-live="polite"
            >
              {message.text}
            </p>
          )}

          <p
            onClick={() =>
              setState((prev) => (prev === "login" ? "register" : "login"))
            }
            className="toggle-auth"
          >
            {state === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <button className="toggle-auth-btn">click here</button>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
