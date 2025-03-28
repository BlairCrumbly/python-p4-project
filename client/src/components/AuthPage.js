import { useState, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { login, register } from "../Auth";
import '../styles/LoginStyle.css';

export default function AuthPage() {
  const { login: loginContext } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: isRegister ? Yup.string().email("Invalid email").required("Email is required") : Yup.string(),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = isRegister ? await register(values) : await login(values);

        if (data.id) {
          loginContext(data);
          navigate("/");
        } else {
          setMessage(data.message || "Something went wrong");
        }
      } catch (error) {
        setMessage("Error connecting to server");
      }
    },
  });

  return (
    <div className="auth-container">
      
      <div className="auth-card">
      <h1>Taskr</h1>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        <form onSubmit={formik.handleSubmit}>
          <input type="text" name="username" placeholder="Username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
          {formik.touched.username && formik.errors.username && <p className="error-text">{formik.errors.username}</p>}

          {isRegister && (
            <>
              <input type="email" name="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
              {formik.touched.email && formik.errors.email && <p className="error-text">{formik.errors.email}</p>}
            </>
          )}

          <input type="password" name="password" placeholder="Password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} required />
          {formik.touched.password && formik.errors.password && <p className="error-text">{formik.errors.password}</p>}

          <button type="submit" className="submit-btn">{isRegister ? "Register" : "Login"}</button>
        </form>
        {message && <p className="message-text">{message}</p>}

        <p>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button className="toggle-btn" onClick={() => setIsRegister(!isRegister)}>{isRegister ? "Login here" : "Register here"}</button>
        </p>
      </div>
    </div>
  );
}