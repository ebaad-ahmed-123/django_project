import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"; 
import { userService } from "../services/userService";
import "../style/Register.css";
import InputField from "./UI/InputField";
import SelectField from "./UI/SelectField";
import Button from "./UI/Button";
import toast from 'react-hot-toast';
import { registerSchema } from "../validations/authValidation";

export default function Register() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const roleOptions = [
    { value: "CUSTOMER", label: "Customer" },
    { value: "VENDOR", label: "Vendor" }
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "CUSTOMER",
    },
    validationSchema: registerSchema,

    onSubmit: async (values, { setSubmitting }) => {
      setErrorMessage("");

      const registerPayload = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
        role: values.role,
      };

      try {
        await userService.register(registerPayload);
        toast.success("Registration successful")
        navigate("/");
      } catch (error) {
        console.error("Registration failed:", error);
        if (error.response && error.response.data) {
          const errorKey = Object.keys(error.response.data)[0];
          setErrorMessage(error.response.data[errorKey] || "Failed to register.");
        } else {
          setErrorMessage("A network error occurred.");
        }
      } finally {
        setSubmitting(false); 
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create an Account</h2>
        
        {errorMessage && (
          <div style={{ backgroundColor: "#fed7d7", color: "#c53030", padding: "10px", borderRadius: "6px", marginBottom: "15px", textAlign: "center" }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          
          <InputField 
            label="Full Name"
            id="name"
            name="name" 
            placeholder="e.g., John Doe"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur} 
            error={formik.errors.name}
            touched={formik.touched.name}
          />
          <InputField 
            label="Email Address"
            id="email"
            name="email" 
            type="email"
            placeholder="name@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
          <InputField 
            label="Password"
            id="password"
            name="password" 
            type="password"
            placeholder="Create a strong password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />
          <SelectField 
            label="Account Type"
            id="role"
            name="role" 
            value={formik.values.role}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={roleOptions}
          />

          <Button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Creating Account..." : "Register"}
          </Button>

        </form>

        <div className="auth-footer">
          Already have an account?{" "}
          <Button className="auth-link" onClick={() => navigate("/login")}>
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}