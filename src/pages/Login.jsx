import { useState } from "react";
import { Eye, EyeOff, Code2 } from "lucide-react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useLoginMutation } from "../api/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "../features/auth/authSlice";
function Login() {
    const dispatch = useDispatch();
    const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, {isLoading, error}] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const {email, password} = formData
                console.log("here-===-=--=-=s", email, password);
        const response = await login({
            emailId: email,
            password: password
        }).unwrap();
        console.log("data is-==--==-=-=->", response);
        dispatch(setUser(response));
        navigation("/feed")
    } catch (error) {
        console.error("Login failed:", error);
    }
    console.log("Login data:", formData);

    // Later we will connect this to your Node.js API
  };

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="brand">
          <div className="brand-icon">
            <Code2 size={24} />
          </div>

          <h1>
            Twingle<span>.Live</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>Sign in to continue finding your developer match.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Password</label>

              <button
                type="button"
                className="forgot-password"
                onClick={() => console.log("Forgot password")}
              >
                Forgot password?
              </button>
            </div>

            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="remember-row">
            <label className="remember">
              <input type="checkbox" />

              <span>Remember me</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="login-button">
            Sign in
          </button>
        </form>

        {/* Signup */}
        <div className="signup-text">
          Don't have an account?
          <button
            type="button"
            onClick={() => navigation("/signup")}
          >
            Create account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;
