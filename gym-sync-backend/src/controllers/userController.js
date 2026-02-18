import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });

    if (!user) {
      return res.status(401).json({ message: "Nieprawidłowe dane logowania" });
    }

    if (user.password !== password) {
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

export const register = async (req, res) => {
  try {
    const { email, login, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ login }, { email }],
    });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
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
        message: "Hasło musi mieć min. 6 znaków, 1 dużą literę i 1 cyfrę",
      });
    }

    const user = await User.create({
      email,
      login,
      password,
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
