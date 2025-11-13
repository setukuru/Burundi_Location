// import prisma from "../lib/prisma.js";
// import jwt from "jsonwebtoken";

// export const getPosts = async (req, res) => {
//   const query = req.query;

//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         ...(query.userId && { userId: query.userId }),
//         city: query.city || undefined,
//         type: query.type || undefined,
//         property: query.property || undefined,
//         bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
//         price: {
//           gte: query.minPrice ? parseInt(query.minPrice) : undefined,
//           lte: query.maxPrice ? parseInt(query.maxPrice) : undefined,
//         },
//       },
//       include: { postDetail: true },
//       orderBy: { createdAt: "desc" },
//     });

//     res.status(200).json(posts);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get posts" });
//   }
// };

// export const getPost = async (req, res) => {
//   const id = req.params.id;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//       include: {
//         postDetail: true,
//         user: {
//           select: {
//             username: true,
//             avatar: true,
//             role: true, // utile pour savoir si c’est un propriétaire ou locataire
//           },
//         },
//       },
//     });

//     const token = req.cookies?.token;

//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (!err) {
//           const saved = await prisma.savedPost.findUnique({
//             where: {
//               userId_postId: {
//                 postId: id,
//                 userId: payload.id,
//               },
//             },
//           });
//           return res.status(200).json({ ...post, isSaved: !!saved });
//         }
//         return res.status(200).json({ ...post, isSaved: false });
//       });
//     } else {
//       return res.status(200).json({ ...post, isSaved: false });
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to get post" });
//   }
// };

// export const addPost = async (req, res) => {
//   const body = req.body;
//   const tokenUserId = req.userId;
//   const tokenRole = req.role;

//   try {
//     const newPost = await prisma.post.create({
//       data: {
//         ...body.postData,
//         // Connect user via relation
//         user: { connect: { id: tokenUserId } },
//         postDetail: {
//           create: body.postDetail,
//         },
//       },
//     });

//     res.status(200).json(newPost);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to create post" });
//   }
// };

// // ..............................
// export const updatePost = async (req, res) => {
//   const { id } = req.params;
//   const { postData, postDetail } = req.body;

//   try {
//     const {
//       title,
//       price,
//       images,
//       address,
//       city,
//       bedroom,
//       bathroom,
//       latitude,
//       longitude,
//       type,
//       property,
//     } = postData;

//     const updatedPost = await prisma.post.update({
//       where: { id: String(id) },
//       data: {
//         title,
//         price,
//         images,
//         address,
//         city,
//         bedroom,
//         bathroom,
//         latitude,
//         longitude,
//         type,
//         property,
//         postDetail: {
//           update: {
//             where: { id: postDetail.id }, // we only use ID here
//             data: {
//               desc: postDetail.desc,
//               size: postDetail.size,
//               daysVisit: postDetail.daysVisit,
//             },
//           },
//         },
//       },
//       include: { postDetail: true },
//     });

//     res.status(200).json(updatedPost);
//   } catch (err) {
//     console.error(err);
//     if (err.code === "P2025") {
//       return res.status(404).json({ message: "Post not found." });
//     }
//     res.status(500).json({ message: "Failed to update post." });
//   }
// };


// export const deletePost = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not Authorized!" });
//     }

//     await prisma.post.delete({
//       where: { id },
//     });

//     res.status(200).json({ message: "Post deleted" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete post" });
//   }
// };

import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { addHistory } from "./historique.controller.js"; // ✅ Added

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        ...(query.userId && { userId: query.userId }),
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
        price: {
          gte: query.minPrice ? parseInt(query.minPrice) : undefined,
          lte: query.maxPrice ? parseInt(query.maxPrice) : undefined,
        },
      },
      include: { postDetail: true },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            role: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          return res.status(200).json({ ...post, isSaved: !!saved });
        }
        return res.status(200).json({ ...post, isSaved: false });
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        user: { connect: { id: tokenUserId } },
        postDetail: { create: body.postDetail },
      },
    });

    // ✅ Add history
    await addHistory(tokenUserId, "Création d'annonce", `Titre: ${newPost.title}`);

    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

// ....................................................

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { postData, postDetail } = req.body;
  const tokenUserId = req.userId;

  try {
    const updatedPost = await prisma.post.update({
      where: { id: String(id) },
      data: {
        ...postData,
        postDetail: {
          update: {
            where: { id: postDetail.id },
            data: {
              desc: postDetail.desc,
              size: postDetail.size,
              daysVisit: postDetail.daysVisit,
            },
          },
        },
      },
      include: { postDetail: true },
    });

    // ✅ Add history
    await addHistory(tokenUserId, "Modification d'annonce", `Titre: ${updatedPost.title}`);

    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    if (err.code === "P2025") {
      return res.status(404).json({ message: "Post not found." });
    }
    res.status(500).json({ message: "Failed to update post." });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post) return res.status(404).json({ message: "Post not found." });
    if (post.userId !== tokenUserId) return res.status(403).json({ message: "Not Authorized!" });

    await prisma.post.delete({ where: { id } });

    // ✅ Add history
    await addHistory(tokenUserId, "Suppression d'annonce", `Titre: ${post.title}`);

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
