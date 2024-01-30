import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useDispatch, useSelector } from "react-redux";
import { updateQuantity, setCart } from "../../store/cartSlice";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleOrderDialogOpen = () => {
    setOrderDialogOpen(true);
  };

  const handleOrderDialogClose = () => {
    if (hasValidationErrors()) {
      console.log("Validation errors. Cannot close the dialog.");
    } else {
      resetOrderDialog();
    }
  };

  const hasValidationErrors = () =>
    Object.values(errors).some((error) => error !== "");

  const resetOrderDialog = () => {
    setOrderDialogOpen(false);
    setErrors({
      firstName: "",
      lastName: "",
      address: "",
    });
  };

  const handleOrderDetailsChange = (field, value) => {
    setOrderDetails((prevOrderDetails) => ({
      ...prevOrderDetails,
      [field]: value,
    }));
    validateOrderDetails(field, value);
  };

  const validateOrderDetails = (field, value) => {
    switch (field) {
      case "firstName":
        setErrors((prevErrors) => ({
          ...prevErrors,
          firstName: value.trim() ? "" : "First name is required.",
        }));
        break;
      case "lastName":
        setErrors((prevErrors) => ({
          ...prevErrors,
          lastName: value.trim() ? "" : "Last name is required.",
        }));
        break;
      case "address":
        setErrors((prevErrors) => ({
          ...prevErrors,
          address: value.trim() ? "" : "Address is required.",
        }));
        break;
      default:
        break;
    }
  };

  const placeOrder = () => {
    if (hasValidationErrors()) {
      return;
    }

    const validationErrors = {
      firstName: orderDetails.firstName.trim() ? "" : "First name is required.",
      lastName: orderDetails.lastName.trim() ? "" : "Last name is required.",
      address: orderDetails.address.trim() ? "" : "Address is required.",
    };

    if (Object.values(validationErrors).some((error) => error !== "")) {
      setErrors(validationErrors);
      console.log("Validation errors. Cannot place the order.");
      return;
    }

    const orderData = {
      firstName: orderDetails.firstName,
      lastName: orderDetails.lastName,
      address: orderDetails.address,
      products: cart.map((item) => ({
        name: item.title,
        quantity: item.quantity,
      })),
    };

    fetch("http://localhost:9000/api/orders/place-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((data) => {
        setSnackbarMessage(data.message);
        setSnackbarOpen(true);

        if (data.success) {
          console.log("Order placed successfully:", data);
          dispatch(setCart([]));
          resetOrderDialog();
        } else {
          console.log("Order placed unsuccessfully:", data);
        }
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        resetOrderDialog();
      });
  };

  const calculateTotal = () =>
    cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);

  return (
    <div>
      <Header />
      <div style={{ padding: "20px", textAlign: "center", marginTop: "5rem" }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {cart.map((item) => (
            <Paper
              key={item.id}
              elevation={3}
              style={{
                padding: "15px",
                marginBottom: "15px",
                width: "500px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{ width: "80px", height: "80px", marginRight: "15px" }}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div
                style={{ flexGrow: 1, textAlign: "left", minWidth: "200px" }}
              >
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body1" color="text.primary">
                  ${item.price} each
                </Typography>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  size="large"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.id,
                        quantity: item.quantity + 1,
                      })
                    )
                  }
                  style={{
                    borderRadius: "50%",
                    padding: "10px",
                    marginRight: "5px",
                    fontSize: "40px",
                    color: "green",
                  }}
                >
                  +
                </Button>
                <TextField
                  label="Qty"
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    dispatch(
                      updateQuantity({
                        productId: item.id,
                        quantity: e.target.value,
                      })
                    )
                  }
                  style={{
                    width: "70px",
                    textAlign: "center",
                    marginRight: "5px",
                  }}
                />
                <Button
                  size="large"
                  onClick={() =>
                    dispatch(
                      updateQuantity({
                        productId: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    )
                  }
                  style={{
                    borderRadius: "50%",
                    padding: "10px",
                    fontSize: "40px",
                    color: "red",
                  }}
                >
                  -
                </Button>
              </div>
            </Paper>
          ))}
        </div>
        <Typography variant="h6" style={{ marginTop: "15px" }}>
          Total: ${calculateTotal()}
        </Typography>

        <Dialog open={orderDialogOpen} onClose={handleOrderDialogClose}>
          <DialogTitle>Enter Your Details</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              fullWidth
              value={orderDetails.firstName}
              onChange={(e) =>
                handleOrderDetailsChange("firstName", e.target.value)
              }
              margin="normal"
              error={errors.firstName !== ""}
              helperText={errors.firstName}
            />
            <TextField
              label="Last Name"
              fullWidth
              value={orderDetails.lastName}
              onChange={(e) =>
                handleOrderDetailsChange("lastName", e.target.value)
              }
              margin="normal"
              error={errors.lastName !== ""}
              helperText={errors.lastName}
            />
            <TextField
              label="Address"
              fullWidth
              value={orderDetails.address}
              onChange={(e) =>
                handleOrderDetailsChange("address", e.target.value)
              }
              margin="normal"
              error={errors.address !== ""}
              helperText={errors.address}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleOrderDialogClose}>Cancel</Button>
            <Button onClick={placeOrder} color="primary">
              Confirm Order
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOrderDialogOpen}
            disabled={cart.length === 0}
          >
            Place Order
          </Button>
        </Grid>

        <Button onClick={() => navigate("/")} style={{ marginTop: "15px" }}>
          <ArrowBackIcon style={{ marginRight: "5px" }} />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Cart;
