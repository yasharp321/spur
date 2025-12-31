// import { Router } from "express";
// import { PrismaClient } from "@prisma/client";
// import { generateReply } from "../services/llm";

// const router = Router();
// const prisma = new PrismaClient();

// router.post("/message", async (req, res) => {
//   try {
//     const { message, sessionId } = req.body;

//     if (!message || message.trim() === "") {
//       return res.status(400).json({ error: "Message cannot be empty" });
//     }

//     const conversation =
//       sessionId
//         ? await prisma.conversation.findUnique({ where: { id: sessionId } })
//         : await prisma.conversation.create({ data: {} });

//     const conversationId = conversation?.id || "";

//     await prisma.message.create({
//       data: {
//         conversationId,
//         sender: "user",
//         text: message,
//       },
//     });

//     const history = await prisma.message.findMany({
//       where: { conversationId },
//       orderBy: { createdAt: "asc" },
//     });

//     const reply = await generateReply(
//       history.map((m) => ({ text: m.text })),
//       message
//     );

//     await prisma.message.create({
//       data: {
//         conversationId,
//         sender: "ai",
//         text: reply,
//       },
//     });

//     res.json({ reply, sessionId: conversationId });
//   } catch (err) {
//     res.status(500).json({ reply: "Something went wrong" });
//   }
// });

// export default router;
import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateReply } from "../services/llm";

const router = Router();
const prisma = new PrismaClient();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Get or create conversation
    let conversation;
    if (sessionId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: sessionId },
      });
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {},
      });
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "user",
        text: message,
      },
    });

    // Fetch conversation history
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: "asc" },
    });

    // ✅ THIS LINE IS THE FIX
    const historyText = history.map((m) => m.text);

    // ❌ DO NOT PASS history
    // ✅ PASS historyText
    const reply = await generateReply(historyText, message);

    // Save AI reply
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: "ai",
        text: reply,
      },
    });

    res.json({
      reply,
      sessionId: conversation.id,
    });
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);
    res.status(500).json({
      reply: "Internal server error",
    });
  }
});

export default router;
