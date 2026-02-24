import crypto from "crypto";
import argon2 from "argon2";

import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { email, login, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ login }, { email }],
    });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Niepoprawny adres email",
      });
    }

    if (existingUser) {
      return res.status(400).json({
        message: "Login lub email jest już zajęty",
      });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Hasło musi mieć min. 8 znaków, 1 dużą literę, 1 cyfrę i 1 znak specjalny",
      });
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });

    const user = await User.create({
      email,
      login,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Użytkownik utworzony",
      user: {
        id: user._id,
        login: user.login,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    return res.status(200).json({
      message: "Login success",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;
    const { userId } = req.query;

    if (!password || !newPassword) {
      return res.status(400).json({
        message: "Wszystkie pola są wymagane",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Hasło musi mieć min. 8 znaków, 1 dużą literę, 1 cyfrę i 1 znak specjalny",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Użytkownik nie istnieje",
      });
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Nieprawidłowe obecne hasło",
      });
    }

    const hashedPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 1,
    });

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Hasło zostało zmienione",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const getUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).select("login email");

    if (!user) {
      return res.status(404).json({
        message: "Użytkownik nie istnieje",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
