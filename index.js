const express = require("express");
const { dbConnection } = require("./database/config");
const cors = require("cors");
require("dotenv").config();

// CREAR SERVIDOR
const app = express();
// BASE DE DATOS
dbConnection();
// CORS
app.use(cors());
// DIRECTORIO PUBLICO
app.use(express.static("public"));
// LECTURA Y PARSEO DEL BODY
app.use(express.json());
// RUTAS
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// ESCUCHAR PETICIONES
app.listen(process.env.PORT, () => {
  console.log(`Servidor Corriendo en puerto: ${process.env.PORT}`);
});
