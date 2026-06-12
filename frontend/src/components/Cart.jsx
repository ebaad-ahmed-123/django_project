import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Cart.css";
import { orderService } from "../services/orderService";
import Button from "./UI/Button";
import toast from 'react-hot-toast';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user?.access;
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await orderService.getCartItems();
        if (responseData && Array.isArray(responseData.results)) {
          setData(responseData.results); 
        } 
        else if (Array.isArray(responseData)) {
          setData(responseData);
        }
        else {
          setData([]); 
        }
      } catch (error) {
        console.log("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) getData();
  }, [user]);

  const cartTotal = useMemo(() => {
    return data.reduce((total, item) => {
      const price = parseFloat(item.product.price);
      const quantity = item.quantity || 1; 
      return total + (price * quantity);
    }, 0);
  }, [data]);

  const handleUpdateQuantity = useCallback(async (orderItemId, currentQty, change) => {
    const newQty = currentQty + change;
    
    if (newQty < 1) return; 

    try {
      await orderService.updateQuantity(orderItemId, newQty);

      setData((prevData) => 
        prevData.map((item) => 
          item.id === orderItemId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Could not Update Quantity")
    }
  }, []); 

  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);
    try {
      await orderService.checkoutOrder();
      toast.success("Order placed")
      setData([]); 
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Failed to checkout. Please try again")
    } finally {
      setIsCheckingOut(false);
    }
  }, []);

  const handleCancel = useCallback(async () => {
    setIsCanceling(true);
    try {
      await orderService.cancelOrder();
      setData([]); 
      toast.success("Order Canceled");
    } catch (error) {
      console.error("Cancel failed:", error);
      toast.error("Failed to cancel order")
    } finally {
      setIsCanceling(false);
    }
  }, []);

  const handleDelete = useCallback(async (orderItemId) => {
    try {   
      await orderService.removeCartItem(orderItemId);
      setData((prevData) => prevData.filter((item) => item.id !== orderItemId));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  }, []);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Cart...</h2>;

  return (
    
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {data.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is completely empty.</p>
          <Button 
            className="" 
            onClick={() => navigate("/")} 
            style={{ marginTop: "15px", padding: "10px 20px", cursor: "pointer" }}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <>
          <div className="cart-items-wrapper">
            {data.map((item) => (
              <div className="cart-item" key={item.id}>
                
                <div className="item-info">
                  <h3>{item.product.name}</h3>
                  
                  <div className="item-qty-controls">
                    <Button 
                      className="qty-btn" 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1 || isCheckingOut} 
                    >
                      −
                    </Button>
                    
                    <span className="qty-display">{item.quantity}</span>
                    
                    <Button 
                      className="qty-btn" 
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      disabled={isCheckingOut || item.quantity >= item.product.stock} 
                    >
                      +
                    </Button>
                  </div>
                  <Button 
                    className="btn-delete" onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>

                <div className="item-price">
                  ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="cart-actions">
              <Button 
                className="btn-cancel" 
                onClick={handleCancel}
                disabled={isCheckingOut || isCanceling}
              >
                {isCanceling ? "Canceling..." : "Cancel Order"}
              </Button>

              <Button 
                className="btn-checkout" 
                onClick={handleCheckout}
                disabled={isCheckingOut || isCanceling}
              >
                {isCheckingOut ? "Processing..." : "Checkout"}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}