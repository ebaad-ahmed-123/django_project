import Button from "./Button";

export default function Pagination({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange 
}) {

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div 
      className="pagination-container" 
      style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "30px", paddingBottom: "20px" }}
    >
      <Button 
        className=""
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        style={{ 
          padding: "8px 16px", 
          backgroundColor: currentPage === 1 ? "#e2e8f0" : "#edf2f7",
          color: currentPage === 1 ? "#a0aec0" : "#2d3748",
          cursor: currentPage === 1 ? "not-allowed" : "pointer"
        }}
      >
        Prev
      </Button>

      {pages.map((page) => (
        <Button 
          key={page} 
          className=""
          onClick={() => onPageChange(page)}
          style={{ 
            padding: "8px 16px",
            backgroundColor: currentPage === page ? "#3182ce" : "#edf2f7",
            color: currentPage === page ? "white" : "#2d3748",
            fontWeight: currentPage === page ? "bold" : "normal",
            cursor: "pointer"
          }}
        >
          {page}
        </Button>
      ))}

      <Button 
        className=""
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        style={{ 
          padding: "8px 16px", 
          backgroundColor: currentPage === totalPages ? "#e2e8f0" : "#edf2f7",
          color: currentPage === totalPages ? "#a0aec0" : "#2d3748",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer"
        }}
      >
        Next
      </Button>
    </div>
  );
}