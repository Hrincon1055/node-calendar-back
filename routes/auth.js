const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();
/**
 * Rutas de Usuario / auth
 * host + /api/auth
 */

// CREA UN NUEVO USUARIO
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio.").not().isEmpty(),
    check("email", "El email es obligatorio.").isEmail(),
    check("password", "El password debe de ser de 6 caracteres.").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);
// LOGUEA UN USUARIO EN LA APLICACION
router.post(
  "/",
  [
    check("email", "El email es obligatorio.").isEmail(),
    check("password", "El password debe de ser de 6 caracteres.").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);
// REFRESCA EL TOKEN DEL USUARIO
router.get("/renew", validarJWT, revalidarToken);
// EXPORTACIONES
module.exports = router;
