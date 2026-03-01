import User from "../models/User.js";
import {
  sendVerifiedAccount,
  sendEmailChangeCode,
} from "../services/emailService.js";
import {
  generateVerificationToken,
  hashToken,
  generateNumericCode,
} from "../utils/token.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
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

    const hashedPassword = await hashPassword(password);

    const { code, hashedCode } = generateVerificationToken();

    const user = await User.create({
      email,
      login,
      password: hashedPassword,
      verifiedChangeCode: hashedCode,
      verifiedChangeCodeExpires: Date.now() + 1000 * 60 * 60,
    });

    await user.save();

    await sendVerifiedAccount(email, code);

    return res.status(201).json({
      message:
        "Użytkownik utworzony, kod weryfikacyjny został wysłany na email",
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

    if (!user)
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });

    const isMatch = await verifyPassword(user.password, password);

    if (!isMatch)
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });

    if (!user.isVerified)
      return res.status(403).json({
        message: "Zweryfikuj email, kod został wysłany na adres email",
        isVerified: false,
      });

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

    const isValidPassword = await verifyPassword(user.password, password);

    if (!isValidPassword) {
      return res.status(401).json({
        message: "Nieprawidłowe obecne hasło",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

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
    const user = await User.findById(userId).select(
      "login email emailChangeCodeExpires",
    );

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
export const resendVerification = async (req, res) => {
  try {
    const { login } = req.body;

    if (!login)
      return res.status(400).json({
        message: "Login jest wymagany",
      });

    const user = await User.findOne({ login });

    if (!user)
      return res.status(404).json({
        message: "Użytkownik nie istnieje",
      });

    if (user.isVerified)
      return res.status(400).json({
        message: "Konto jest już zweryfikowane",
      });

    const { code, hashedCode } = generateVerificationToken();

    user.verifiedChangeCode = hashedCode;
    user.verifiedChangeCodeExpires = Date.now() + 1000 * 60 * 60;

    await user.save();

    await sendRequestVerifiedAccount(user.email, code);

    return res.status(200).json({
      message: "Nowy link weryfikacyjny został wysłany na adres email",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
export const requestEmailChange = async (req, res) => {
  try {
    const { email } = req.body;
    const { newEmail } = req.body;
    const { userId } = req.query;

    if (!email) return res.status(400).json({ message: "Email wymagany" });

    if (!newEmail)
      return res.status(400).json({ message: "Nowy email wymagany" });

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Użytkownik nie istnieje" });

    const existingUser = await User.findOne({ email: newEmail });

    if (existingUser)
      return res.status(400).json({ message: "Email jest zajęty" });

    const { code, hashedCode } = generateNumericCode();

    user.emailChangeCode = hashedCode;
    user.emailChangeCodeExpires = Date.now() + 1000 * 60 * 10;
    user.pendingEmail = newEmail;

    await user.save();

    await sendEmailChangeCode(user.email, code);

    return res.status(200).json({
      message: "Kod został wysłany na stary email",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const confirmEmailChange = async (req, res) => {
  try {
    const { code } = req.body;
    const { userId } = req.query;

    if (!code) return res.status(400).json({ message: "Kod wymagany" });

    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ message: "Użytkownik nie istnieje" });

    if (user.emailChangeCodeExpires < Date.now())
      return res.status(400).json({
        message: "Kod wygasł",
      });

    const hashedCode = hashToken(code);

    if (hashedCode !== user.emailChangeCode)
      return res.status(400).json({
        message: "Nieprawidłowy kod",
      });

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeCode = undefined;
    user.emailChangeCodeExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Email został zmieniony",
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
export const confirmAccount = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({
        message: "Brak tokenu weryfikacyjnego",
      });

    const hashedToken = hashToken(token);

    const user = await User.findOne({
      verifiedChangeCode: hashedToken,
      verifiedChangeCodeExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message: "Token jest nieprawidłowy lub wygasł",
      });

    user.isVerified = true;
    user.verifiedChangeCode = undefined;
    user.verifiedChangeCodeExpires = undefined;

    await user.save();

    return res.status(200).json({
      message: "Konto zostało zweryfikowane",
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
