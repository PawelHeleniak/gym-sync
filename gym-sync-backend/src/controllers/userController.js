import crypto from "crypto";
import argon2 from "argon2";
import nodemailer from "nodemailer";

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

    const code = crypto.randomBytes(32).toString("hex");
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    const user = await User.create({
      email,
      login,
      password: hashedPassword,
      verifiedChangeCode: hashedCode,
      verifiedChangeCodeExpires: Date.now() + 1000 * 60 * 60,
    });

    await user.save();

    await sendRequestVerifiedAccount(email, code);

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

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    const isMatch = await argon2.verify(user.password, password);

    if (!isMatch) {
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Zweryfikuj email, kod został wysłany na adres email",
        isVerified: false,
      });
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

    const code = crypto.randomBytes(32).toString("hex");
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

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
// Transporter SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
export const sendRequestVerifiedAccount = async (to, code) => {
  await transporter.sendMail({
    from: `"RepEvo" <${process.env.SMTP_USER}>`,
    to,
    subject: "Link do weryfikacji konta",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
      <tr>
        <td align="left">
          <p style="font-size: 24px; font-weight: bold;">
            Twój kod to:
          </p>
          <a href="https://repevo.pl/autoryzacja/weryfikacja-konta?token=${code}" style="margin: 0 0 15px 0;">
            Zweryfikuj adres email
          </a>
          <p style="margin: 0;">
            Link jest ważny przez 60 minut.
          </p>

          <div style="height: 1px; background-color: #777; margin: 20px 0;"></div>

          <p style="margin: 0; font-size: 13px; color: #777;">
            Jeśli to nie Ty próbujesz założyć konto, zignoruj tę wiadomość.
          </p>
        </td>
      </tr>
    </table>
      `,
  });
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

    const code = crypto.randomInt(100000, 999999).toString();

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

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
export const sendEmailChangeCode = async (to, code) => {
  await transporter.sendMail({
    from: `"RepEvo" <${process.env.SMTP_USER}>`,
    to,
    subject: "Kod zmiany email",
    html: `
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
      <tr>
        <td align="left">
          <p style="font-size: 24px; font-weight: bold;">
            Twój kod to:
          </p>
          <p style="font-size: 36px; font-weight: bold; color: #9e00b3; margin: 0 0 15px 0;">
            ${code}
          </p>
          <p style="margin: 0 0 5px 0;">
            Kod jest ważny przez 10 minut.
          </p>
          <p style="margin: 0;">
            Kod należy wpisać w panelu użytkownika.
          </p>

          <div style="height: 1px; background-color: #777; margin: 20px 0;"></div>

          <p style="margin: 0; font-size: 13px; color: #777;">
            Jeśli to nie Ty próbujesz zmienić adres email, zignoruj tę wiadomość.
          </p>
        </td>
      </tr>
    </table>
      `,
  });
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

    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

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

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

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
