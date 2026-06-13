import { Router } from "express";
import { getAllUsers, createUser, deleteUser, getUserById } from "@/services/userService.js";
import { Worker } from "worker_threads";
import asyncHandler from "@/utils/asyncHandler.js";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).send('Success!');
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

    const report = await new Promise((resolve, reject) => {
      const workerPath = new URL("../workers/report.worker.ts", import.meta.url).pathname;
      const worker = new Worker(workerPath, {
        workerData: { user },
        execArgv: ["--import", "tsx"],
      });

      worker.on("message", resolve);
      worker.on("error", reject);
    })
    
    res.status(200).send(report);
  })
)

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    const user = await createUser(req.body.email, req.body.name);

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


export default router;
