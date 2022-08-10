require("./db/connection");
const express = require("express");
const app = express();

const PORT = process.env["port"] || 3000;

const productRouter = require("./routes/product");
const userRouter = require("./routes/user");

app.use(express.json());
app.use(userRouter);
app.use(productRouter);

app.listen(PORT, () => {
  console.log("server started at port " + PORT);
});
