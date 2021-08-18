const { response } = require("express");
const Usuario = require("../models/Usuario");
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt')

const crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe",
      });
    }

    usuario = new Usuario(req.body);

    // Encript
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt)

    await usuario.save();

    // JWT
    const token = await generateJWT(usuario.id, usuario.name)

    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario no existe con ese email",
      });
    }

    // Confirm password
    const validPassword = bcrypt.compareSync(password, usuario.password)

    if(!validPassword) {
        res.status(400).json({
            ok: false,
            msg: 'Password Incorrect'
        })
    }

    // JWT
    const token = await generateJWT(usuario.id, usuario.name)

      res.status(201).json({
        ok: true,
        uid: usuario.id,
        name: usuario.name,
        token
      });
      
  } catch (error) {
    res.status(500).json({
        ok: false,
        msg: "Por favor hable con el administrador",
      });
  }

};

const revalidarToken = async (req, res = response) => {

  const { uid, name } = req;

  const token = await generateJWT(uid, name)

  res.json({
    ok: true,
    token
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
