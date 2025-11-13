import prisma from "../lib/prisma.js";

// =============================
// GET HISTORY OF CURRENT USER
// =============================
export const getHistory = async (req, res) => {
  try {
    const historique = await prisma.historique.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(historique);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'historique" });
  }
};

// =============================
// HELPER FUNCTION TO ADD HISTORY
// =============================
export const addHistory = async (userId, actionType, actionDetails) => {
  try {
    await prisma.historique.create({
      data: {
        userId,
        action: actionType,
        details: actionDetails,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout dans l'historique :", error);
  }
};
