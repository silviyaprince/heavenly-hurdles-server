import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
// import { ObjectId } from "mongodb";
import {
  updateUserPasswordByToken,
  getUserByResetToken,
  updateUserResetToken,
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

//-----------

router.post("/resetpassword", async (req, res) => {
  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).json({ error: "invalid credentials" });
  }
  const token = Math.random().toString(36).slice(-8);
  await updateUserResetToken(req.body.email, token);

  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    port: 465,
    secure: true,
    auth: {
      user: "silviya.prince16@zohomail.in",
      pass: process.env.PASS_KEY,
    },
  });
  const resetLink = `http://localhost:3000/users/resetpassword/${token}`;
  const message = {
    from: "silviya.prince16@zohomail.in",
    to: user.email,
    subject: "PASSWORD RESET REQUEST",
    text: `You are receiving this email because you requested for password reset of your account.\n\n.Use the following link  ${resetLink}  to reset password.`,
  };

  await transporter.sendMail(message, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      res.status(500).json({ error: "Error sending email" });
    } else {
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Password reset email sent" });
    }
  });
});

router.get("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;

  // Find the user by the token and ensuring it's still valid
  const user = await getUserByResetToken(token);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }

  // If token is valid, proceed with showing the reset password form
  res
    .status(200)
    .json({ message: "Token valid. You can now reset your password." });
});

router.post("/resetpassword/update", async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await getUserByResetToken(token);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

await updateUserPasswordByToken(token, hashedPassword);

  res.status(200).json({ message: "Password has been reset successfully!" });
});








export const usersRouter = router;


