import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();

  const [isStudent, setIsStudent] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationType, setRegistrationType] = useState("");

  // Login
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentRememberMe, setStudentRememberMe] = useState(false);

  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniPassword, setAlumniPassword] = useState("");
  const [alumniRememberMe, setAlumniRememberMe] = useState(false);

  // Student Registration
  const [studentRegFullName, setStudentRegFullName] = useState("");
  const [studentRegBatchNo, setStudentRegBatchNo] = useState("");
  const [studentRegNo, setStudentRegNo] = useState("");
  const [studentRegDepartment, setStudentRegDepartment] = useState("");
  const [studentRegSemester, setStudentRegSemester] = useState("");
  const [studentRegEmail, setStudentRegEmail] = useState("");
  const [studentRegPassword, setStudentRegPassword] = useState("");
  const [studentRegConfirmPassword, setStudentRegConfirmPassword] =
    useState("");

  // Alumni Registration
  const [alumniRegFullName, setAlumniRegFullName] = useState("");
  const [alumniRegNo, setAlumniRegNo] = useState("");
  const [alumniRegContactNo, setAlumniRegContactNo] = useState("");
  const [alumniRegDepartment, setAlumniRegDepartment] = useState("");
  const [alumniRegGradYear, setAlumniRegGradYear] = useState("");
  const [alumniRegEmail, setAlumniRegEmail] = useState("");
  const [alumniRegPassword, setAlumniRegPassword] = useState("");
  const [alumniRegConfirmPassword, setAlumniRegConfirmPassword] = useState("");

  const openStudentRegistration = () => {
    setRegistrationType("student");
    setShowRegistration(true);
  };

  const openAlumniRegistration = () => {
    setRegistrationType("alumni");
    setShowRegistration(true);
  };

  const handleStudentLogin = (e) => {
    e.preventDefault();
    if (!studentEmail || !studentPassword) return alert("Missing fields");

    navigate("/dashboard");
  };

  const handleAlumniLogin = (e) => {
    e.preventDefault();
    if (!alumniEmail || !alumniPassword) return alert("Missing fields");

    navigate("/dashboard");
  };

  const handleStudentRegistration = (e) => {
    e.preventDefault();
    if (studentRegPassword !== studentRegConfirmPassword) {
      return alert("Passwords do not match");
    }

    navigate("/dashboard");
  };

  const handleAlumniRegistration = (e) => {
    e.preventDefault();
    if (alumniRegPassword !== alumniRegConfirmPassword) {
      return alert("Passwords do not match");
    }

    navigate("/dashboard");
  };

  return (
    <main className="auth-main">
      {/* LOGIN CONTAINER */}
      <div className={`auth-container ${showRegistration ? "slide-up" : ""}`}>
        {/* MOBILE TOGGLE BAR */}
        <div className="mobile-auth-toggle">
          <button
            className={isStudent ? "active" : ""}
            onClick={() => setIsStudent(true)}
          >
            Student Login
          </button>

          <button
            className={!isStudent ? "active" : ""}
            onClick={() => setIsStudent(false)}
          >
            Alumni Login
          </button>
        </div>

        {/* STUDENT LOGIN */}
        <div
          className={`auth-panel student-sign-in-panel ${
            isStudent ? "active" : "hidden-left"
          }`}
        >
          <h2 className="login-form-panel-title">Student Login</h2>

          <form className="auth-form" onSubmit={handleStudentLogin}>
            <input
              type="email"
              required
              placeholder="Enter Email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="auth-input"
            />

            <input
              type="password"
              required
              placeholder="Enter Password"
              value={studentPassword}
              onChange={(e) => setStudentPassword(e.target.value)}
              className="auth-input"
            />

            <div className="remember-forgot-container">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={studentRememberMe}
                  onChange={(e) => setStudentRememberMe(e.target.checked)}
                  className="remember-me-checkbox"
                />
                <span>Remember Me</span>
              </label>

              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <div className="auth-button-container">
              <button
                type="submit"
                className="auth-button student-sign-in-button"
              >
                Sign In
              </button>
            </div>

            <p className="register-link" onClick={openStudentRegistration}>
              Register as Student
            </p>
          </form>
        </div>

        {/* ALUMNI LOGIN */}
        <div
          className={`auth-panel Alumni-sign-in-panel ${
            isStudent ? "hidden-right" : "active"
          }`}
        >
          <h2 className="login-form-panel-title">Alumni Login</h2>

          <form className="auth-form" onSubmit={handleAlumniLogin}>
            <input
              type="email"
              required
              placeholder="Enter Email"
              value={alumniEmail}
              onChange={(e) => setAlumniEmail(e.target.value)}
              className="auth-input"
            />

            <input
              type="password"
              required
              placeholder="Enter Password"
              value={alumniPassword}
              onChange={(e) => setAlumniPassword(e.target.value)}
              className="auth-input"
            />

            <div className="remember-forgot-container">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  checked={alumniRememberMe}
                  onChange={(e) => setAlumniRememberMe(e.target.checked)}
                  className="remember-me-checkbox"
                />
                <span>Remember Me</span>
              </label>

              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>

            <button type="submit" className="auth-button Alumni-sign-in-button">
              Sign In
            </button>

            <p className="register-link" onClick={openAlumniRegistration}>
              Register as Alumni
            </p>
          </form>
        </div>

        {/* TOGGLE PANEL */}
        <div
          className={`auth-panel middle-panel ${
            isStudent ? "middle-right" : "middle-left"
          }`}
        >
          <img
            src="/Round-Logo-USP.png"
            alt="University Logo"
            className="middle-panel-logo"
          />

          <button
            onClick={() => setIsStudent(!isStudent)}
            className="toggle-button"
          >
            {isStudent ? "Alumni Login" : "Student Login"}
          </button>
        </div>
      </div>

      {/* STUDENT REGISTRATION */}
      <div
        className={`registration-container ${
          showRegistration && registrationType === "student"
            ? "slide-up-active"
            : ""
        }`}
      >
        <form
          className="registration-panel"
          onSubmit={handleStudentRegistration}
        >
          <div className="registration-monogram">
            <img src="/USP_RL.png" alt="Monogram" />
          </div>

          <h2 className="registration-form-panel-title">
            Student Registration
          </h2>

          <div className="registration-form">
            <div className="form-row">
              <input
                className="auth-input"
                placeholder="Full Name"
                type="text"
                required
                value={studentRegFullName}
                onChange={(e) => setStudentRegFullName(e.target.value)}
              />
              <input
                className="auth-input"
                placeholder="Registration Number"
                required
                value={studentRegNo}
                onChange={(e) => setStudentRegNo(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="auth-input"
                placeholder="Email"
                type="email"
                required
                value={studentRegEmail}
                onChange={(e) => setStudentRegEmail(e.target.value)}
              />

              <input
                className="auth-input"
                placeholder="Department"
                required
                value={studentRegDepartment}
                onChange={(e) => setStudentRegDepartment(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="auth-input"
                type="password"
                required
                placeholder="Password"
                value={studentRegPassword}
                onChange={(e) => setStudentRegPassword(e.target.value)}
              />

              <input
                className="auth-input"
                type="tel"
                required
                placeholder="Batch No"
                value={studentRegBatchNo}
                onChange={(e) => setStudentRegBatchNo(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="auth-input"
                type="password"
                required
                placeholder="Confirm Password"
                value={studentRegConfirmPassword}
                onChange={(e) => setStudentRegConfirmPassword(e.target.value)}
              />

              <input
                className="auth-input"
                type="number"
                required
                placeholder="Semester"
                value={studentRegSemester}
                onChange={(e) => setStudentRegSemester(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-button registration-button">
              Register
            </button>

            <p
              className="back-to-login-link"
              onClick={() => setShowRegistration(false)}
            >
              Back to Login
            </p>
          </div>
        </form>
      </div>

      {/* ALUMNI REGISTRATION */}
      <div
        className={`registration-container ${
          showRegistration && registrationType === "alumni"
            ? "slide-up-active"
            : ""
        }`}
      >
        <form
          className="registration-panel"
          onSubmit={handleAlumniRegistration}
        >
          <div className="registration-monogram">
            <img src="/USP_RL.png" alt="Monogram" />
          </div>

          <h2 className="registration-form-panel-title">Alumni Registration</h2>

          <div className="registration-form">
            <div className="form-row">
              <input
                className="auth-input"
                placeholder="Full Name"
                type="text"
                required
                value={alumniRegFullName}
                onChange={(e) => setAlumniRegFullName(e.target.value)}
              />
              <input
                className="auth-input"
                placeholder="Registration Number"
                required
                value={alumniRegNo}
                onChange={(e) => setAlumniRegNo(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="auth-input"
                placeholder="Email"
                type="email"
                required
                value={alumniRegEmail}
                onChange={(e) => setAlumniRegEmail(e.target.value)}
              />

              <input
                className="auth-input"
                type="text"
                required
                placeholder="Graduation Year"
                value={alumniRegGradYear}
                onChange={(e) => setAlumniRegGradYear(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="auth-input"
                type="password"
                required
                placeholder="Password"
                value={alumniRegPassword}
                onChange={(e) => setAlumniRegPassword(e.target.value)}
              />
              <input
                className="auth-input"
                type="text"
                required
                placeholder="Department"
                value={alumniRegDepartment}
                onChange={(e) => setAlumniRegDepartment(e.target.value)}
              />
            </div>

            <div className="form-row">
              <input
                className="auth-input"
                type="password"
                required
                placeholder="Confirm Password"
                value={alumniRegConfirmPassword}
                onChange={(e) => setAlumniRegConfirmPassword(e.target.value)}
              />
              <input
                className="auth-input"
                type="tel"
                required
                placeholder="Contact Number"
                value={alumniRegContactNo}
                onChange={(e) => setAlumniRegContactNo(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-button registration-button">
              Register
            </button>

            <p
              className="back-to-login-link"
              onClick={() => setShowRegistration(false)}
            >
              Back to Login
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
