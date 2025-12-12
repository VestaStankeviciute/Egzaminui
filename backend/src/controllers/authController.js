const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Slaptažodžio hash salt
const SALT_ROUNDS = 10;
const JWT_SECRET = "tavo_slaptazodis"; // vėliau galima į .env

// Registracija
const register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Visi laukai privalomi" });
  }

  try {
    // Patikrina ar jau yra vartotojas
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Vartotojas su šiuo el. paštu jau egzistuoja" });
    }

    // Hash slaptažodžio
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Įrašo į DB
    const [result] = await db.query(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: "Registracija sėkminga" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Įveskite email ir slaptažodį" });

  try {
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) return res.status(400).json({ message: "Vartotojas nerastas" });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Neteisingas slaptažodis" });

    // Sukuria JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

module.exports = { register, login };
