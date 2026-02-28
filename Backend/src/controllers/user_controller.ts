import { Request, Response } from "express";
import { User } from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const user_create = async (req: Request, res: Response) => {
  try {
    const { email, password, level, classOrCourse, assistantType, deviceId } = req.body;

    if (!email || !password || !level || !classOrCourse || !assistantType || !deviceId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    /* -----------------------------
       🔎 Email Already Exists?
    ------------------------------ */

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* -----------------------------
       🔐 Hash Password
    ------------------------------ */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* -----------------------------
       🔥 Generate Username
    ------------------------------ */

    const prefixes = ["Frost", "Shadow", "Ember", "Void", "Storm"];
    const suffixes = ["Vale", "Nova", "Knight", "Hunter", "Strike"];

    const generateUsername = () => {
      const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const randomNumber = Math.floor(100 + Math.random() * 900);
      return `${randomPrefix}${randomSuffix}${randomNumber}`;
    };

    let username = "";
    let exists = true;

    while (exists) {
      username = generateUsername();
      const check = await User.findOne({ username });
      if (!check) exists = false;
    }

    /* -----------------------------
       🔢 Generate 6 Digit OTP
    ------------------------------ */

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log("Generated OTP:", otp); // Later email send karna

    /* -----------------------------
       🧠 Create User
    ------------------------------ */

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      level,
      classOrCourse,
      assistantType,
      deviceId: deviceId.trim(),
      mood: "normal",
      validation: {
        isEmailVerified: false,
        otp,
        otpExpiry,
        isDelete: false,
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created. OTP sent to email.",
    });

  } catch (error) {
    console.error("Create Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const get_me = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ success: false });

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    );

    const user = await User.findById(decoded.id).select("-password");

    if (!user)
      return res.status(401).json({ success: false });

    return res.json({
      success: true,
      user,
    });

  } catch {
    return res.status(401).json({ success: false });
  }
};

export const verify_otp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.validation.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.validation.otpExpiry || user.validation.otpExpiry < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.validation.isEmailVerified = true;
    user.validation.otp = undefined;
    user.validation.otpExpiry = undefined;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const user_login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 🔎 Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 🔎 Check user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 🔐 Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 📩 Check email verified
    if (!user.validation.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 🔑 Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // 🔥 Success response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level: user.level,
        assistantType: user.assistantType,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
