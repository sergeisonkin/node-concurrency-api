import { Router } from "express";
import { getAllUsers, createUser, deleteUser } from "@/services/userService.js";
import asyncHandler from "@/utils/asyncHandler.js";
const router = Router();

router.get("/", (req, res) => {
  res.status(200).send("Welcome, buddy!");
});

router.get("/users", asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.status(200).send(users);
}));

router.post("/users", asyncHandler(async (req, res) => {
  const user = await createUser(req.body.email, req.body.name);

  res.status(201).send(user);
}));

router.delete("/users/:id", asyncHandler(async (req, res) => {
  const user = await deleteUser(Number(req.params.id));

  res.status(200).send(user);
}));

export default router;
