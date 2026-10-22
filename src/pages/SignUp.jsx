import { useState } from "react";
import { Eye, EyeOff, Code2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useSignupMutation } from "../api/authApi";

function Signup() {
  const navigate = useNavigate();
  const [signup, {isLoading, error}] = useSignupMutation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Signup data:", formData);
     try {
    const {firstName, lastName, age, email, gender, password} = formData;
    const response = await signup({
      emailId: email,
      firstName,
      lastName,
      age: Number(age),
      email,
      password,
      gender,
    });
    console.log("response-==-=-=--=>", response);
    
   navigate("/login")
    } catch (error) {
      console.error("error message is", error)
    }

    // Later we will connect this to your Node.js signup API
  };

  return (
    <div className="login-page">
      <div className="login-card signup-card">

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
          <h2>Create your account</h2>

          <p>
            Join Twingle.Live and connect with developers who match your skills.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="name-row">

            <div className="form-group">
              <label htmlFor="firstName">First name</label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Mayur"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>

              <input
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Saini"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            

          </div>

          {/* Age */}
          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              name="age"
              placeholder="Your age"
              value={formData.age}
              onChange={handleChange}
              min="18"
              required
            />
          </div>

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
          <div className="form-group">
              <label htmlFor="lastName">Gender</label>

              <input
                id="gender"
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
                required
              />
            </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
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

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              Confirm password
            </label>

            <div className="password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="terms">
            <input type="checkbox" required />

            <span>
              I agree to the{" "}
              <Link to="/terms">
                Terms & Conditions
              </Link>
            </span>
          </label>

          {/* Submit */}
          <button type="submit" className="login-button">
            Create account
          </button>
        </form>

        {/* Login */}
        <div className="signup-text">
          Already have an account?

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;
