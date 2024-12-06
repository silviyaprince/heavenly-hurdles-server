import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import {
  genPassword,
  createUser,
  getUserByEmail,
  getAllUser,
  getUserData,
} from "../helpers.js";
import { auth } from "../middleware/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
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
    postalCode
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
console.log(userFromDb.role)
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

router.get(
  "/get-users",
  verifyToken,
  authorizeRole("admin"),
  async (req, res) => {
    const result = await getAllUser();
    res.send(result);
  }
);

router.get('/user', auth, async (req, res) => {
  try {
    const user = await getUserData(req.user._id); // Get user data by user ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
  
export const usersRouter = router;
