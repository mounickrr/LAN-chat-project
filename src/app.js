const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs')
const socket = require('socket.io')

let server = app.listen(process.env.PORT || 3200, () => {
    console.log('listening on 3200')
})

let io = socket(server)

io.on('connection', (socket) => {
    socket.broadcast.emit('userStatus', 'a new user is connected')

    fileRead(socket)

    socket.on('message', (data) => {
        let dataToStore = `
            <div style="background-color:white;box-shadow: 3px 4px 20px black;margin:1%;margin-left:5%;width:50%;border-radius:10px">
            <div style="margin:10px">
            <span style="color:blue;">${socket.handshake.address}</span>:
            <br>${data.typedText}<br>
            </div>
            </div>`
        writeFile(dataToStore, socket)

    })
})

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/../public/'))


function writeFile(toStore, socket) {
    fs.appendFile('store.html', toStore, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            socket.broadcast.emit('incoming', toStore)
            socket.emit('incoming', toStore)
        }
    })
}

function fileRead(socket) {
    fs.readFile('store.html', (err, data) => {
        if (err) 
            console.log(err)
        else 
            socket.emit('onLoad', data.toString())
    })
}


