const { response, request } = require("express");
const Evento = require("../models/Evento");
// OBTIENE TODOS  LOS EVENTOS
const getEventos = async (req = request, res = response) => {
  try {
    const eventos = await Evento.find().populate("user", "name");
    return res.status(200).json({
      ok: true,
      eventos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor Hable con el Administrador",
    });
  }
};
// CREA UN EVENTO
const crearEvento = async (req = request, res = response) => {
  const evento = new Evento(req.body);
  const { uid } = req;
  try {
    evento.user = uid;
    const eventoGuardado = await evento.save();
    return res.status(200).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor Hable con el Administrador",
    });
  }
};
// ACTUALIZA UN EVENTO
const actualizarEvento = async (req = request, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con id: " + eventoId,
      });
    }
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para editar este evento.",
      });
    }
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );
    return res.status(200).json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor Hable con el Administrador",
    });
  }
};
// BORRA UN EVENTO
const eliminarEvento = async (req = request, res = response) => {
  const eventoId = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe con id: " + eventoId,
      });
    }
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene privilegios para eliminar este evento.",
      });
    }
    const eventoEliminado = await Evento.findByIdAndRemove(eventoId);
    return res.status(200).json({
      ok: true,
      evento: eventoEliminado,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor Hable con el Administrador",
    });
  }
};
module.exports = { getEventos, crearEvento, actualizarEvento, eliminarEvento };
