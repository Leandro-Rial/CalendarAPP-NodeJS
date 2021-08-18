require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config')

const app = express();

// base de datos
dbConnection()

// cors
app.use(cors());

// Directorio publico
app.use(express.static('public'));

// lectura y parseo deñ body
app.use(express.json())

// Rutas
app.use('/api/auth', require('./routes/auth'));

app.listen((process.env.PORT), () => {
    console.log(`Server corriendo en puerto ${process.env.PORT}`);
})