import prisma from "@/db.js";
import WorkerPool from "./workerPool.js";

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

const hashWorkerScript = new URL("../workers/hash.worker.ts", import.meta.url)
  .pathname;
const hashPool = new WorkerPool<string>(hashWorkerScript, 4, 4);

async function heavyCreate(email: string, name: string, password: string) {
  const hashPassword = await hashPool.run(password);
  
  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: hashPassword,
    },
  });

  return user;
}

export { getAllUsers, createUser, deleteUser, getUserById, heavyCreate };
