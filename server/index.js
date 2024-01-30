const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const productsRouter = require("./routes/products");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

