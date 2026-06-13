import prisma from "@/db.js";
import { Worker } from "worker_threads";

async function getAllUsers() {
  const users = await prisma.user.findMany();

  return users;
}

async function createUser(email: string, name: string) {
  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
    },
  });

  return user;
}

async function deleteUser(id: number) {
  const user = await prisma.user.delete({
    where: {
      id: id,
    },
  });

  return user;
}

async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  });

  return user;
}

export { getAllUsers, createUser, deleteUser, getUserById };
