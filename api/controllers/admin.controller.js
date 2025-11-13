// import prisma from "../lib/prisma.js";

// // Fetch all locataires
// export const getLocataires = async (req, res) => {
//   try {
//     const locataires = await prisma.user.findMany({
//       where: { role: "locataire" },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         avatar: true,
//         isBlocked: true,
//         createdAt: true,
//         locataireDetails: { select: { createdAt: true } },
//       },
//     });
//     res.status(200).json(locataires);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch locataires!" });
//   }
// };

// // Fetch all proprietaires
// export const getProprietaires = async (req, res) => {
//   try {
//     const proprietaires = await prisma.user.findMany({
//       where: { role: "proprietaire" },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         avatar: true,
//         isBlocked: true,
//         createdAt: true,
//         proprietaireDetail: { select: { bankAccount: true, createdAt: true } },
//       },
//     });
//     res.status(200).json(proprietaires);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch proprietaires!" });
//   }
// };

// // Fetch all properties
// export const getProperties = async (req, res) => {
//   try {
//     const properties = await prisma.post.findMany({
//       include: { user: { select: { id: true, username: true, role: true } } },
//     });
//     res.status(200).json(properties);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch properties!" });
//   }
// };

// // Block a locataire
// export const blockLocataire = async (req, res) => {
//   const { id } = req.params;
//   const { reason, blockedBy } = req.body;

//   try {
//     // Update user as blocked
//     const user = await prisma.user.update({
//       where: { id },
//       data: { isBlocked: true },
//     });

//     // Add to BlockedUser collection
//     await prisma.blockedUser.upsert({
//       where: { userId: id },
//       update: { reason, blockedBy },
//       create: { userId: id, reason, blockedBy },
//     });

//     res.status(200).json({ message: "Locataire blocked successfully", user });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to block locataire!" });
//   }
// };

// // Fetch all blocked locataires
// export const getBlockedLocataires = async (req, res) => {
//   try {
//     const blocked = await prisma.user.findMany({
//       where: { role: "locataire", isBlocked: true },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         avatar: true,
//         createdAt: true,
//         blockedUsers: { // include related BlockedUser info
//           select: {
//             reason: true,
//             blockedBy: true,
//             blockedAt: true,
//           },
//         },
//       },
//     });

//     // Flatten the blockedUsers info for easier use on frontend
//     const formatted = blocked.map(user => ({
//       ...user,
//       reason: user.blockedUsers[0]?.reason || null,
//       blockedBy: user.blockedUsers[0]?.blockedBy || null,
//       blockedAt: user.blockedUsers[0]?.blockedAt || null,
//     }));

//     res.status(200).json(formatted);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch blocked locataires!" });
//   }
// };

// // Block a proprietaire
// export const blockProprietaire = async (req, res) => {
//   const { id } = req.params;
//   const { reason, blockedBy } = req.body;

//   try {
//     const user = await prisma.user.update({
//       where: { id },
//       data: { isBlocked: true },
//     });

//     await prisma.blockedUser.upsert({
//       where: { userId: id },
//       update: { reason, blockedBy },
//       create: { userId: id, reason, blockedBy },
//     });

//     res.status(200).json({ message: "Proprietaire blocked successfully", user });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to block proprietaire!" });
//   }
// };

// // Fetch all blocked proprietaires
// export const getBlockedProprietaires = async (req, res) => {
//   try {
//     const blocked = await prisma.user.findMany({
//       where: { role: "proprietaire", isBlocked: true },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         avatar: true,
//         createdAt: true,
//         blockedUsers: {
//           select: {
//             reason: true,
//             blockedBy: true,
//             blockedAt: true,
//           },
//         },
//       },
//     });

//     const formatted = blocked.map(user => ({
//       ...user,
//       reason: user.blockedUsers[0]?.reason || null,
//       blockedBy: user.blockedUsers[0]?.blockedBy || null,
//       blockedAt: user.blockedUsers[0]?.blockedAt || null,
//     }));

//     res.status(200).json(formatted);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch blocked proprietaires!" });
//   }
// };

// export const unblockUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     await prisma.user.update({
//       where: { id },
//       data: { isBlocked: false },
//     });

//     await prisma.blockedUser.delete({
//       where: { userId: id },
//     });

//     res.status(200).json({ message: "User unblocked successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to unblock user!" });
//   }
// };

import prisma from "../lib/prisma.js";
import { addHistory } from "./historique.controller.js";   // ✅ Add history import

// Fetch all locataires
export const getLocataires = async (req, res) => {
  try {
    const locataires = await prisma.user.findMany({
      where: { role: "locataire" },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isBlocked: true,
        createdAt: true,
        locataireDetails: { select: { createdAt: true } },
      },
    });
    res.status(200).json(locataires);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch locataires!" });
  }
};

// Fetch all proprietaires
export const getProprietaires = async (req, res) => {
  try {
    const proprietaires = await prisma.user.findMany({
      where: { role: "proprietaire" },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isBlocked: true,
        createdAt: true,
        proprietaireDetail: { select: { bankAccount: true, createdAt: true } },
      },
    });
    res.status(200).json(proprietaires);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch proprietaires!" });
  }
};

// Fetch all properties
export const getProperties = async (req, res) => {
  try {
    const properties = await prisma.post.findMany({
      include: { user: { select: { id: true, username: true, role: true } } },
    });
    res.status(200).json(properties);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch properties!" });
  }
};

// =============================
// BLOCK A LOCATAIRE
// =============================
export const blockLocataire = async (req, res) => {
  const { id } = req.params;
  const { reason, blockedBy } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: true },
    });

    await prisma.blockedUser.upsert({
      where: { userId: id },
      update: { reason, blockedBy },
      create: { userId: id, reason, blockedBy },
    });

    // ✅ Add History
    await addHistory(
      blockedBy,
      "LOCATAIRE_BLOQUÉ",
      `L'utilisateur ${user.username} a été bloqué pour la raison : ${reason}`
    );

    res.status(200).json({ message: "Locataire blocked successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to block locataire!" });
  }
};

// Fetch all blocked locataires
export const getBlockedLocataires = async (req, res) => {
  try {
    const blocked = await prisma.user.findMany({
      where: { role: "locataire", isBlocked: true },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        blockedUsers: {
          select: {
            reason: true,
            blockedBy: true,
            blockedAt: true,
          },
        },
      },
    });

    const formatted = blocked.map((user) => ({
      ...user,
      reason: user.blockedUsers[0]?.reason || null,
      blockedBy: user.blockedUsers[0]?.blockedBy || null,
      blockedAt: user.blockedUsers[0]?.blockedAt || null,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch blocked locataires!" });
  }
};

// =============================
// BLOCK A PROPRIETAIRE
// =============================
export const blockProprietaire = async (req, res) => {
  const { id } = req.params;
  const { reason, blockedBy } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: true },
    });

    await prisma.blockedUser.upsert({
      where: { userId: id },
      update: { reason, blockedBy },
      create: { userId: id, reason, blockedBy },
    });

    // ✅ Add History
    await addHistory(
      blockedBy,
      "PROPRIETAIRE_BLOQUÉ",
      `L'utilisateur ${user.username} a été bloqué pour la raison : ${reason}`
    );

    res.status(200).json({ message: "Proprietaire blocked successfully", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to block proprietaire!" });
  }
};

// Fetch all blocked proprietaires
export const getBlockedProprietaires = async (req, res) => {
  try {
    const blocked = await prisma.user.findMany({
      where: { role: "proprietaire", isBlocked: true },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
        blockedUsers: {
          select: {
            reason: true,
            blockedBy: true,
            blockedAt: true,
          },
        },
      },
    });

    const formatted = blocked.map((user) => ({
      ...user,
      reason: user.blockedUsers[0]?.reason || null,
      blockedBy: user.blockedUsers[0]?.blockedBy || null,
      blockedAt: user.blockedUsers[0]?.blockedAt || null,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch blocked proprietaires!" });
  }
};

// =============================
// UNBLOCK USER
// =============================
export const unblockUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { isBlocked: false },
    });

    await prisma.blockedUser.delete({
      where: { userId: id },
    });

    // ✅ Add History
    await addHistory(
      "ADMIN",
      "UTILISATEUR_DÉBLOQUÉ",
      `L'utilisateur ${user.username} a été débloqué`
    );

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unblock user!" });
  }
};
