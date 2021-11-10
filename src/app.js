const express = require('express');
const cors = require('cors');
const connect = require('./utils/databaseConfig');
const usersRouter = require('./routes/users');
const receiptRouter = require('./routes/receipts');
const passport = require('./utils/passport');

const app = express();

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: '*'
}));

app.use('/api/users', usersRouter);
app.use('/api/receipt', receiptRouter);
app.get('/' , (req, res) => {
    res.status(200).json({message: 'This is my front page'});
})
connect();

app.listen(process.env.PORT || 5000 , () => console.log('Server running.'));