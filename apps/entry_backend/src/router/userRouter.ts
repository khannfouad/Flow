import { Router } from "express";
import { authMiddleware } from "../middleware.js";
import { SigninData, SignupData } from "../types/index.js";
import { prisma } from "@repo/db";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD, SALT_ROUNDS } from "../config.js";
import bcrypt from "bcrypt";

const router = Router();

router.post("/signup", async (req, res) => {
  const userName = req.body;
  const parsedData = SignupData.safeParse(userName);

  if (!parsedData.success) {
    return res.status(411).json({
      message: "Incorrect Input",
    });
  }

  const userExists = await prisma.user.findFirst({
    where: {
      email: parsedData.data?.username,
    },
  });

  if (userExists) {
    return res.status(403).json({
      message: "User already exists. Try Signing in",
    });
  }

  const hashedPassword = await bcrypt.hash(
    parsedData.data.password,
    SALT_ROUNDS,
  );

  await prisma.user.create({
    data: {
      email: parsedData?.data?.username ?? "",
      password: hashedPassword,
      name: parsedData.data?.name ?? "", //this is just to prevent typescript from throwing run time error the real handling is done by zod
    },
  });

  return res.json({
    message: "Please enter OTP send to your email",
  });
});

router.post("/signin", async (req, res) => {
  const userbody = req.body;
  const parsedData = SigninData.safeParse(userbody);

  if (!parsedData.success) {
    console.log(parsedData.error);
    return res.status(411).json({
      message: "Input is invalid",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsedData.data.username ?? "",
    },
  });

  if (!user) {
    return res.status(401).json({ message: "Username or password invalid" });
  }

  const isValidPass = await bcrypt.compare(
    parsedData.data.password,
    user.password,
  );

  if (!isValidPass) {
    return res.status(401).json("Username or Password is invalid");
  }

  const token = jwt.sign(
    {
      id: user.id,
    },
    JWT_PASSWORD,
  );

  res.json({
    token,
  });

  return;
});

router.get("/", authMiddleware, async (req, res) => {
  // @ts-ignore
  const id = req.id;
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
    },
  });

  return res.json({
    user,
  });
});

export const userRouter = router;
