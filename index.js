import express from "express";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { productsRouter } from "./routes/products.js";
import { usersRouter } from "./routes/users.js";
const app = express();
const PORT = 8000;
app.use(express.json());
//"mongodb://127.0.0.1:27017";
//
const MONGO_URL = process.env.MONGO_URL;

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


app.use("/users",usersRouter)
app.use("/products",productsRouter)
app.listen(PORT,console.log("server started on port",PORT))

