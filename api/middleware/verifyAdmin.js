import prisma from "../lib/prisma.js";
import { verifyToken } from "./verifyToken.js";

export const verifyAdmin = async (req, res, next) => {
  // First, check if user is authenticated
  verifyToken(req, res, async () => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        select: { role: true },
      });

      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.role !== "admin")
        return res.status(403).json({ message: "Access denied: Admins only" });

      next();
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error" });
    }
  });
};
