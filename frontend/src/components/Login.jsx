import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { userService } from "../services/userService";
import InputField from "./UI/InputField";
import Button from "./UI/Button";
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 
    setIsSubmitting(true);

    try {
      const userData = await userService.login(email, password);

      setData(userData);
      login(userData);
      if (userData.user.role === "VENDOR") {
        navigate("/vendor/dashboard");
      } else if (userData){
        navigate("/"); 
      }

    } catch (err) {
      toast.error("Incorrect Email or Password")
      console.error("Login failed:", err);
    } finally {
      setIsSubmitting(false); 
    }
  };

  const styles = {
    container: { maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" },
    input: { width: "100%", padding: "10px", boxSizing: "border-box" },
    button: { width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
    error: { color: "red", fontSize: "14px", marginBottom: "10px" }
  };

  return (
    <div style={styles.container}>
      <h2 style={{marginBottom:"25px"}}>Sign In</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} >
        <InputField
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required={true}
          style={styles.input}
        />
        
        <InputField
         type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={true}
          style={styles.input}
        />
        <Button 
          type="submit" 
          className="" 
          disabled={isSubmitting} 
          style={styles.button}
        >
          {isSubmitting ? "Signing in..." : "Login"}
        </Button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}