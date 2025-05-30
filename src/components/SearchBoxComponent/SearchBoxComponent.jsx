import React, { useState } from "react";
import "../../assets/css/style.css";
import "../../assets/css/reset.css";
import styles from "./SearchBoxComponent.module.css";
import ButtonComponent from "../ButtonComponent/ButtonComponent";

const SearchBoxComponent = ({ onSearch, onButtonClick }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim()); // Gọi hàm onSearch với từ khóa
    } else {
      alert("Please add key word to search."); // Hiển thị cảnh báo nếu từ khóa trống
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={styles.search__wrapper}>
      <input
        className={styles.search__component}
        type="search"
        placeholder="Enter product's key word"
        aria-label="Search"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <ButtonComponent
        className="search__button"
        onClick={() => onButtonClick(query)}
      >
        Search
      </ButtonComponent>
    </div>
  );
};

export default SearchBoxComponent;
