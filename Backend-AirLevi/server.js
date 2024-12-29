// const express = require('express')
// const cors = require('cors')
// const path = require('path')
// const cookieParser = require('cookie-parser')
// const axios = require('axios')
// require('dotenv').config()

// const app = express()
// const http = require('http').createServer(app)


// // Express App Config
// app.use(express.static('public'))
// app.use(cookieParser())
// app.use(express.json())

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.resolve(__dirname, 'public')))
// } else {
//     const corsOptions = {
//         origin: [
//             'http://127.0.0.1:3000',
//             'http://localhost:3000',
//             'http://127.0.0.1:3030',
//             'http://localhost:3030',
//             'http://127.0.0.1:8080',
//             'http://localhost:8080',
//             'http://127.0.0.1:5173',
//             'http://localhost:5173',
//             'http://127.0.0.1:5174',
//             'http://localhost:5174'],
//         credentials: true
//     }
//     app.use(cors(corsOptions))
// }

// // const groupRoutes = require('./api/group/group.routes')
// const authRoutes = require('./api/auth/auth.routes')
// const userRoutes = require('./api/user/user.routes')
// const orderRoutes = require('./api/order/order.routes')
// const stayRoutes = require('./api/stay/stay.routes')
// const { setupSocketAPI } = require('./services/socket.service')

// // routes
// const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
// app.all('*', setupAsyncLocalStorage)

// // app.use('/api/group', groupRoutes)
// app.use('/api/auth', authRoutes)
// app.use('/api/user', userRoutes)
// app.use('/api/order', orderRoutes)
// app.use('/api/stay', stayRoutes)
// setupSocketAPI(http)

// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })


// const logger = require('./services/logger.service')
// const PORT = process.env.PORT || 3030
// http.listen(PORT, () => {
//     logger.info(`Server running at http://localhost:${PORT}`)
// })

// // "scripts": {
// //     "start": "node server.js",
// //     "dev": "nodemon server.js",
// //     "server:dev": "nodemon server.js",
// //     "server:prod": "set NODE_ENV=production&&node server.js",
// //     "server:prod:win": "set NODE_ENV=production&&node server.js"
// // },

// const express = require('express')
// const cors = require('cors')
// const path = require('path')
// const cookieParser = require('cookie-parser')
// const dbService = require('./services/db.service')
// const logger = require('./services/logger.service')

// const app = express()
// const http = require('http').createServer(app)

// // Express App Config
// app.use(cookieParser())
// app.use(express.json())

// if (process.env.NODE_ENV === 'production') {
//     // Express serve static files on production environment
//     app.use(express.static(path.resolve(__dirname, 'public')))
// } else {
//     // Configuring CORS for development
//     const corsOptions = {
//         origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
//         credentials: true
//     }
//     app.use(cors(corsOptions))
// }

// // Routes
// const authRoutes = require('./api/auth/auth.routes')
// const userRoutes = require('./api/user/user.routes')
// const orderRoutes = require('./api/order/order.routes')
// const stayRoutes = require('./api/stay/stay.routes')
// const { setupSocketAPI } = require('./services/socket.service')

// app.use('/api/auth', authRoutes)
// app.use('/api/user', userRoutes)
// app.use('/api/order', orderRoutes)
// app.use('/api/stay', stayRoutes)
// setupSocketAPI(http)

// // Make every server-side-route to match the index.html
// // so when requesting http://localhost:3030/index.html/stay/123 it will still respond with
// // our SPA (single page app) (the index.html file) and allow vue-router to take it from there
// app.get('/**', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

// const PORT = process.env.PORT || 3030

// async function startServer() {
//     try {
//         await dbService.connect()
//         http.listen(PORT, () => {
//             logger.info(`Server is running on port: ${PORT}`)
//             logger.info(`Server is running in ${process.env.NODE_ENV} mode`)
//         })
//     } catch (err) {
//         logger.error('Cannot connect to DB', err)
//         process.exit(1)
//     }
// }

// startServer()


const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const dbService = require('./services/db.service')
const logger = require('./services/logger.service')

const app = express()
const http = require('http').createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())

if (process.env.NODE_ENV === 'production') {
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    // Configuring CORS for development
    const corsOptions = {
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

// Routes
const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const orderRoutes = require('./api/order/order.routes')
const stayRoutes = require('./api/stay/stay.routes')
const { setupSocketAPI } = require('./services/socket.service')

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/stay', stayRoutes)
setupSocketAPI(http)

// Make every server-side-route to match the index.html
// so when requesting http://localhost:3030/index.html/stay/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const PORT = process.env.PORT || 3030

async function startServer() {
    try {
        await dbService.connect()
        http.listen(PORT, () => {
            logger.info(`Server is running on port: ${PORT}`)
            logger.info(`Server is running in ${process.env.NODE_ENV} mode`)
        })
    } catch (err) {
        logger.error('Cannot connect to DB', err)
        process.exit(1)
    }
}

startServer()