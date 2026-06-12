import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../style/VendorDashboard.css"; 
import SearchBar from "./SearchBar";
import { productService } from "../services/productService";
import Button from "./UI/Button";
import toast from 'react-hot-toast';
import Pagination from "./UI/Pagination"; 
import useDebounce from "../hooks/useDebounce";

export default function VendorDashboard() {
  const [data, setData] = useState([]);
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
    const getData = async () => {
      setLoading(true);
      try {
        const responseData = await productService.getAllProducts(currentPage, PAGE_SIZE, debouncedSearchQuery);
        setData(responseData.results);
        setTotalItems(responseData.count); 
      } catch (error) {
        console.log("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) getData();
  }, [currentPage, user, debouncedSearchQuery]);

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  const handleUpdate = (product) => {
    navigate(`/update-product/${product.id}`, { state: { product } });
  };

  const handleDelete = async (item) => {

    try {
      await productService.deleteProduct(item.id);
      setData((prevData) => prevData.filter((product) => product.id !== item.id));
      toast.success("Product Deleted");
    } catch (error) {
      console.error("Failed to delete product", error);
      toast.error("Failed to delete product");
    }
  };

  
  return (
    <div className="dashboard-container">
      {/* Top action section */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Vendor Inventory</h1>
        
        <div style={{ display: "flex", gap: "15px" }}>
          <Button className="btn-create" onClick={() => navigate("/create-product")}>
            + Create Product
          </Button>

          <Button 
            className=""
            style={{ backgroundColor: "#e53e3e", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }} 
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
      
      
      <SearchBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />
      
      
      {/* 3. FIXED: Inline loading switch prevents the dashboard layout from vanishing during API calls */}
      {loading ? (
        <h2 style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif", color: "#4a5568" }}>
          Loading Inventory...
        </h2>
      ) : data.length === 0 ? (
        <div className="empty-state">
          <p>No products listed yet. Click "+ Create Product" to get started.</p>
        </div>
      ) : (
        <div className="inventory-list">
          {/* Table Headers */}
          <div className="inventory-header-row">
            <span>Product Name</span>
            <span>Price</span>
            <span>Stock Level</span>
            <span style={{ textAlign: "center" }}>Action</span>
          </div>

          {/* Table Data Rows */}
          {data.map((item) => (
            <div
              className="inventory-row"
              key={item.id}
              onClick={() => handleUpdate(item)}
            >
              <span className="col-name">{item.name}</span>

              <span className="col-price">
                ${parseFloat(item.price).toFixed(2)}
              </span>

              <span className={`col-stock ${item.stock < 5 ? "low-stock" : ""}`}>
                {item.stock} units {item.stock < 5 && "(Low Stock)"}
              </span>

              <Button
                className="btn-delete"
                onClick={(e) => {
                  e.stopPropagation(); // Stops table row click event from firing
                  handleDelete(item);
                }}
              >
                Delete
              </Button>
            </div>
          ))}
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