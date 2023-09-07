const express = require('express');

const app = express();

const cors = require('cors');

const bodyParser = require('body-parser');

const CronJob = require('cron').CronJob;

const sequelize = require('./utils/database');

const userRoutes = require('./routes/user');

const chatRoutes = require('./routes/chat');

const groupRoutes = require('./routes/group');

const adminRoutes = require('./routes/admin');

const User = require('./models/user');

const Chat = require('./models/chat');

const Group = require('./models/group');

const Members = require('./models/group-members');

const archivedChat = require('./models/archived-chats');

const path = require('path');

const { Op } = require('sequelize');

require('dotenv').config();

app.use(cors({
    origin: ['http://13.232.181.11:80', 'http://13.232.181.11:4000'],
    credentials: true
}));

app.use(express.urlencoded({extended: false}));

app.use(bodyParser.json())

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

var job = new CronJob(
    '0 1 * * *',
    async function() {
        const t = await sequelize.transaction();
        try {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            const chats = await Chat.findAll({where: {createdAt: {[Op.lt]: oneDayAgo}}});
            chats.forEach(async (chat) => {
                await archivedChat.create(chat, {transaction: t});
                await Chat.destroy({where: {id: chat.id}, transaction: t});
            });
            await t.commit();
        } catch (error) {
            await t.rollback();
            console.log(error.message);
        }
    },
    null,
    true,
    'Asia/Kolkata'
);

sequelize.sync()
.then(() => {
    console.log('Server online');
    app.listen(process.env.PORT);
})
.catch((err) => {
    console.log(err.message);
})
