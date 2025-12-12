const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/users", require("./routes/users"));
app.use("/api/ratings", require("./routes/ratings"));

// Test route
app.get("/", (req, res) => res.send("Backend veikia!"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Serveris paleistas ant porto ${PORT}`));
