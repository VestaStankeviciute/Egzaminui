const db = require("../config/db");

const blockUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE users SET is_blocked = 1 WHERE id = ?", [id]);
    res.json({ message: "Vartotojas užblokuotas" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

module.exports = { blockUser };
