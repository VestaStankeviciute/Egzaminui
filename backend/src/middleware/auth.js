const jwt = require("jsonwebtoken");

// Middleware tikrinimui, ar vartotojas prisijungęs
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) return res.status(401).json({ message: "Token nerastas" });

  jwt.verify(token, "TAVO_SLAPTAZODIS", (err, user) => {
    if (err) return res.status(403).json({ message: "Token neteisingas" });
    req.user = user; // pridedam vartotojo info į request
    next();
  });
};

// Middleware tikrinimui, ar vartotojas yra admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Reikalingos administratoriaus teisės" });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };
