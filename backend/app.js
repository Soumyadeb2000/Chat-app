const express = require('express');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const userRoutes = require('./routes/user');

app.use(cors());

app.use(bodyParser.json());

app.use('/user',userRoutes);

sequelize.sync()
.then(() => {
    console.log('Server online');
    app.listen(3000);
})
.catch((err) => {
    console.log(err.message);
})
