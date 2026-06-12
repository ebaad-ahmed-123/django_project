import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    
    const storedUser = localStorage.getItem("ecommerce_user");
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Grab the token. (Checking both 'accessToken' and 'access' just to be safe based on how you saved it!)
        const token = parsedUser.accessToken || parsedUser.access;
        
        // If we found a token, stamp it onto the Authorization header!
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error parsing user from local storage in interceptor", error);
      }
    }
    
    return config; // Send the request on its way to Django
  },
  (error) => {
    // If something goes wrong before the request even sends
    return Promise.reject(error);
  }
);

export default api;