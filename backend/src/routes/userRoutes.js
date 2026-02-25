const express = require("express");
const bcrypt = require("bcryptjs");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(30).nullable().optional(),
  theme: z.enum(["ocean", "sunset", "forest"]).optional(),
  language: z.enum(["en", "fr", "es"]).optional(),
});

const deleteAccountSchema = z.object({
  password: z.string().min(8).max(100),
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        theme: true,
        language: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const parsed = updateProfileSchema.parse(req.body);
    if (Object.keys(parsed).length === 0) {
      return res.status(400).json({ message: "No updates provided." });
    }

    if (parsed.email) {
      const emailTaken = await prisma.user.findFirst({
        where: {
          email: parsed.email.toLowerCase(),
          id: { not: req.user.sub },
        },
        select: { id: true },
      });
      if (emailTaken) {
        return res.status(409).json({ message: "Email is already in use." });
      }
    }

    const user = await prisma.user.update({
      where: { id: req.user.sub },
      data: {
        name: parsed.name,
        email: parsed.email ? parsed.email.toLowerCase() : undefined,
        phone: parsed.phone === null ? null : parsed.phone,
        theme: parsed.theme,
        language: parsed.language,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        theme: true,
        language: true,
        createdAt: true,
      },
    });

    return res.json({ user, message: "Profile updated." });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input.", issues: error.issues });
    }
    return next(error);
  }
});

router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    const parsed = deleteAccountSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const ok = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    await prisma.user.delete({
      where: { id: req.user.sub },
    });

    return res.json({ message: "Account deleted." });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input.", issues: error.issues });
    }
    return next(error);
  }
});

module.exports = router;
