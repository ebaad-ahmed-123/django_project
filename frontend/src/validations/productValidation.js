import * as Yup from "yup";

export const productSchema = Yup.object({
  name: Yup.string()
    .min(3, "Product name must be at least 3 characters long")
    .max(100, "Product name cannot exceed 100 characters")
    .required("Product name is required"),

  price: Yup.number()
    .typeError("Price must be a valid number")
    .positive("Price must be greater than $0")
    .required("Price is required"),

  stock: Yup.number()
    .typeError("Stock must be a valid number")
    .integer("Stock must be a whole number (no decimals)")
    .min(0, "Stock cannot be negative")
    .required("Stock level is required"),
});