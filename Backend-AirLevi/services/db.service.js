// const MongoClient = require('mongodb').MongoClient
// const config = require('../config')
// const logger = require('./logger.service')

// // module.exports = {
// //     getCollection
// // }

// const dbService = {
//     getCollection
// }

// module.exports = dbService


// var dbConn = null

// async function getCollection(collectionName) {
//     try {
//         const db = await connect()
//         const collection = await db.collection(collectionName)
//         return collection
//     } catch (err) {
//         logger.error('Failed to get Mongo collection', err)
//         throw err
//     }
// }

// async function connect() {
//     if (dbConn) return dbConn
//     try {
//         console.log('config',config)
//         console.log('Attempting to connect to the database...')
//         const client = await MongoClient.connect(config.dbURL)
//         const db = client.db(config.dbName)
//         dbConn = db
//         console.log('Connected to the database')
//         return db
//     } catch (err) {
//         logger.error('Cannot Connect to DB', err)
//         throw err
//     }
// }

const MongoClient = require('mongodb').MongoClient
const config = require('../config')
const logger = require('./logger.service')

const dbService = {
    getCollection
}

module.exports = dbService

var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        console.log('Database URL:', config.dbURL)
        console.log('Database Name:', config.dbName)
        if (!config.dbURL) throw new Error('Database URL is missing or undefined.')

        console.log('Attempting to connect to the database...')
        const client = await MongoClient.connect(config.dbURL)
        const db = client.db(config.dbName)
        dbConn = db
        console.log('Connected to the database')
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}
