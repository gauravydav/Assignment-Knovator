import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import Header from "../Header/Header";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/cartSlice";

const truncateDescription = (description) => {
  const maxLength = 2 * 35;
  const truncatedText =
    description.length > maxLength
      ? `${description.substring(0, maxLength).trim()}...`
      : description;
  return truncatedText.split("\n").length > 1
    ? truncatedText.split("\n").slice(0, 2).join("\n")
    : truncatedText;
};

const ProductCard = ({ product, handleAddToCart, handleRemoveFromCart, isInCart }) => {
  const cardStyles = {
    margin: "10px",
    width: "250px",
    position: "relative",
  };

  const mediaContainerStyles = {
    overflow: "hidden",
    borderRadius: "8px",
    width: "100%",
    height: "150px",
  };

  return (
    <Card key={product.id} style={cardStyles}>
      <div style={mediaContainerStyles}>
        <CardMedia
          component="img"
          height="auto"
          image={product.image}
          alt={`Product: ${product.title}`}
          style={{
            width: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </div>
      <CardContent style={{ padding: "10px", textAlign: "center" }}>
        <Typography variant="h6" style={{ fontSize: "20px", marginBottom: "8px" }}>
          {product.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          style={{
            fontSize: "14px",
            height: "40px",
            overflow: "hidden",
          }}
        >
          {truncateDescription(product.description)}
        </Typography>
        <Typography
          variant="body1"
          color="text.primary"
          style={{
            fontSize: "16px",
            marginTop: "8px",
            fontWeight: "600",
          }}
        >
          ${product.price}
        </Typography>
        {isInCart(product.id) ? (
          <IconButton
            size="small"
            onClick={() => handleRemoveFromCart(product.id)}
            style={{ color: "red" }}
          >
            <RemoveShoppingCartIcon />
          </IconButton>
        ) : (
          <IconButton
            size="small"
            onClick={() => handleAddToCart(product)}
            style={{ color: "green" }}
          >
            <AddShoppingCartIcon />
          </IconButton>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 14;

  useEffect(() => {
    fetch("http://localhost:9000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleRemoveFromCart = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const isInCart = (productId) => cart.some((item) => item.id === productId);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Header
        cartItemCount={cart.length}
        onClickCart={() => setShowCart(!showCart)}
        showCartButton={!showCart}
      />
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "5rem" }}>
        {currentItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            handleAddToCart={handleAddToCart}
            handleRemoveFromCart={handleRemoveFromCart}
            isInCart={isInCart}
          />
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {[...Array(Math.ceil(products.length / itemsPerPage))].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            style={{
              padding: "8px",
              margin: "5px",
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: currentPage === index + 1 ? "#4CAF50" : "transparent",
              color: currentPage === index + 1 ? "white" : "black",
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
