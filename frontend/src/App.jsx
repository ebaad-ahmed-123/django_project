import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from 'react-hot-toast';

import Home from './components/Home';
import Login from './components/Login';
import Cart from './components/Cart';
import VendorDashboard from './components/VendorDashboard';
import Unauthorized from './components/Unauthorized';
import Order from './components/Order'
import CreateProduct from './components/CreateProduct'
import UpdateProduct from './components/UpdateProduct'
import Register from "./components/Register";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/unauthorized", element: <Unauthorized /> },
  { 
    path: "/cart", 
    element: (
      <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
        <Cart />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/orders", 
    element: (
      <ProtectedRoute allowedRoles={["CUSTOMER", "ADMIN"]}>
        <Order />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/create-product", 
    element: (
      <ProtectedRoute allowedRoles={["VENDOR", "ADMIN"]}>
        <CreateProduct />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/update-product/:id", 
    element: (
      <ProtectedRoute allowedRoles={["VENDOR", "ADMIN"]}>
        <UpdateProduct />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/vendor/dashboard", 
    element: (
      <ProtectedRoute allowedRoles={["VENDOR", "ADMIN"]}>
        <VendorDashboard />
      </ProtectedRoute>
    ) 
  },
]);

function App() {  
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;