exports.placeOrder = (req, res) => {
    const { firstName, lastName, address, products } = req.body;
  

    if (!firstName || !lastName || !address || !products) {
      return res.status(400).json({
        error:
          "Invalid request. Please provide first name, last name, address, and products.",
      });
    }
  
    console.log("Order Details:");
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Address: ${address}`);
    console.log("Products:");
    products.forEach((product) => {
      console.log(` - ${product.name}, Quantity: ${product.quantity}`);
    });
  
    res.json({ success: true, message: "Order placed successfully." });
  };
  