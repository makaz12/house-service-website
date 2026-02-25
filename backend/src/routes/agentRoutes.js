const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const createAgentRequestSchema = z.object({
  phone: z.string().min(7).max(30),
  preferredTime: z.string().datetime().optional(),
  message: z.string().max(500).optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createAgentRequestSchema.parse(req.body);
    let userId = null;

    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const jwt = require("jsonwebtoken");
        const config = require("../config");
        const payload = jwt.verify(token, config.jwtSecret);
        userId = payload.sub;
      } catch (_error) {
        userId = null;
      }
    }

    const created = await prisma.agentRequest.create({
      data: {
        userId,
        phone: parsed.phone,
        preferredTime: parsed.preferredTime ? new Date(parsed.preferredTime) : null,
        message: parsed.message || null,
      },
    });

    return res.status(201).json({
      request: created,
      message: "Agent request received. We will call you soon.",
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input.", issues: error.issues });
    }
    return next(error);
  }
});

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const requests = await prisma.agentRequest.findMany({
      where: { userId: req.user.sub },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ requests });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
