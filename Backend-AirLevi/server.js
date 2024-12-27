const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const axios = require('axios')
require('dotenv').config()

const app = express()
const server = require('http').createServer(app)

// Express App Config
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: [
            'http://127.0.0.1:3000',
             'http://localhost:3000',
            'http://127.0.0.1:8080',
            'http://localhost:8080',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://127.0.0.1:5174',
            'http://localhost:5174'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const orderRoutes = require('./api/order/order.routes')
const stayRoutes = require('./api/stay/stay.routes')
const {setupSocketAPI} = require('./services/socket.service')


// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/stay', stayRoutes)
setupSocketAPI(server)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


const logger = require('./services/logger.service')
const PORT = process.env.PORT || 3030
server.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`)
})

// "scripts": {
//     "start": "node server.js",
//     "dev": "nodemon server.js",
//     "server:dev": "nodemon server.js",
//     "server:prod": "set NODE_ENV=production&&node server.js",
//     "server:prod:win": "set NODE_ENV=production&&node server.js"
// },