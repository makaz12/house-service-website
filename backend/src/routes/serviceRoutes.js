const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const config = require("../config");
const { addMinutes, generateSlots } = require("../utils/schedule");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { id: "asc" },
    });
    return res.json({ services });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid service id." });
    }

    const service = await prisma.service.findUnique({ where: { id } });
    if (!service || !service.active) {
      return res.status(404).json({ message: "Service not found." });
    }

    return res.json({ service });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id/availability", async (req, res, next) => {
  try {
    const serviceId = Number(req.params.id);
    const querySchema = z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    });
    const { date } = querySchema.parse(req.query);

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.active) {
      return res.status(404).json({ message: "Service not found." });
    }

    const slots = generateSlots(
      date,
      config.businessStartHour,
      config.businessEndHour,
      config.slotStepMinutes,
      service.durationMin
    );

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = addMinutes(dayStart, 24 * 60);

    const takenAppointments = await prisma.appointment.findMany({
      where: {
        serviceId,
        scheduledAt: {
          gte: dayStart,
          lt: dayEnd,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      select: {
        scheduledAt: true,
      },
    });

    const taken = new Set(
      takenAppointments.map((item) => new Date(item.scheduledAt).toISOString())
    );

    const availableSlots = slots
      .filter((slot) => !taken.has(slot.toISOString()))
      .map((slot) => slot.toISOString());

    return res.json({
      serviceId,
      date,
      durationMin: service.durationMin,
      availableSlots,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ message: "Invalid query.", issues: error.issues });
    }
    return next(error);
  }
});

module.exports = router;
