import express from "express";
import { userRouter } from "./router/userRouter.js";
import { tideRouter } from "./router/tideRouter.js";
const app = express();

app.use(express.json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tides", tideRouter);

app.listen(4200, () => {
  console.log("App runningo n port 4200");
});
