import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/auth";
import API from "../../api/axios";
import * as socketService from "../../services/socketService";
import "./AuthPage.css";

// ─── Password Policy Validator ───────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length",    label: "At least 8 characters",       test: (p) => p.length >= 8 },
  { id: "uppercase", label: "At least one uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "At least one lowercase letter", test: (p) => /[a-z]/.test(p) },
  { id: "number",    label: "At least one number",          test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "At least one special character (!@#$...)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const validatePassword = (password) => {
  return PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) }));
};

const isPasswordValid = (password) => validatePassword(password).every((r) => r.passed);

const getPasswordError = (password) => {
  const failed = validatePassword(password).find((r) => !r.passed);
  return failed ? `Add ${failed.label.toLowerCase()}` : "";
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isEmailValid = (email) => EMAIL_REGEX.test(email);



// ─── Main Component ───────────────────────────────────────────────────────────
export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/verify")
        .then(() => navigate("/modules"))
        .catch(() => localStorage.removeItem("token"));
    }
  }, [navigate]);

  const [isStudent, setIsStudent] = useState(true);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationType, setRegistrationType] = useState("");

  // Login
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [showStudentPassword, setShowStudentPassword] = useState(false);
  const [studentLoginError, setStudentLoginError] = useState(false);

  const [alumniEmail, setAlumniEmail] = useState("");
  const [alumniPassword, setAlumniPassword] = useState("");
  const [showAlumniPassword, setShowAlumniPassword] = useState(false);
  const [alumniLoginError, setAlumniLoginError] = useState(false);

  // Student Registration
  const [studentRegFullName, setStudentRegFullName] = useState("");
  const [studentRegBatchNo, setStudentRegBatchNo] = useState("");
  const [studentRegNo, setStudentRegNo] = useState("");
  const [studentRegDepartment, setStudentRegDepartment] = useState("");
  const [studentRegSemester, setStudentRegSemester] = useState("");
  const [studentRegEmail, setStudentRegEmail] = useState("");
  const [studentRegEmailError, setStudentRegEmailError] = useState("");
  const [studentRegPassword, setStudentRegPassword] = useState("");
  const [studentRegConfirmPassword, setStudentRegConfirmPassword] = useState("");
  const [showStudentRegPassword, setShowStudentRegPassword] = useState(false);
  const [showStudentRegConfirmPassword, setShowStudentRegConfirmPassword] = useState(false);
  const [studentPasswordMismatch, setStudentPasswordMismatch] = useState(false);
  const [studentPasswordError, setStudentPasswordError] = useState("");

  // Alumni Registration
  const [alumniRegFullName, setAlumniRegFullName] = useState("");
  const [alumniRegNo, setAlumniRegNo] = useState("");
  const [alumniRegContactNo, setAlumniRegContactNo] = useState("");
  const [alumniRegDepartment, setAlumniRegDepartment] = useState("");
  const [alumniRegGradYear, setAlumniRegGradYear] = useState("");
  const [alumniRegEmail, setAlumniRegEmail] = useState("");
  const [alumniRegEmailError, setAlumniRegEmailError] = useState("");
  const [alumniRegPassword, setAlumniRegPassword] = useState("");
  const [alumniRegConfirmPassword, setAlumniRegConfirmPassword] = useState("");
  const [showAlumniRegPassword, setShowAlumniRegPassword] = useState(false);
  const [showAlumniRegConfirmPassword, setShowAlumniRegConfirmPassword] = useState(false);
  const [alumniPasswordMismatch, setAlumniPasswordMismatch] = useState(false);
  const [alumniPasswordError, setAlumniPasswordError] = useState("");

  const openStudentRegistration = () => { setRegistrationType("student"); setShowRegistration(true); };
  const openAlumniRegistration = () => { setRegistrationType("alumni"); setShowRegistration(true); };

  // ─── Login Handlers ───────────────────────────────────────────────────────
  const handleStudentLogin = async (e) => {
    e.preventDefault();
    if (!studentEmail || !studentPassword) return alert("Missing fields");
    try {
      setStudentLoginError(false);
      socketService.disconnect();
      const res = await loginUser(studentEmail, studentPassword, "student");
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/modules";
    } catch (err) {
      console.error("Login Error:", err);
      setStudentLoginError(true);
    }
  };

  const handleAlumniLogin = async (e) => {
    e.preventDefault();
    if (!alumniEmail || !alumniPassword) return alert("Missing fields");
    try {
      setAlumniLoginError(false);
      socketService.disconnect();
      const res = await loginUser(alumniEmail, alumniPassword, "alumni");
      const { token, user } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/modules";
    } catch (err) {
      console.error("Login Error:", err);
      setAlumniLoginError(true);
    }
  };

  // ─── Registration Handlers ────────────────────────────────────────────────
  const handleStudentRegistration = async (e) => {
    e.preventDefault();

    // Email format check
    if (!isEmailValid(studentRegEmail)) {
      setStudentRegEmailError("Please enter a valid email address");
      return;
    }

    // Password complexity check
    if (!isPasswordValid(studentRegPassword)) {
      setStudentPasswordError(getPasswordError(studentRegPassword));
      return;
    }

    // Confirm password check
    if (studentRegPassword !== studentRegConfirmPassword) {
      setStudentPasswordMismatch(true);
      return;
    }

    try {
      setStudentPasswordMismatch(false);
      setStudentPasswordError("");
      socketService.disconnect();
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
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        window.location.href = "/modules";
      }
    } catch (err) {
      const msg = err.response?.data?.message || (err.response ? "Registration failed" : "Cannot reach server. Is the backend running on the correct port?");
      alert(msg);
    }
  };

  const handleAlumniRegistration = async (e) => {
    e.preventDefault();

    // Email format check
    if (!isEmailValid(alumniRegEmail)) {
      setAlumniRegEmailError("Please enter a valid email address");
      return;
    }

    // Password complexity check
    if (!isPasswordValid(alumniRegPassword)) {
      setAlumniPasswordError(getPasswordError(alumniRegPassword));
      return;
    }

    // Confirm password check
    if (alumniRegPassword !== alumniRegConfirmPassword) {
      setAlumniPasswordMismatch(true);
      return;
    }

    try {
      setAlumniPasswordMismatch(false);
      setAlumniPasswordError("");
      socketService.disconnect();
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
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        window.location.href = "/modules";
      }
    } catch (err) {
      const msg = err.response?.data?.message || (err.response ? "Registration failed" : "Cannot reach server. Is the backend running on the correct port?");
      alert(msg);
    }
  };

  return (
    <main className="auth-main">
      {/* LOGIN CONTAINER */}
      <div className={`auth-container ${showRegistration ? "slide-up" : ""}`}>
        {/* MOBILE TOGGLE BAR */}
        <div className="mobile-auth-toggle">
          <button className={isStudent ? "active" : ""} onClick={() => setIsStudent(true)}>Student Login</button>
          <button className={!isStudent ? "active" : ""} onClick={() => setIsStudent(false)}>Alumni Login</button>
        </div>

        {/* STUDENT LOGIN */}
        <div className={`auth-panel student-sign-in-panel ${isStudent ? "active" : "hidden-left"}`}>
          <h2 className="login-form-panel-title">Student Login</h2>
          <form className="auth-form" onSubmit={handleStudentLogin}>
            <input
              type="email" required placeholder="Enter Email"
              value={studentEmail}
              onChange={(e) => { setStudentEmail(e.target.value); setStudentLoginError(false); }}
              className={`auth-input ${studentLoginError ? "input-error" : ""}`}
            />
            <div className="password-field-container">
              <div className="password-input-wrapper">
                <input
                  type={showStudentPassword ? "text" : "password"} required placeholder="Enter Password"
                  value={studentPassword}
                  onChange={(e) => { setStudentPassword(e.target.value); setStudentLoginError(false); }}
                  className={`auth-input ${studentLoginError ? "input-error" : ""}`}
                />
                <button type="button" className="password-toggle-btn" onClick={() => setShowStudentPassword(!showStudentPassword)} aria-label="Toggle password visibility">
                  {showStudentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {studentLoginError && <p className="error-message">Invalid email or password</p>}
            </div>

            <div className="forgot-container">
              <a href="#" className="forgot-password-link">
                Forgot Password?
              </a>
            </div>
            <div className="auth-button-container">
              <button type="submit" className="auth-button student-sign-in-button">Sign In</button>
            </div>
            <p className="register-link" onClick={openStudentRegistration}>Register as Student</p>
          </form>
        </div>

        {/* ALUMNI LOGIN */}
        <div className={`auth-panel Alumni-sign-in-panel ${isStudent ? "hidden-right" : "active"}`}>
          <h2 className="login-form-panel-title">Alumni Login</h2>
          <form className="auth-form" onSubmit={handleAlumniLogin}>
            <input
              type="email" required placeholder="Enter Email"
              value={alumniEmail}
              onChange={(e) => { setAlumniEmail(e.target.value); setAlumniLoginError(false); }}
              className={`auth-input ${alumniLoginError ? "input-error" : ""}`}
            />
            <div className="password-field-container">
              <div className="password-input-wrapper">
                <input
                  type={showAlumniPassword ? "text" : "password"} required placeholder="Enter Password"
                  value={alumniPassword}
                  onChange={(e) => { setAlumniPassword(e.target.value); setAlumniLoginError(false); }}
                  className={`auth-input ${alumniLoginError ? "input-error" : ""}`}
                />
                <button type="button" className="password-toggle-btn" onClick={() => setShowAlumniPassword(!showAlumniPassword)} aria-label="Toggle password visibility">
                  {showAlumniPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {alumniLoginError && <p className="error-message">Invalid email or password</p>}
            </div>

            <div className="forgot-container">
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
        <div className={`auth-panel middle-panel ${isStudent ? "middle-right" : "middle-left"}`}>
          <img src="/Round-Logo-USP.png" alt="University Logo" className="middle-panel-logo" />
          <button onClick={() => setIsStudent(!isStudent)} className="toggle-button">
            {isStudent ? "Alumni Login" : "Student Login"}
          </button>
        </div>
      </div>

      {/* STUDENT REGISTRATION */}
      <div className={`registration-container ${showRegistration && registrationType === "student" ? "slide-up-active" : ""}`}>
        <form className="registration-panel" onSubmit={handleStudentRegistration}>
          <div className="registration-monogram">
            <img src="/USP_RL.png" alt="Monogram" />
          </div>
          <h2 className="registration-form-panel-title">Student Registration</h2>
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
                placeholder="Registration Number  (e.g. BSCS-021....)"
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
                placeholder="Department  (e.g. Computer Science)"
                required
                value={studentRegDepartment}
                onChange={(e) => setStudentRegDepartment(e.target.value)}
              />
              <div className="form-field-wrapper">
                <input
                  className={`auth-input ${studentRegEmailError ? "input-error" : ""}`}
                  placeholder="Email" type="email" required
                  value={studentRegEmail}
                  onChange={(e) => { setStudentRegEmail(e.target.value); setStudentRegEmailError(""); }}
                />
                {studentRegEmailError && <p className="error-message">{studentRegEmailError}</p>}
              </div>
              <div className="form-field-wrapper">
                <input className="auth-input" placeholder="Department" required value={studentRegDepartment} onChange={(e) => setStudentRegDepartment(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field-wrapper">
                <div className="password-input-wrapper">
                  <input
                    className={`auth-input ${studentPasswordError ? "input-error" : ""}`}
                    type={showStudentRegPassword ? "text" : "password"} required placeholder="Password"
                    value={studentRegPassword}
                    onChange={(e) => { setStudentRegPassword(e.target.value); setStudentPasswordMismatch(false); setStudentPasswordError(""); }}
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowStudentRegPassword(!showStudentRegPassword)} aria-label="Toggle password visibility">
                    {showStudentRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {studentPasswordError && <p className="error-message">{studentPasswordError}</p>}
              </div>
              <div className="form-field-wrapper">
                <input
                  className="auth-input"
                  type="tel"
                  required
                  placeholder="Batch No  (e.g. 2022)"
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
                      type={showStudentRegConfirmPassword ? "text" : "password"} required placeholder="Confirm Password"
                      value={studentRegConfirmPassword}
                      onChange={(e) => { setStudentRegConfirmPassword(e.target.value); setStudentPasswordMismatch(false); }}
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowStudentRegConfirmPassword(!showStudentRegConfirmPassword)} aria-label="Toggle password visibility">
                      {showStudentRegConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {studentPasswordMismatch && <p className="error-message">Passwords do not match</p>}
                </div>
              </div>
              <div className="form-field-wrapper">
                <input
                  className="auth-input"
                  type="number"
                  required
                  placeholder="Semester  (e.g. 5)"
                  value={studentRegSemester}
                  onChange={(e) => setStudentRegSemester(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="auth-button registration-button">Register</button>
            <p className="back-to-login-link" onClick={() => setShowRegistration(false)}>Back to Login</p>
          </div>
        </form>
      </div>

      <div className={`registration-container ${showRegistration && registrationType === "alumni" ? "slide-up-active" : ""}`}>
        <form className="registration-panel" onSubmit={handleAlumniRegistration}>
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
                placeholder="Registration Number,  (e.g. BSCS-021....)"
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
                placeholder="Graduation Year,  (e.g. 2024)"
                value={alumniRegGradYear}
                onChange={(e) => setAlumniRegGradYear(e.target.value)}
              />
              <div className="form-field-wrapper">
                <input
                  className={`auth-input ${alumniRegEmailError ? "input-error" : ""}`}
                  placeholder="Email" type="email" required
                  value={alumniRegEmail}
                  onChange={(e) => { setAlumniRegEmail(e.target.value); setAlumniRegEmailError(""); }}
                />
                {alumniRegEmailError && <p className="error-message">{alumniRegEmailError}</p>}
              </div>
              <div className="form-field-wrapper">
                <input className="auth-input" type="text" required placeholder="Graduation Year" value={alumniRegGradYear} onChange={(e) => setAlumniRegGradYear(e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field-wrapper">
                <div className="password-input-wrapper">
                  <input
                    className={`auth-input ${alumniPasswordError ? "input-error" : ""}`}
                    type={showAlumniRegPassword ? "text" : "password"} required placeholder="Password"
                    value={alumniRegPassword}
                    onChange={(e) => { setAlumniRegPassword(e.target.value); setAlumniPasswordMismatch(false); setAlumniPasswordError(""); }}
                  />
                  <button type="button" className="password-toggle-btn" onClick={() => setShowAlumniRegPassword(!showAlumniRegPassword)} aria-label="Toggle password visibility">
                    {showAlumniRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {alumniPasswordError && <p className="error-message">{alumniPasswordError}</p>}
              </div>
              <div className="form-field-wrapper">
                <input
                  className="auth-input"
                  type="text"
                  required
                  placeholder="Department,  (e.g. Computer Science)"
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
                      type={showAlumniRegConfirmPassword ? "text" : "password"} required placeholder="Confirm Password"
                      value={alumniRegConfirmPassword}
                      onChange={(e) => { setAlumniRegConfirmPassword(e.target.value); setAlumniPasswordMismatch(false); }}
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowAlumniRegConfirmPassword(!showAlumniRegConfirmPassword)} aria-label="Toggle password visibility">
                      {showAlumniRegConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {alumniPasswordMismatch && <p className="error-message">Passwords do not match</p>}
                </div>
              </div>
              <div className="form-field-wrapper">
                <input
                  className="auth-input"
                  type="tel"
                  required
                  placeholder="Contact Number  (e.g. +923001234567)"
                  value={alumniRegContactNo}
                  onChange={(e) => setAlumniRegContactNo(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="auth-button registration-button">Register</button>
            <p className="back-to-login-link" onClick={() => setShowRegistration(false)}>Back to Login</p>
          </div>
        </form>
      </div>
    </main>
  );
}