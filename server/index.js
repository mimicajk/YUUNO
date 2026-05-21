const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Rutas
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// ==============================
// Conectar base de datos
// ==============================
connectDB();

// ==============================
// Middlewares
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// Rutas API
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// ==============================
// Ruta de prueba
// ==============================
app.get("/", (req, res) => {
    res.send("YUUNO Backend funcionando 🚀");
});

// ==============================
// Servidor
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});