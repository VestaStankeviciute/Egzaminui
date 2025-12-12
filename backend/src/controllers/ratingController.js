const db = require("../config/db");

// Įvertinti renginį
const rateEvent = async (req, res) => {
  const { event_id } = req.body;
  const user_id = req.user.id;

  if (!event_id) return res.status(400).json({ message: "Nenurodytas renginys" });

  try {
    await db.query("INSERT INTO ratings (event_id, user_id) VALUES (?, ?)", [event_id, user_id]);
    res.json({ message: "Įvertinta" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

// Bendras reitingas
const getRating = async (req, res) => {
  const { event_id } = req.params;

  try {
    const [rows] = await db.query("SELECT COUNT(*) AS total FROM ratings WHERE event_id = ?", [event_id]);
    res.json({ total: rows[0].total });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

module.exports = { rateEvent, getRating };
