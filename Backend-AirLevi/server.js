const express = require('express')
const cors = require('cors')
const path = require('path')
const cookieParser = require('cookie-parser')
const axios = require('axios')

const app = express()
const http = require('http').createServer(app)

// Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

// setupSocketAPI(server)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: [
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

// app.post('/ask-ai', async (req, res) => {
//     const question = req.body.question;
//     if (!question) {
//         return res.status(400).send({ error: 'Question is required' })
//     }

//     try {
//         const response = await axios.post('https://api.openai.com/v1/completions', {
//             model: 'text-davinci-003',
//             prompt: question,
//             max_tokens: 150
//         }, {
//             headers: {
//                 'Authorization': `Bearer YOUR_OPENAI_API_KEY`
//             }
//         })
//         res.json({ answer: response.data.choices[0].text.trim() })
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Failed to get an answer from AI' })
//     }
// })

// routes
const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/stay', stayRoutes)
setupSocketAPI(http)

app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})


const logger = require('./services/logger.service')
const PORT = process.env.PORT || 3030
http.listen(PORT, () => {
    logger.info('Server is running on port: ' + port)
})