import { Response } from "express";
import { prisma } from "../config/db";
import { AuthRequest } from "../middleware/auth.middleware";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, priority, status, dueDate, assignedToId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority: priority || "MEDIUM",
        status: status || "OPEN",
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: req.user!.userId,
        assignedToId: assignedToId ? Number(assignedToId) : null,
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, search } = req.query;
    const where: any = {};

    // Role-based visibility: Admin sees all, User sees only their own
    if (req.user!.role !== "ADMIN") {
      where.OR = [
        { createdById: req.user!.userId },
        { assignedToId: req.user!.userId },
      ];
    }

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (search) {
      const searchFilter = {
        OR: [
          { title: { contains: search as string } },
          { description: { contains: search as string } },
        ],
      };
      if (where.OR) {
        where.AND = [{ OR: where.OR }, searchFilter];
        delete where.OR;
      } else {
        Object.assign(where, searchFilter);
      }
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const isOwner = task.createdById === req.user!.userId || task.assignedToId === req.user!.userId;
    if (req.user!.role !== "ADMIN" && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Task not found" });

    const isOwner = existing.createdById === req.user!.userId || existing.assignedToId === req.user!.userId;
    if (req.user!.role !== "ADMIN" && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, priority, status, dueDate, assignedToId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(priority !== undefined && { priority }),
        ...(status !== undefined && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assignedToId !== undefined && { assignedToId: assignedToId ? Number(assignedToId) : null }),
      },
      include: {
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ message: "Task not found" });

    const isOwner = existing.createdById === req.user!.userId;
    if (req.user!.role !== "ADMIN" && !isOwner) {
      return res.status(403).json({ message: "Only the creator or an admin can delete this task" });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};