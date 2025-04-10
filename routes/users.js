import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { ObjectId } from "mongodb";
import {
  genPassword,
  insertOrder,
  createUser,
  getUserByEmail,
  getUserById,
  getOrders,
  deleteOrderById,
  getAllUser,
  getUserDetail,
} from "../helpers.js";
import { isAuthenticated } from "../middleware/auth.js";
router.post("/signup", async (req, res) => {
  const {
    username,
    password,
    email,
    country,
    street,
    city,
    state,
    postalCode,
    phonenumber,
  } = req.body;
  console.log(req.body);
  const isUserExist = await getUserByEmail(email);
  console.log("User exists:", isUserExist);
  if (isUserExist) {
    res.status(400).send({ error: "user already exists" });
    return;
  }
  if (
    !/^(?=.*?[0-9])(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[!@#$%^&*()]).{8,}$/g.test(
      password
    )
  ) {
    res.status(400).send({ error: "password doesnt match" });
    return;
  }

  const hashedPassword = await genPassword(password);
  const result = await createUser(
    username,
    hashedPassword,
    email,
    country,
    street,
    city,
    state,
    postalCode,
    phonenumber
  );
  res.status(201).json({ message: "successfully created" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFromDb = await getUserByEmail(email);
    if (!userFromDb) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, userFromDb.password);
    if (!isPasswordMatch) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: userFromDb._id, role: userFromDb.role },
      process.env.secret_key,
      { expiresIn: "1h" }
    );
    console.log(userFromDb.role);
    res.status(200).send({
      message: "Login successful",
      token,
      role: userFromDb.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// router.get(
//   "/get-users",

//   async (req, res) => {
//     const result = await getAllUser();
//     res.send(result);
//   }
// );

router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const user = await getUserById(req.user._id); // Get user data by user ID
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/orders", isAuthenticated, async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;

    // Generate random order ID
    const orderId = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Fetch user details (assuming user data is stored in `users` collection)
    const user = await getUserById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare the order data
    const order = {
      orderId,
      userId,
      username: user.username,
      email: user.email,
      products,
      totalAmount,
      orderDate: new Date(),
    };

    // Insert the order into the `orders` collection
    await insertOrder(order);

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to place order" });
  }
});



router.get("/ordersdata",isAuthenticated, async (req, res) => {
  try {
    const orders = await getOrders();
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});


router.delete("/orders/:orderId", isAuthenticated, async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await deleteOrderById(orderId);

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("Error deleting order:", err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

export const usersRouter = router;


