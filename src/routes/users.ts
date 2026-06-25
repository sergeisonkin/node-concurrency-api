import { Router } from "express";
import { fileURLToPath } from "node:url";
import type { User } from "@prisma/client";
import {
  getAllUsers,
  createUser,
  deleteUser,
  getUserById,
  heavyCreate,
} from "@/services/userService.js";
import { config } from "@/config/index.js";
import asyncHandler from "@/utils/asyncHandler.js";
import WorkerPool from "@/services/workerPool.js";
const router = Router();

const workerScript = fileURLToPath(
  new URL("../workers/report.worker.ts", import.meta.url),
);
const pool = new WorkerPool<User>(workerScript, config.workerCount, config.threadPoolSize);

router.get("/", (req, res) => {
  res.status(200).send("Success!");
});

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await getAllUsers();
    res.status(200).send(users);
  }),
);

router.get(
  "/users/:id/report",
  asyncHandler(async (req, res) => {
    const user = await getUserById(Number(req.params.id));

    if (!user) {
      res.status(404).send({ error: "User not found"});
      return;
    }

    const result = await pool.run(user);

    res.status(200).send(result);
  }),
);

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const user = await createUser(req.body.email, req.body.name);

    res.status(201).send(user);
  }),
);

router.post(
  "/users/heavy",
  asyncHandler(async (req, res) => {
    const user = await heavyCreate(
      req.body.email,
      req.body.name,
      req.body.password,
    );

    res.status(201).send(user);
  }),
);

router.delete(
  "/users/:id",
  asyncHandler(async (req, res) => {
    const user = await deleteUser(Number(req.params.id));

    res.status(200).send(user);
  }),
);

export { router, pool };
