import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./Adminauth.css";

export default function AdminAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/auth/verify")
        .then((res) => {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user?.role === "admin") {
            navigate("/modules", { replace: true });
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setLoginError(false);
      setIsLoading(true);

      const res = await API.post("/auth/login/admin", {
        email,
        password,
      });

      const { token, user } = res.data.data;

      if (user.role !== "admin") {
        setLoginError(true);
        setIsLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      navigate("/modules", { replace: true }, { replace: true });
    } catch (err) {
      console.error("Admin Login Error:", err);
      setLoginError(true);
      setIsLoading(false);
    }
  };

  return (
    <main className="admin-auth-main">
      <div className="admin-auth-container">
        {/* Admin Login Panel */}
        <div className="admin-auth-panel">
          <div className="admin-logo-container">
            <img
              src="/Round-Logo-USP.png"
              alt="University Logo"
              className="admin-logo"
            />
          </div>

          <h2 className="admin-panel-title">Admin Portal</h2>
          <p className="admin-subtitle">Access restricted to authorized administrators only</p>

          <form className="admin-auth-form" onSubmit={handleAdminLogin}>
            <input
              type="email"
              required
              placeholder="Admin Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setLoginError(false);
              }}
              className={`admin-input ${loginError ? "input-error" : ""}`}
              disabled={isLoading}
            />

            <div className="admin-password-field">
              <div className="admin-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError(false);
                  }}
                  className={`admin-input ${loginError ? "input-error" : ""}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {loginError && (
                <p className="admin-error-message">
                  Invalid credentials or unauthorized access
                </p>
              )}
            </div>



            <button
              type="submit"
              className="admin-button"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Access Admin Portal"}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}