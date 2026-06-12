import "../style/SearchBar.css";
import InputField from "./UI/InputField";
import Button from "./UI/Button";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    
    <InputField
      type="text"
      className="search-input"
      placeholder="Search for products..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}

    />
    
  );
}