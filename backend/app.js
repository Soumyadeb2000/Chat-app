const express = require('express');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const sequelize = require('./utils/database');

const userRoutes = require('./routes/user');

const chatRoutes = require('./routes/chat');

const groupRoutes = require('./routes/group');

const adminRoutes = require('./routes/admin');

const User = require('./models/user');

const Chat = require('./models/chat');

const Group = require('./models/group');

const Members = require('./models/group-members');

const path = require('path');

require('dotenv').config();

app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}));

app.use(bodyParser.json());

app.use('/ChatApp/user', userRoutes);

app.use('/ChatApp/chat', chatRoutes);

app.use('/ChatApp/group', groupRoutes);

app.use('/ChatApp/admin', adminRoutes);

app.use((req, res) => {
    const url = req.url
    console.log(url);
    res.sendFile(path.join(__dirname, `public/${url}`));
})

User.hasMany(Chat);
Chat.belongsTo(User);

Group.belongsToMany(User, {through: Members});
User.belongsToMany(Group, {through: Members});

Members.belongsTo(User);
User.hasMany(Members);

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize.sync()
.then(() => {
    console.log('Server online');
    app.listen(process.env.PORT);
})
.catch((err) => {
    console.log(err.message);
})
