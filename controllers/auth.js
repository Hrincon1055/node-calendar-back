const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const Usuario = require("../models/Usuario");
// CREA UN NUEVO USUARIO
const crearUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese correo.",
      });
    }
    const usuarioDB = new Usuario(req.body);
    const salt = bcrypt.genSaltSync();
    usuarioDB.password = bcrypt.hashSync(password, salt);
    await usuarioDB.save();
    const token = await generarJWT(usuarioDB.id, usuarioDB.name);
    return res.status(201).json({
      ok: true,
      uid: usuarioDB.id,
      name: usuarioDB.name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Por favor Hable con el Administrador" });
  }
};
// LOGUEA UN USUARIO EN LA APLICACION
const loginUsuario = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe  con ese correo.",
      });
    }
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password Incorrecto.",
      });
    }
    const token = await generarJWT(usuario.id, usuario.name);
    return res.status(200).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ ok: false, msg: "Por favor Hable con el Administrador" });
  }
};
// REFRESCA EL TOKEN DEL USUARIO
const revalidarToken = async (req = request, res = response) => {
  const { uid, name } = req;
  const token = await generarJWT(uid, name);
  return res.json({
    ok: true,
    uid,
    name,
    token,
  });
};
module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
