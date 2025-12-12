const db = require("../config/db");

// Sukurti renginį
const createEvent = async (req, res) => {
  const { title, description, category_id, date, location, photo } = req.body;
  const user_id = req.user.id;

  if (!title || !category_id || !date || !location) {
    return res.status(400).json({ message: "Trūksta privalomų laukų" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO events (title, description, category_id, date, location, photo, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, category_id, date, location, photo, user_id]
    );
    res.status(201).json({ message: "Renginys sukurtas", eventId: result.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

// Gauti visus renginius / filtruoti
const getEvents = async (req, res) => {
  const { category_id, date } = req.query;

  let query = "SELECT e.*, c.title AS category FROM events e LEFT JOIN categories c ON e.category_id = c.id WHERE 1";
  let params = [];

  if (category_id) {
    query += " AND e.category_id = ?";
    params.push(category_id);
  }
  if (date) {
    query += " AND DATE(e.date) = ?";
    params.push(date);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

// Redaguoti savo renginį
const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, category_id, date, location, photo } = req.body;
  const user_id = req.user.id;

  try {
    const [event] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    if (event.length === 0) return res.status(404).json({ message: "Renginys nerastas" });
    if (event[0].user_id !== user_id) return res.status(403).json({ message: "Negalite redaguoti svetimo renginio" });

    await db.query(
      "UPDATE events SET title = ?, description = ?, category_id = ?, date = ?, location = ?, photo = ? WHERE id = ?",
      [title, description, category_id, date, location, photo, id]
    );
    res.json({ message: "Renginys atnaujintas" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

// Ištrinti savo renginį
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    const [event] = await db.query("SELECT * FROM events WHERE id = ?", [id]);
    if (event.length === 0) return res.status(404).json({ message: "Renginys nerastas" });
    if (event[0].user_id !== user_id) return res.status(403).json({ message: "Negalite trinti svetimo renginio" });

    await db.query("DELETE FROM events WHERE id = ?", [id]);
    res.json({ message: "Renginys ištrintas" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

// Admin: patvirtinti renginį
const approveEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("UPDATE events SET is_approved = 1 WHERE id = ?", [id]);
    res.json({ message: "Renginys patvirtintas" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serverio klaida" });
  }
};

module.exports = { createEvent, getEvents, updateEvent, deleteEvent, approveEvent };
