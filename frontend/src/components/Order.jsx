import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Order.css"; 
import { orderService } from "../services/orderService";
import api from "../services/api";
import Pagination from "./UI/Pagination";

export default function Order() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = user?.access;

  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 5;

  useEffect(() => {
    const getData = async () => {
      try {
        const responseData = await orderService.getOrders(currentPage,PAGE_SIZE);
        setData(responseData.results); 
        setTotalItems(responseData.count);
      } catch (error) {
        console.log("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) getData();
  }, [user, currentPage]);

  // Helper to calculate the total cost of a single order
  const getOrderTotal = (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.product.price);
      return total + (price * item.quantity);
    }, 0);
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Orders...</h2>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">Order History</h1>
      
      {data.length === 0 ? (
        <p style={{ textAlign: "center" }}>You have no past orders.</p>
      ) : (
        // 1. Loop through the Orders
        data.map((order) => (
          <div className="order-card" key={order.id}>
            
            <div className="order-header">
              <span className="order-id">Order #{order.id}</span>
              <span className="order-status">{order.status}</span>
            </div>

            <div className="order-items-list">
              {order.items.length === 0 ? (
                <p style={{ color: "#7f8c8d" }}>No items found in this order.</p>
              ) : (
                // 2. Loop through the Items INSIDE the Order
                order.items.map((item) => (
                  <div className="order-item-row" key={item.id}>
                    <div className="item-details">
                      <span className="item-qty">{item.quantity}x</span>
                      <span className="item-name">{item.product.name}</span>
                    </div>
                    <span className="item-price">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="order-footer">
              Total: ${getOrderTotal(order.items).toFixed(2)}
            </div>

          </div>
        ))
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