const { Router } = require("express");
const { check } = require("express-validator");
const {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
} = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = Router();
router.use(validarJWT);
/**
 * Rutas de Eventos / events
 * host + /api/events
 */

// OBTENER EVENTOS
router.get("/", getEventos);
// CREA UN EVENTO
router.post(
  "/",
  [
    check("title", "El titulo es requerido.").not().isEmpty(),
    check("start", "La fecha de inicio es requerida.").custom(isDate),
    check("end", "La fecha de fin es requerida.").custom(isDate),
    validarCampos,
  ],
  crearEvento
);
// ACTUALIZA UN EVENTO
router.put(
  "/:id",
  [check("id", "No es un ID valido de mongo.").isMongoId(), validarCampos],
  actualizarEvento
);
// BORRA UN EVENTO
router.delete(
  "/:id",
  [check("id", "No es un ID valido de mongo.").isMongoId(), validarCampos],
  eliminarEvento
);
// EXPORTACIONES
module.exports = router;
