const express = require('express');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const userRoutes = require('./routes/user');

const chatRoutes = require('./routes/chat');

const User = require('./models/user')

const Chat = require('./models/chat')

app.use(cors({
    origin: "http://127.0.0.1:5500",
    credentials: true
}));

app.use(bodyParser.json());

app.use('/user', userRoutes);

app.use('/chat', chatRoutes)

User.hasMany(Chat);
Chat.belongsTo(User);

sequelize.sync()
// sequelize.sync({force: true})
.then(() => {
    console.log('Server online');
    app.listen(3000);
})
.catch((err) => {
    console.log(err.message);
})
