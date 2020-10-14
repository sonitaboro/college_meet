const express = require('express')
const app = express() //app variable to run express()
const server = require('http').Server(app) // allows us to create a server to be used with socket IO
const io = require('socket.io')(server) //bringing socket IO so that server passes to it after express
const { v4: uuidV4 } = require('uuid') //v4 is a function & renamed as uuidV4

// setting up our express server to have a route at this home page
app.set('view engine', 'ejs') // rendering our views
app.use(express.static('public')) // static folder i.e public folder where our JS & CSS file will be there 

//get route
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)  //redirecting users 
})

//creating room
app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
       socket.join(roomId)
       socket.to(roomId).broadcast.emit('user-connected', userId)

       socket.on('disconnect', () => {
           socket.to(roomId).broadcast.emit('user-disconnected', userId)
       })
    })
}) 

server.listen(3000) // starting our server in port 3000. Server is for setting up our rooms

