const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");
const config = require("../config");
const { addMinutes, isWithinBusinessHours, toDate } = require("../utils/schedule");

const router = express.Router();

const createAppointmentSchema = z.object({
  serviceId: z.number().int().positive(),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(500).optional(),
  location: z.object({
    addressText: z.string().min(5).max(300),
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    placeId: z.string().max(200).optional(),
  }),
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const parsed = createAppointmentSchema.parse(req.body);
    const start = toDate(parsed.scheduledAt);

    if (!start) {
      return res.status(400).json({ message: "Invalid appointment date." });
    }

    if (start < new Date()) {
      return res.status(400).json({ message: "Appointment must be in the future." });
    }

    if (!isWithinBusinessHours(start, config.businessStartHour, config.businessEndHour)) {
      return res.status(400).json({
        message: `Appointment must be within business hours (${config.businessStartHour}:00-${config.businessEndHour}:00).`,
      });
    }

    const service = await prisma.service.findUnique({
      where: { id: parsed.serviceId },
    });

    if (!service || !service.active) {
      return res.status(404).json({ message: "Service not found." });
    }

    const existing = await prisma.appointment.findFirst({
      where: {
        serviceId: parsed.serviceId,
        scheduledAt: start,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { id: true },
    });

    if (existing) {
      return res.status(409).json({ message: "Selected slot is not available." });
    }

    const end = addMinutes(start, service.durationMin);
    if (!isWithinBusinessHours(end, config.businessStartHour, config.businessEndHour + 1)) {
      return res
        .status(400)
        .json({ message: "Service duration exceeds business hours." });
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: req.user.sub,
        serviceId: parsed.serviceId,
        scheduledAt: start,
        notes: parsed.notes || null,
        status: "PENDING",
        location: {
          create: {
            addressText: parsed.location.addressText,
            lat: parsed.location.lat,
            lng: parsed.location.lng,
            placeId: parsed.location.placeId || null,
          },
        },
      },
      include: {
        service: true,
        location: true,
      },
    });

    return res.status(201).json({ appointment });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid input.", issues: error.issues });
    }
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany({
      where: { userId: req.user.sub },
      include: {
        service: true,
        location: true,
      },
      orderBy: { scheduledAt: "desc" },
    });

    return res.json({ appointments });
  } catch (error) {
    return next(error);
  }
});

router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid appointment id." });
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.userId !== req.user.sub) {
      return res.status(404).json({ message: "Appointment not found." });
    }

    if (appointment.status === "CANCELLED") {
      return res.status(400).json({ message: "Appointment already cancelled." });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED" },
      include: { service: true, location: true },
    });

    return res.json({ appointment: updated });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
