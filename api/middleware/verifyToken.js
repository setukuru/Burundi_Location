import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  
  console.log("Cookies received:", req.cookies);
  console.log("Token present:", !!token);

  if (!token) {
    return res.status(401).json({ 
      message: "Not Authenticated! No token found.",
      code: "NO_TOKEN"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
    if (err) {
      console.error("JWT Verify Error:", err.message);
      return res.status(403).json({ 
        message: "Token is not Valid!",
        code: "INVALID_TOKEN",
        details: err.message
      });
    }
    
    // Verify user still exists and is not blocked
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
        select: { id: true, isBlocked: true }
      });

      if (!user || user.isBlocked) {
        return res.status(401).json({ 
          message: "User not found or account blocked",
          code: "USER_INVALID"
        });
      }

      req.userId = payload.id;
      console.log("Token verified for user:", payload.id);
      next();
    } catch (dbError) {
      console.error("Database error during token verification:", dbError);
      return res.status(500).json({ 
        message: "Server error during authentication",
        code: "SERVER_ERROR"
      });
    }
  });
};
