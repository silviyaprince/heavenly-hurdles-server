import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { productsRouter } from "./routes/products.js";
const app = express();
const PORT = 8000;
app.use(express.json());
//process.env.MONGO_URL;
const MONGO_URL = "mongodb://127.0.0.1:27017";

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("mongodb is connected");
  return client;
}

export const client = await createConnection();

app.get("/", (req, res) => {
  res.send("hello everyone😄😄😁");
});




app.listen(PORT,console.log("server started on port",PORT))

app.use("/products",productsRouter)