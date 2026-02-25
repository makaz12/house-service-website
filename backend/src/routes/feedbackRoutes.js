const express = require("express");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const config = require("../config");

const router = express.Router();

const createFeedbackSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional(),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10).max(1200),
});

router.get("/", async (req, res, next) => {
  try {
    const limitRaw = Number(req.query.limit || 8);
    const take = Number.isInteger(limitRaw) ? Math.min(Math.max(limitRaw, 1), 20) : 8;

    const feedback = await prisma.feedback.findMany({
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        message: true,
        name: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.json({ feedback });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createFeedbackSchema.parse(req.body);
    let userId = null;

    const authHeader = req.headers.authorization || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      try {
        const payload = jwt.verify(token, config.jwtSecret);
        userId = payload.sub;
      } catch (_error) {
        userId = null;
      }
    }

    const created = await prisma.feedback.create({
      data: {
        userId,
        name: parsed.name || null,
        email: parsed.email || null,
        rating: parsed.rating,
        message: parsed.message,
      },
      select: {
        id: true,
        rating: true,
        message: true,
        name: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      feedback: created,
      message: "Thanks for your feedback.",
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input.", issues: error.issues });
    }
    return next(error);
  }
});

module.exports = router;
