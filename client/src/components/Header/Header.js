import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ cartItemCount, onClickCart, showCartButton }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleCartClick = () => {
    if (showCartButton) {
      onClickCart();
    } else {
      navigate("/cart", { replace: true });
    }
  };

  const handleAddMoreClick = () => {
    navigate("/");
  };

  const headerStyles = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "black",
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    zIndex: 1000,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
  };

  const buttonStyles = {
    backgroundColor: "white",
    color: "black",
    marginRight: "10px",
  };

  const cartIconStyles = {
    color: "white",
    marginLeft: "10px",
    cursor: "pointer",
  };

  return (
    <div style={headerStyles}>
      {location.pathname === "/cart" ? (
        <Button onClick={handleAddMoreClick} style={buttonStyles}>
          Add More
        </Button>
      ) : (
        <Badge
          badgeContent={cartItemCount}
          color="primary"
          onClick={handleCartClick}
          style={{ cursor: "pointer" }}
        >
          <ShoppingCartIcon style={cartIconStyles} />
        </Badge>
      )}
    </div>
  );
};

export default Header;
