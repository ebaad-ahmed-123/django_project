import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api"; 
import "../style/Home.css"; 
import SearchBar from "./SearchBar";
import { productService } from "../services/productService";
import { orderService } from "../services/orderService";
import Button from "./UI/Button";
import toast from 'react-hot-toast';
import Pagination from "./UI/Pagination"; 
import useDebounce from "../hooks/useDebounce";

export default function Home() {
  const [data, setData] = useState([]);
  const [cartItems, setCartItems] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const PAGE_SIZE = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productsData = await productService.getAllProducts(currentPage, PAGE_SIZE, debouncedSearchQuery);
        setData(productsData.results);
        setTotalItems(productsData.count); 
        if (user) {
          const cartData = await orderService.getCartItems();
          setCartItems(cartData.results);
        }
      } catch (error) {
        console.log("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentPage, user, debouncedSearchQuery]);

  const getCartItem = (productId) => {
  if (!Array.isArray(cartItems)) return undefined;

  return cartItems.find((cartItem) => cartItem?.product?.id === productId);
};

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.error("Please login to continue shopping")
      return; 
    }

    try {
      await orderService.addToCart(product.id, 1);
      
      const cartData = await orderService.getCartItems();
      setCartItems(cartData.results);
      
    } catch (error) {
      console.log("Failed to add product:", error);
      toast.error("Failed to add product")
    }
  };

  const handleUpdateQuantity = async (orderItemId, currentQty, change) => {
    const newQty = currentQty + change;
    
    if (newQty < 1) {
      try {
        await orderService.removeCartItem(orderItemId);
        setCartItems((prev) => prev.filter((item) => item.id !== orderItemId));
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
      return;
    }

    try {
      await orderService.updateQuantity(orderItemId, newQty);
      setCartItems((prevData) => 
        prevData.map((item) => 
          item.id === orderItemId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
      toast.error("Failed to update product")
    }
  };


  const handleLogout = () => {
    logout(); 
    navigate("/login");
  };
  
  return (
    <div className="home-container">
      <h1 className="page-title">Catalog</h1>
      
      <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" , marginTop: "40px"}}>
        {user && (
          <>
            <Button className="" onClick={() => navigate("/cart")}>
              Show Cart
            </Button>
            
            <Button className="" onClick={() => navigate("/orders")}>
              Show Orders
            </Button>
          </>
        )}

        {user ? (
          <Button 
            className="" 
            style={{ backgroundColor: "#e53e3e", color: "white" }} 
            onClick={handleLogout}
          >
            Log Out
          </Button>
        ) : (
          <Button 
            className="" 
            style={{ backgroundColor: "#3182ce", color: "white" }} 
            onClick={() => navigate("/login")}
          >
            Log In / Register
          </Button>
        )}
      </div>

      
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {loading ? (
        <p style={{ textAlign: "center"}}>Loading products...</p>
      ) : (
        <div className="product-list">
          {data.length === 0 ? (
            <p style={{ textAlign: "center", color: "#718096" }}>
              No products found matching "{searchQuery}"
            </p>
          ) : (
            data.map((item) => {
              // Check if THIS specific product is in the cart
              const cartItem = getCartItem(item.id);

              return (
                <div className="product-row" key={item.id}>
                  <div className="product-info">
                    <span className="product-name">{item.name}</span>
                    <span className="product-price">${parseFloat(item.price).toFixed(2)}</span>
                    <span className="stock-status">
                      {item.stock > 0 ? (
                        <span className="in-stock">{item.stock} in stock</span>
                      ) : (
                        <span className="out-of-stock">Out of stock</span>
                      )}
                    </span>
                  </div>

                  <div className="product-actions">
                    {/* 5. NEW: Dynamic UI - Show +/- if in cart, otherwise show Add to Cart */}
                    {cartItem ? (
                      <div className="item-qty-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Button 
                          className="qty-btn" 
                          onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity, -1)}
                        >
                          −
                        </Button>
                        
                        <span className="qty-display" style={{ fontWeight: 'bold' }}>
                          {cartItem.quantity}
                        </span>
                        
                        <Button 
                          className="qty-btn" 
                          onClick={() => handleUpdateQuantity(cartItem.id, cartItem.quantity, 1)}
                          disabled={cartItem.quantity >= item.stock}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="btn-cart"
                        disabled={item.stock <= 0}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      {!loading && totalItems > 0 && (
        <Pagination 
          totalItems={totalItems}
          itemsPerPage={PAGE_SIZE}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)} 
        />
      )}
    </div>
  );
}