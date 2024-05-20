const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
require('dotenv').config();
// const app = express();
const connectDB = require('./config/connectDB');
const router = require('./routes/index')
const cookiesParser=require('cookie-parser')
const {app,server}=require('./socket/index')

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(bodyParser.json())
app.use(cookiesParser())
const PORT = process.env.PORT || 8080;

app.get('/', (request, response) => {
    response.json({
        message: "Server running at " + PORT
    });
});

//api end pts
app.use('/api',router)

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server running at " + PORT);
    });
});
