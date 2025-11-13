// import prisma from "../lib/prisma.js";
// import bcrypt from "bcrypt";

// // GET ALL USERS
// export const getUsers = async (req, res) => {
//   try {
//     const users = await prisma.user.findMany({
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         avatar: true,
//         isBlocked: true,
//         createdAt: true,
//         adminDetails: { select: { permissions: true, createdAt: true } },
//         proprietaireDetail: { select: { bankAccount: true, createdAt: true } },
//         locataireDetails: { select: { createdAt: true } },
//       },
//     });
//     res.status(200).json(users);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get users!" });
//   }
// };

// // GET SINGLE USER
// export const getUser = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         avatar: true,
//         isBlocked: true,
//         createdAt: true,
//         adminDetails: { select: { permissions: true, createdAt: true } },
//         proprietaireDetail: { select: { bankAccount: true, createdAt: true } },
//         locataireDetails: { select: { createdAt: true } },
//       },
//     });

//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get user!" });
//   }
// };

// // UPDATE USER
// export const updateUser = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;
//   const { password, avatar, ...inputs } = req.body;

//   if (id !== tokenUserId) {
//     return res.status(403).json({ message: "Not Authorized!" });
//   }

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data: {
//         ...inputs,
//         ...(password && { password: await bcrypt.hash(password, 10) }),
//         ...(avatar && { avatar }),
//       },
//       select: {
//         id: true,
//         username: true,
//         email: true,
//         role: true,
//         avatar: true,
//         createdAt: true,
//         adminDetails: { select: { permissions: true } },
//         proprietaireDetail: { select: { bankAccount: true } },
//         locataireDetails: { select: { createdAt: true } },
//       },
//     });

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to update user!" });
//   }
// };

// // DELETE USER
// export const deleteUser = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   if (id !== tokenUserId) {
//     return res.status(403).json({ message: "Not Authorized!" });
//   }

//   try {
//     await prisma.user.delete({ where: { id } });
//     res.status(200).json({ message: "User deleted" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete user!" });
//   }
// };

// // SAVE / UNSAVE POST (unchanged)
// export const savePost = async (req, res) => {
//   const postId = req.body.postId;
//   const tokenUserId = req.userId;

//   try {
//     const savedPost = await prisma.savedPost.findUnique({
//       where: { userId_postId: { userId: tokenUserId, postId } },
//     });

//     if (savedPost) {
//       await prisma.savedPost.delete({ where: { id: savedPost.id } });
//       res.status(200).json({ message: "Post removed from saved list" });
//     } else {
//       await prisma.savedPost.create({
//         data: { userId: tokenUserId, postId },
//       });
//       res.status(200).json({ message: "Post saved" });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to save/unsave post!" });
//   }
// };

// // PROFILE POSTS (unchanged)
// export const profilePosts = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const userPosts = await prisma.post.findMany({ where: { userId: tokenUserId } });
//     const saved = await prisma.savedPost.findMany({
//       where: { userId: tokenUserId },
//       include: { post: true },
//     });
//     const savedPosts = saved.map((item) => item.post);
//     res.status(200).json({ userPosts, savedPosts });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile posts!" });
//   }
// };

// // GET UNREAD NOTIFICATION COUNT (unchanged)
// export const getNotificationNumber = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     const number = await prisma.chat.count({
//       where: {
//         userIDs: { hasSome: [tokenUserId] },
//         NOT: { seenBy: { hasSome: [tokenUserId] } },
//       },
//     });
//     res.status(200).json(number);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get profile notifications!" });
//   }
// };
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        isBlocked: true,
        createdAt: true,
        adminDetails: { select: { permissions: true, createdAt: true } },
        proprietaireDetail: { select: { bankAccount: true, createdAt: true } },
        locataireDetails: { select: { createdAt: true } },
      },
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get users!" });
  }
};

// GET SINGLE USER
export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        isBlocked: true,
        createdAt: true,
        adminDetails: { select: { permissions: true, createdAt: true } },
        proprietaireDetail: { select: { bankAccount: true, createdAt: true } },
        locataireDetails: { select: { createdAt: true } },
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get user!" });
  }
};

// UPDATE USER  ✅ (HISTORY ADDED)
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(password && { password: await bcrypt.hash(password, 10) }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        adminDetails: { select: { permissions: true } },
        proprietaireDetail: { select: { bankAccount: true } },
        locataireDetails: { select: { createdAt: true } },
      },
    });

    // ✅ LOG HISTORY
    await prisma.historique.create({
      data: {
        action: "MISE_A_JOUR_PROFIL",
        details: `Profil mis à jour pour l'utilisateur '${updatedUser.username}'`,
        userId: tokenUserId,
      },
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update user!" });
  }
};

// DELETE USER ✅ (HISTORY ADDED)
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "Not Authorized!" });
  }

  try {
    await prisma.user.delete({ where: { id } });

    // ✅ LOG HISTORY
    await prisma.historique.create({
      data: {
        action: "SUPPRESSION_UTILISATEUR",
        details: `Utilisateur supprimé avec ID: ${id}`,
        userId: tokenUserId,
      },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete user!" });
  }
};

// SAVE / UNSAVE POST ✅ (HISTORY ADDED)
export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId: tokenUserId, postId } },
    });

    if (savedPost) {
      await prisma.savedPost.delete({ where: { id: savedPost.id } });

      // ✅ HISTORY: UNSAVE
      await prisma.historique.create({
        data: {
          action: "DESENREGISTRER_ANNONCE",
          details: `Annonce avec ID ${postId} retirée de la liste enregistrée`,
          userId: tokenUserId,
        },
      });

      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      await prisma.savedPost.create({
        data: { userId: tokenUserId, postId },
      });

      // ✅ HISTORY: SAVE
      await prisma.historique.create({
        data: {
          action: "ENREGISTRER_ANNONCE",
          details: `Annonce avec ID ${postId} ajoutée à la liste enregistrée`,
          userId: tokenUserId,
        },
      });

      res.status(200).json({ message: "Post saved" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save/unsave post!" });
  }
};

// PROFILE POSTS (unchanged)
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const userPosts = await prisma.post.findMany({ where: { userId: tokenUserId } });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });
    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};

// GET UNREAD NOTIFICATION COUNT (unchanged)
export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: { hasSome: [tokenUserId] },
        NOT: { seenBy: { hasSome: [tokenUserId] } },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile notifications!" });
  }
};
