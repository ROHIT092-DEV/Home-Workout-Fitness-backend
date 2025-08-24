import logger from "../config/logger.js";
import bcrypt from "bcrypt";
import { User } from "../model/users.model.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";

function setRefreshCookie(res, token) {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE,
    sameSite: process.env.COOKIE_SAMESITE,
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // mirror REFRESH_TOKEN_EXPIRES=7d
  });
}







export const register = async (req, res) => {
  const { fullName, email, phone, password } = req.body;

  try {
    // Basic validation
    if (!fullName || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    if (!newUser) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to register user" });
    }
    return res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      newUser,
    });
  } catch (error) {
    logger.error("Error in register:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }

  return res.status(501).json({ success: false, message: "Not implemented" });
};

// Login Functionality

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "email & password required" });

    const user = await User.findOne({ email, deletedAt: { $exists: false } });

    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid credentials User Not found",
      });

    if (user.status !== "active")
      return res
        .status(403)
        .json({ success: false, message: "Account suspended" });

    const ok = await bcrypt.compare(password, user.password);
    logger.info(ok, "password compare");

    if (!ok)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    const accessToken = signAccessToken({
      id: user._id.toString(),
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });

    user.refreshToken = refreshToken; // rotation anchor

    await user.save();
    setRefreshCookie(res, refreshToken);

   logger.info(accessToken, "access token");

    return res.cookie("accessToken",accessToken).json({ success: true, accessToken });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export async function refresh(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (!token)
      return res
        .status(401)
        .json({ success: false, message: "Missing refresh token" });

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }

    const newAccess = signAccessToken({
      id: user._id.toString(),
      role: user.role,
    });
    const newRefresh = signRefreshToken({
      id: user._id.toString(),
      role: user.role,
    });
    user.refreshToken = newRefresh; // rotate
    await user.save();

    setRefreshCookie(res, newRefresh);
    return res.json({ success: true, accessToken: newAccess });
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Invalid refresh token" });
  }
}

export async function logout(req, res) {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.clearCookie("refreshToken", {
      path: "/",
      domain: process.env.COOKIE_DOMAIN,
    });
    return res.status(204).send();
  } catch (err) {
    return res.status(200).json({ success: true });
  }
}

export async function me(req, res) {


  try {
    const user = await User.findById(req.user.id).select(
      "-password -refreshToken"
    );
    if (!user)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: user });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}



// admin functions to manage users (list, update, delete) can be added here

// e.g., list users (admin only)
export async function listUsers(req, res) {
  try {
    const users = await User.find().select("-password -refreshToken");
    return res.json({ success: true, data: users });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}


// e.g., update user (admin only)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    logger.info(id.toString());
    logger.info(updates.fullName);

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select(
      "-password -refreshToken"
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    return res.json({ success: true, data: user });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}


// e.g., delete user (admin only)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      { new: true }
    ).select("-password -refreshToken");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, data: user });
  }
  catch (error) {
    logger.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
}
