//Requeries
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const moment = require('moment');
const SocketIO = require('socket.io');

//Application
const app = express();

//Settings
app.set('port', process.env.PORT || 3000);

//Static Files
app.use(express.static(path.join(__dirname, 'public')));

//Mysql
const db = mysql.createConnection({
    host: '192.168.0.179',
    user: 'root',
    password: 'bcga1303',
    database: 'chat'
});

db.connect((err) => {
    if (err) {
        console.log('Error: ', err);
        throw err;
    }
    console.log('Connected to database');
});

global.db = db;

/********************************************
 * Start server
 *******************************************/
const server = app.listen(app.get('port'), () => {
    console.log('server on port:', app.get('port'));
});

/********************************************
 * Start Socket
 *******************************************/
var conectados = [];
var hoy = moment().format("YYYY-MM-DD");
const io = SocketIO.listen(server);

io.on('connection', (socket) => {
    console.log('new connection', socket.id);
    console.log(conectados);
    io.sockets.emit('chat:conectados', conectados);

    let messagesQuery = "SELECT * FROM `messages` WHERE fecha_hora between '" + hoy + " 00:00:00' AND '" + hoy + " 23:59:59' ";
    db.query(messagesQuery, (err, result) => {
        io.sockets.emit('chat:messages', result);
    });

    socket.on('chat:login', (username) => {
        if (conectados.includes(username) || username == '') {
            console.log('usuario ya existe');
        } else {
            conectados.push(username);
            io.sockets.emit('chat:conectados', conectados);
        }
    });

    //Enviar mensaje a todos los socket conectados
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data);
        //insertar mensaje
        let messageQuery = "INSERT INTO `messages` (username, message) VALUES ('" + data.username + "', '" + data.message + "')";
        db.query(messageQuery, (err, result) => {
            console.log('Error: ', err);
        });
    });
});