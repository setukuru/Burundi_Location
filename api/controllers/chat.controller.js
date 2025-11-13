// import { io } from "../../socket/app.js";
// import prisma from "../lib/prisma.js";
// // import { io, getUser } from "../socket/app.js";


// const chats = await prisma.chat.findMany();
// // Temporarily log all chats to see if any data is returned
// console.log("All Chats:", chats);

// export const getChats = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     // Log the tokenUserId to ensure it's correct
//     console.log("...........................");

//     console.log("Token User ID:", tokenUserId);
//     const chats = await prisma.chat.findMany({
//       where: {
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//     });

//     // Log the raw chat data from the database
//     console.log("Chats fetched from DB:", chats);

//     for (const chat of chats) {
//       const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
//       console.log("iD of the receiver:", receiverId);
//       const receiver = await prisma.user.findUnique({
//         where: {
//           id: receiverId,
//         },
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       });
//       console.log("the receiver:", receiver);
//       chat.receiver = receiver;
//     }
//     // Log the final processed chat data
//     console.log("Processed Chats:", chats);
//     res.status(200).json(chats);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chats!" });
//   }
// };

// export const addChat = async (req, res) => {
//   const tokenUserId = req.userId;
//   const { receiverId, propertyId } = req.body; // userId not needed; use tokenUserId

//   try {
//     // 1️⃣ Try to find existing chat for this property and both participants
//     let existingChat = await prisma.chat.findFirst({
//       where: {
//         postId: propertyId, // only chats about this property
//         userIDs: { hasEvery: [tokenUserId, receiverId] },
//       },
//     });

//     if (existingChat) {
//       // 2️⃣ If chat exists, just add a message
//       const newMessage = await prisma.message.create({
//         data: {
//           chatId: existingChat.id,
//           userId: tokenUserId,
//           text: `Hello, I'm interested in your property with the ID: ${propertyId}.`,
//         },
//       });

//       return res.status(200).json({ chat: existingChat, message: newMessage });
//     }

//     // 3️⃣ No chat exists → create new chat linked to property
//     const newChat = await prisma.chat.create({
//       data: {
//         userIDs: [tokenUserId, receiverId],
//         postId: propertyId, // link chat to this property
//         lastMessage: `Hello, I'm interested in your property with the ID: ${propertyId}.`,
//       },
//     });

//     // 4️⃣ Create the first message
//     const newMessage = await prisma.message.create({
//       data: {
//         chatId: newChat.id,
//         userId: tokenUserId,
//         text: `Hello, I'm interested in your property with the ID: ${propertyId}.`,
//       },
//     });

//     res.status(200).json({ chat: newChat, message: newMessage });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add chat!" });
//   }
// };

// export const readChat = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     const chat = await prisma.chat.update({
//       where: {
//         id: req.params.id,
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//       data: {
//         seenBy: {
//           set: [tokenUserId],
//         },
//       },
//     });
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to read chat!" });
//   }
// };
// // chat.controller.js
// export const getChat = async (req, res) => {
//   const tokenUserId = req.userId;
//   const id = req.params.id;

//   try {
//     const chat = await prisma.chat.findUnique({
//       where: {
//         id,
//         userIDs: {
//           hasSome: [tokenUserId],
//         },
//       },
//       include: {
//         messages: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });

//     if (!chat) return res.status(404).json({ message: "Chat not found!" });

//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chat!" });
//   }
// };
// // PATCH /chats/:chatId/confirm
// // GET /chats/property/:propertyId
// export const getChatsForProperty = async (req, res) => {
//   const tokenUserId = req.userId;
//   const { propertyId } = req.params;

//   try {
//     const chats = await prisma.chat.findMany({
//       where: {
//         postId: propertyId,
//         userIDs: { has: tokenUserId }, // only chats involving current user
//       },
//       include: {
//         messages: { orderBy: { createdAt: "desc" }, take: 1 }, // optional
//       },
//     });

//     const clients = await Promise.all(
//       chats.map(async (chat) => {
//         const clientId = chat.userIDs.find((id) => id !== tokenUserId);
//         const client = await prisma.user.findUnique({
//           where: { id: clientId },
//           select: { id: true, username: true, avatar: true, createdAt: true },
//         });
//         return {
//           chatId: chat.id,
//           client,
//           lastMessage: chat.messages[0],
//           confirmed: chat.confirmed,
//         };
//       })
//     );

//     res.status(200).json(clients);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch clients" });
//   }
// };

// export const confirmClient = async (req, res) => {
//   const tokenUserId = req.userId;
//   const { chatId } = req.params;

//   try {
//     const chat = await prisma.chat.findUnique({
//       where: { id: chatId },
//       include: { post: true },
//     });

//     if (!chat) return res.status(404).json({ message: "Chat not found!" });

//     if (chat.post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not authorized!" });
//     }

//     // Unconfirm other chats
//     await prisma.chat.updateMany({
//       where: {
//         postId: chat.postId,
//         id: { not: chatId },
//       },
//       data: { confirmed: false },
//     });

//     // Confirm this chat
//     const updatedChat = await prisma.chat.update({
//       where: { id: chatId },
//       data: { confirmed: true },
//     });

//     // Mark property as rented
//     await prisma.post.update({
//       where: { id: chat.postId },
//       data: { rented: true },
//     });

//     // ⚡ Emit update to all clients listening for this property
//     io.emit(`post-${chat.postId}-updated`, {
//       chat: updatedChat,
//       rented: true,
//     });

//     res.status(200).json({
//       message: "Client confirmed successfully",
//       chat: updatedChat,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to confirm client" });
//   }
// };

// export const unconfirmClient = async (req, res) => {
//   const tokenUserId = req.userId;
//   const { chatId } = req.params;

//   try {
//     const chat = await prisma.chat.findUnique({
//       where: { id: chatId },
//       include: { post: true },
//     });

//     if (!chat) return res.status(404).json({ message: "Chat not found!" });

//     if (chat.post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not authorized!" });
//     }

//     // Unconfirm this chat
//     const updatedChat = await prisma.chat.update({
//       where: { id: chatId },
//       data: { confirmed: false },
//     });

//     // Check if another chat is still confirmed
//     const stillConfirmed = await prisma.chat.findFirst({
//       where: {
//         postId: chat.postId,
//         confirmed: true,
//       },
//     });

//     // Reopen property only if no confirmed chat exists
//     const rentedStatus = stillConfirmed ? true : false;
//     if (!stillConfirmed) {
//       await prisma.post.update({
//         where: { id: chat.postId },
//         data: { rented: false },
//       });
//     }

//     // ⚡ Emit update to all clients
//     io.emit(`post-${chat.postId}-updated`, {
//       chat: updatedChat,
//       rented: rentedStatus,
//     });

//     res.status(200).json({
//       message: stillConfirmed
//         ? "Client removed, but another client is already confirmed."
//         : "Client removed, property reopened.",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to unconfirm client" });
//   }
// };

import { io } from "../../socket/app.js";
import prisma from "../lib/prisma.js";
import { addHistory } from "./historique.controller.js";  // ✅ ADDED

const chats = await prisma.chat.findMany();

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {

    const chats = await prisma.chat.findMany({
      where: { userIDs: { hasSome: [tokenUserId] } },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, username: true, avatar: true },
      });
      chat.receiver = receiver;
    }
    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// =============================
// ADD NEW CHAT OR MESSAGE
// =============================
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId, propertyId } = req.body;

  try {
    let existingChat = await prisma.chat.findFirst({
      where: {
        postId: propertyId,
        userIDs: { hasEvery: [tokenUserId, receiverId] },
      },
    });

    const messageText = `Hello, I'm interested in your property with the ID: ${propertyId}.`;

    if (existingChat) {
      const newMessage = await prisma.message.create({
        data: {
          chatId: existingChat.id,
          userId: tokenUserId,
          text: messageText,
        },
      });

      // ✅ H I S T O R Y
      await addHistory(
        tokenUserId,
        "MESSAGE_ENVOYÉ",
        `Message sent for property ${propertyId}`
      );

      return res.status(200).json({ chat: existingChat, message: newMessage });
    }

    const newChat = await prisma.chat.create({
      data: {
        userIDs: [tokenUserId, receiverId],
        postId: propertyId,
        lastMessage: messageText,
      },
    });

    const newMessage = await prisma.message.create({
      data: {
        chatId: newChat.id,
        userId: tokenUserId,
        text: messageText,
      },
    });

    // ✅ H I S T O R Y
    await addHistory(
      tokenUserId,
      "MESSAGE_ENVOYÉ",
      `Message sent for property ${propertyId}`
    );

    res.status(200).json({ chat: newChat, message: newMessage });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// =============================
// READ CHAT
// =============================
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: { hasSome: [tokenUserId] },
      },
      data: {
        seenBy: { set: [tokenUserId] },
      },
    });

    // ✅ H I S T O R Y
    await addHistory(tokenUserId, "CHAT_LU", `Chat ${req.params.id} viewed`);

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const id = req.params.id;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id, userIDs: { hasSome: [tokenUserId] } },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const getChatsForProperty = async (req, res) => {
  const tokenUserId = req.userId;
  const { propertyId } = req.params;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        postId: propertyId,
        userIDs: { has: tokenUserId },
      },
      include: {
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    const clients = await Promise.all(
      chats.map(async (chat) => {
        const clientId = chat.userIDs.find((id) => id !== tokenUserId);
        const client = await prisma.user.findUnique({
          where: { id: clientId },
          select: { id: true, username: true, avatar: true, createdAt: true },
        });
        return {
          chatId: chat.id,
          client,
          lastMessage: chat.messages[0],
          confirmed: chat.confirmed,
        };
      })
    );

    res.status(200).json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch clients" });
  }
};

export const confirmClient = async (req, res) => {
  const tokenUserId = req.userId;
  const { chatId } = req.params;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { post: true },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });
    if (chat.post.userId !== tokenUserId)
      return res.status(403).json({ message: "Not authorized!" });

    await prisma.chat.updateMany({
      where: { postId: chat.postId, id: { not: chatId } },
      data: { confirmed: false },
    });

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { confirmed: true },
    });

    await prisma.post.update({
      where: { id: chat.postId },
      data: { rented: true },
    });

    // ✅ H I S T O R Y
    await addHistory(
      tokenUserId,
      "CLIENT_CONFIRMÉ",
      `Client confirmed for property ${chat.postId}`
    );

    io.emit(`post-${chat.postId}-updated`, {
      chat: updatedChat,
      rented: true,
    });

    res.status(200).json({
      message: "Client confirmed successfully",
      chat: updatedChat,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to confirm client" });
  }
};

export const unconfirmClient = async (req, res) => {
  const tokenUserId = req.userId;
  const { chatId } = req.params;

  try {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { post: true },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });
    if (chat.post.userId !== tokenUserId)
      return res.status(403).json({ message: "Not authorized!" });

    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { confirmed: false },
    });

    const stillConfirmed = await prisma.chat.findFirst({
      where: { postId: chat.postId, confirmed: true },
    });

    const rentedStatus = stillConfirmed ? true : false;

    if (!stillConfirmed) {
      await prisma.post.update({
        where: { id: chat.postId },
        data: { rented: false },
      });
    }

    // ✅ H I S T O R Y
    await addHistory(
      tokenUserId,
      "CLIENT_SUPPRIMÉ",
      `Client removed for property ${chat.postId}`
    );

    io.emit(`post-${chat.postId}-updated`, {
      chat: updatedChat,
      rented: rentedStatus,
    });

    res.status(200).json({
      message: stillConfirmed
        ? "Client removed, but another client is already confirmed."
        : "Client removed, property reopened.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to unconfirm client" });
  }
};

