import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters")
    .required("Full Name is required"),
    
  email: Yup.string()
    .email("Invalid email address format")
    .required("Email address is required"),
    
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
    
  role: Yup.string()
    .oneOf(["CUSTOMER", "VENDOR"], "Invalid role selected")
    .required("Account type selection is required"),
});