import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import API from "../../api/axios";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token is valid before redirecting
      API.get("/auth/verify")
        .then(() => {
          navigate("/dashboard");
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem("token");
        });
    }
  }, [navigate]);

  const [isStudent, setIsStudent] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationType, setRegistrationType] = useState("");

  // Login
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [studentRememberMe, setStudentRememberMe] = useState(false);
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentLoginError, setStudentLoginError] = useState(false);

  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniPassword, setAlumniPassword] = useState("");
  const [alumniRememberMe, setAlumniRememberMe] = useState(false);
  const [showAlumniPassword, setShowAlumniPassword] = useState(false);
  const [alumniLoginError, setAlumniLoginError] = useState(false);

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
  const [showStudentRegPassword, setShowStudentRegPassword] = useState(false);
  const [showStudentRegConfirmPassword, setShowStudentRegConfirmPassword] =
    useState(false);
  const [studentPasswordMismatch, setStudentPasswordMismatch] = useState(false);

  // Alumni Registration
  const [alumniRegFullName, setAlumniRegFullName] = useState("");
  const [alumniRegNo, setAlumniRegNo] = useState("");
  const [alumniRegContactNo, setAlumniRegContactNo] = useState("");
  const [alumniRegDepartment, setAlumniRegDepartment] = useState("");
  const [alumniRegGradYear, setAlumniRegGradYear] = useState("");
  const [alumniRegEmail, setAlumniRegEmail] = useState("");
  const [alumniRegPassword, setAlumniRegPassword] = useState("");
  const [alumniRegConfirmPassword, setAlumniRegConfirmPassword] = useState("");
  const [showAlumniRegPassword, setShowAlumniRegPassword] = useState(false);
  const [showAlumniRegConfirmPassword, setShowAlumniRegConfirmPassword] =
    useState(false);
  const [alumniPasswordMismatch, setAlumniPasswordMismatch] = useState(false);

  const openStudentRegistration = () => {
    setRegistrationType("student");
    setShowRegistration(true);
  };

  const openAlumniRegistration = () => {
    setRegistrationType("alumni");
    setShowRegistration(true);
  };

  // --- CONNECTED HANDLERS ---

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!studentEmail || !studentPassword) return alert("Missing fields");

    try {
      setStudentLoginError(false);
      await loginUser(studentEmail, studentPassword);
      navigate("/dashboard");
    } catch (err) {
      setStudentLoginError(true);
    }
  };

  const handleAlumniLogin = async (e) => {
    e.preventDefault();
    if (!alumniEmail || !alumniPassword) return alert("Missing fields");

    try {
      setAlumniLoginError(false);
      await loginUser(alumniEmail, alumniPassword);
      navigate("/dashboard");
    } catch (err) {
      setAlumniLoginError(true);
    }
  };

  const handleStudentRegistration = async (e) => {
    e.preventDefault();
    if (studentRegPassword !== studentRegConfirmPassword) {
      setStudentPasswordMismatch(true);
      return;
    }

    try {
      setStudentPasswordMismatch(false);
      const res = await API.post("/auth/register/student", {
        fullName: studentRegFullName,
        email: studentRegEmail,
        password: studentRegPassword,
        regNo: studentRegNo,
        semester: studentRegSemester,
        department: studentRegDepartment,
        batch: studentRegBatchNo,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  const handleAlumniRegistration = async (e) => {
    e.preventDefault();
    if (alumniRegPassword !== alumniRegConfirmPassword) {
      setAlumniPasswordMismatch(true);
      return;
    }

    try {
      setAlumniPasswordMismatch(false);
      const res = await API.post("/auth/register/alumni", {
        fullName: alumniRegFullName,
        email: alumniRegEmail,
        password: alumniRegPassword,
        graduationYear: alumniRegGradYear,
        regNo: alumniRegNo,
        department: alumniRegDepartment,
        contactNo: alumniRegContactNo,
        degree: "BSCS",
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
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
              onChange={(e) => {
                setStudentEmail(e.target.value);
                setStudentLoginError(false);
              }}
              className={`auth-input ${studentLoginError ? "input-error" : ""}`}
            />

            <div className="password-field-container">
              <div className="password-input-wrapper">
                <input
                  type={showStudentPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  value={studentPassword}
                  onChange={(e) => {
                    setStudentPassword(e.target.value);
                    setStudentLoginError(false);
                  }}
                  className={`auth-input ${studentLoginError ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowStudentPassword(!showStudentPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showStudentPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {studentLoginError && (
                <p className="error-message">Invalid email or password</p>
              )}
            </div>

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
              onChange={(e) => {
                setAlumniEmail(e.target.value);
                setAlumniLoginError(false);
              }}
              className={`auth-input ${alumniLoginError ? "input-error" : ""}`}
            />
            <div className="password-field-container">
              <div className="password-input-wrapper">
                <input
                  type={showAlumniPassword ? "text" : "password"}
                  required
                  placeholder="Enter Password"
                  value={alumniPassword}
                  onChange={(e) => {
                    setAlumniPassword(e.target.value);
                    setAlumniLoginError(false);
                  }}
                  className={`auth-input ${alumniLoginError ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowAlumniPassword(!showAlumniPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showAlumniPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
                {alumniLoginError && (
                  <p className="error-message">Invalid email or password</p>
                )}
              </div>
            </div>

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
  <div className="form-field-wrapper">
    <div className="password-input-wrapper">
      <input
        className={`auth-input ${studentPasswordMismatch ? "input-error" : ""}`}
        type={showStudentRegPassword ? "text" : "password"}
        required
        placeholder="Password"
        value={studentRegPassword}
        onChange={(e) => {
          setStudentRegPassword(e.target.value);
          setStudentPasswordMismatch(false);
        }}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() =>
          setShowStudentRegPassword(!showStudentRegPassword)
        }
        aria-label="Toggle password visibility"
      >
        {showStudentRegPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        )}
      </button>
    </div>
  </div>

  <div className="form-field-wrapper">
    <input
      className="auth-input"
      type="tel"
      required
      placeholder="Batch No"
      value={studentRegBatchNo}
      onChange={(e) => setStudentRegBatchNo(e.target.value)}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-field-wrapper">
    <div className="password-field-container">
      <div className="password-input-wrapper">
        <input
          className={`auth-input ${studentPasswordMismatch ? "input-error" : ""}`}
          type={showStudentRegConfirmPassword ? "text" : "password"}
          required
          placeholder="Confirm Password"
          value={studentRegConfirmPassword}
          onChange={(e) => {
            setStudentRegConfirmPassword(e.target.value);
            setStudentPasswordMismatch(false);
          }}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() =>
            setShowStudentRegConfirmPassword(
              !showStudentRegConfirmPassword,
            )
          }
          aria-label="Toggle password visibility"
        >
          {showStudentRegConfirmPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </div>
      {studentPasswordMismatch && (
        <p className="error-message">Passwords do not match</p>
      )}
    </div>
  </div>

  <div className="form-field-wrapper">
    <input
      className="auth-input"
      type="number"
      required
      placeholder="Semester"
      value={studentRegSemester}
      onChange={(e) => setStudentRegSemester(e.target.value)}
    />
  </div>
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
  <div className="form-field-wrapper">
    <div className="password-input-wrapper">
      <input
        className={`auth-input ${alumniPasswordMismatch ? "input-error" : ""}`}
        type={showAlumniRegPassword ? "text" : "password"}
        required
        placeholder="Password"
        value={alumniRegPassword}
        onChange={(e) => {
          setAlumniRegPassword(e.target.value);
          setAlumniPasswordMismatch(false);
        }}
      />
      <button
        type="button"
        className="password-toggle-btn"
        onClick={() =>
          setShowAlumniRegPassword(!showAlumniRegPassword)
        }
        aria-label="Toggle password visibility"
      >
        {showAlumniRegPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        )}
      </button>
    </div>
  </div>

  <div className="form-field-wrapper">
    <input
      className="auth-input"
      type="text"
      required
      placeholder="Department"
      value={alumniRegDepartment}
      onChange={(e) => setAlumniRegDepartment(e.target.value)}
    />
  </div>
</div>

<div className="form-row">
  <div className="form-field-wrapper">
    <div className="password-field-container">
      <div className="password-input-wrapper">
        <input
          className={`auth-input ${alumniPasswordMismatch ? "input-error" : ""}`}
          type={showAlumniRegConfirmPassword ? "text" : "password"}
          required
          placeholder="Confirm Password"
          value={alumniRegConfirmPassword}
          onChange={(e) => {
            setAlumniRegConfirmPassword(e.target.value);
            setAlumniPasswordMismatch(false);
          }}
        />
        <button
          type="button"
          className="password-toggle-btn"
          onClick={() =>
            setShowAlumniRegConfirmPassword(
              !showAlumniRegConfirmPassword,
            )
          }
          aria-label="Toggle password visibility"
        >
          {showAlumniRegConfirmPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          )}
        </button>
      </div>
      {alumniPasswordMismatch && (
        <p className="error-message">Passwords do not match</p>
      )}
    </div>
  </div>

  <div className="form-field-wrapper">
    <input
      className="auth-input"
      type="tel"
      required
      placeholder="Contact Number"
      value={alumniRegContactNo}
      onChange={(e) => setAlumniRegContactNo(e.target.value)}
    />
  </div>
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
