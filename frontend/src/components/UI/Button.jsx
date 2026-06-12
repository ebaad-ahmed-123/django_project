export default function Button({ 
  children, 
  type = "button", 
  onClick, 
  disabled = false, 
  className = "btn-submit",
  style 
}) {
  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick} 
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}