import express from "express";
import usersRouter from "@/routes/users.js";
import { config } from "@/config/index.js";

const app = express();

app.use(express.json());
app.use(usersRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});


export default app;