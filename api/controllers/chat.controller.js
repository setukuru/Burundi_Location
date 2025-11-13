// =============================
// IMPORTS
// =============================
import { io as ClientIO } from "socket.io-client"; // use client to connect to deployed socket
import prisma from "../lib/prisma.js";
import { addHistory } from "./historique.controller.js";

// =============================
// CONNECT TO DEPLOYED SOCKET.IO
// =============================
const SOCKET_URL = "https://burundi-location-1.onrender.com"; // your deployed socket service
const io = ClientIO(SOCKET_URL, {
  transports: ["websocket"], // optional, force websocket
});

io.on("connect", () => {
  console.log("Connected to Socket.IO server:", io.id);
});

io.on("connect_error", (err) => {
  console.error("Socket.IO connection error:", err);
});

// =============================
// CONTROLLER FUNCTIONS
// =============================
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

      await addHistory(
        tokenUserId,
        "MESSAGE_ENVOYÉ",
        `Message sent for property ${propertyId}`
      );

      // emit via Socket.IO
      io.emit(`chat-${existingChat.id}-new-message`, newMessage);

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

    await addHistory(
      tokenUserId,
      "MESSAGE_ENVOYÉ",
      `Message sent for property ${propertyId}`
    );

    // emit via Socket.IO
    io.emit(`chat-${newChat.id}-new-message`, newMessage);

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

    await addHistory(tokenUserId, "CHAT_LU", `Chat ${req.params.id} viewed`);

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};

// =============================
// GET SINGLE CHAT
// =============================
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

// =============================
// GET CHATS FOR PROPERTY
// =============================
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

// =============================
// CONFIRM CLIENT
// =============================
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

// =============================
// UNCONFIRM CLIENT
// =============================
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

