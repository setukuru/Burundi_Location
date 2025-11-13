import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { addHistory } from "./historique.controller.js"; // ✅ IMPORT

// =============================
// UNIFIED REGISTER
// =============================
// Only "locataire" and "proprietaire" can register through API.
// Admin accounts must always be created via seed script or DB insert.
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!["locataire", "proprietaire"].includes(role)) {
    return res.status(400).json({
      message:
        "Invalid role! Only locataire or proprietaire can self-register.",
    });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    if (role === "proprietaire") {
      await prisma.proprietaireDetails.create({
        data: {
          user: { connect: { id: newUser.id } },
          bankAccount: "",
        },
      });
    } else if (role === "locataire") {
      await prisma.locataire.create({
        data: {
          user: { connect: { id: newUser.id } },
        },
      });
    }

    // ✅ HISTORY: register event
    await addHistory(
      newUser.id,
      "REGISTER",
      `${role} '${username}' registered`
    );

    res
      .status(201)
      .json({ message: `${role} created successfully`, userId: newUser.id });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

// =============================
// UNIFIED LOGIN
// =============================
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        role: true,
        isBlocked: true,
        chatIDs: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    if (user.isBlocked) {
      const blockedRecord = await prisma.blockedUser.findFirst({
        where: { userId: user.id },
        orderBy: { blockedAt: "desc" },
      });

      return res.status(403).json({
        message: "Your account has been blocked.",
        reason: blockedRecord?.reason || "Violation of our policies.",
        contact: "support@yourapp.com",
      });
    }

    const age = 1000 * 60 * 60 * 24 * 7; // 7 days
    const tokenPayload = { id: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
      expiresIn: age,
    });

    const { password: _, ...userInfo } = user;

    // ✅ FIXED: Proper cookie configuration for cross-origin
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Required for HTTPS
        sameSite: "none", // Required for cross-origin
        maxAge: age,
        domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined, // Allow subdomains
      })
      .status(200)
      .json(userInfo);

    // ✅ HISTORY: login event
    await addHistory(
      user.id,
      "LOGIN",
      `${user.role} '${user.username}' logged in`
    );
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

// =============================
// LOGOUT
// =============================
export const logout = async (req, res) => {
  try {
    const token = req.cookies?.token;
    let userId;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        userId = payload.id;
      } catch (err) {
        console.log("Invalid token during logout:", err.message);
      }
    }

    if (userId) {
      // ✅ HISTORY: logout event
      await addHistory(userId, "LOGOUT", "User logged out");
    }

    // ✅ FIXED: Proper cookie clearing for cross-origin
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
      })
      .status(200)
      .json({ message: "Logout Successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Failed to logout!" });
  }
};
