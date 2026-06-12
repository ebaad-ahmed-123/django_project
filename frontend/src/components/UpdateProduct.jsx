import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import { productService } from "../services/productService";
import { productSchema } from "../validations/productValidation";
import InputField from "./UI/InputField";
import Button from "./UI/Button";
import toast from 'react-hot-toast';
import "../style/CreateProduct.css"; 
import "../style/Home.css"; 

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = user?.access;
  
  const location = useLocation();
  const product = location.state?.product || {};

  const formik = useFormik({
    initialValues: {
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
    },
    validationSchema: productSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const productPayload = {
        name: values.name.trim(),
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
      };

      try {
        await productService.updateProduct(id, productPayload);
        toast.success("Product Saved");
        navigate("/vendor/dashboard"); 
      } catch (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to Update Product");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="form-container">
      <h2 className="form-title">Update Item</h2>
      
      <form onSubmit={formik.handleSubmit}>
        
        <InputField 
          label="Product Title / Name"
          id="productName"
          name="name"
          type="text"
          placeholder="e.g., Ceramic Coffee Mug"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="form-group"
          error={formik.errors.name}
          touched={formik.touched.name}
        />
        <div className="form-row">
          <InputField
            label="Price"
            id="productPrice"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-group"
            error={formik.errors.price}
            touched={formik.touched.price}
          />
          <InputField
            label="Initial Stock Level"
            id="productStock"
            name="stock"
            type="number"
            step="1"
            min="0"
            placeholder="0"
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="form-group"
            error={formik.errors.stock}
            touched={formik.touched.stock}
          />
        </div>

        <div className="form-actions">
          <Button 
            className="btn-secondary" 
            onClick={() => navigate(-1)} 
            disabled={formik.isSubmitting}
            type="button"
          >
            Cancel
          </Button>

          <Button 
            type="submit" 
            className="btn-primary" 
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Saving Entry..." : "Update"}
          </Button>
        </div>

      </form>
    </div>
  );
}