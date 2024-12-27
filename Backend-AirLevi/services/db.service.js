const MongoClient = require('mongodb').MongoClient
const config = require('../config')
const logger = require('./logger.service')

// module.exports = {
//     getCollection
// }

const dbService = {
    getCollection
}

module.exports = dbService


var dbConn = null

async function getCollection(collectionName) {
    try {
        const db = await connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function connect() {
    if (dbConn) return dbConn
    try {
        console.log('config:', config)
        console.log('Attempting to connect to MongoDB...')
        const client = await MongoClient.connect(config.dbURL);

        const db = client.db(config.dbName)
        dbConn = db
        console.log('Successfully connected to MongoDB.')
        return db
    } catch (err) {
        console.error('Connection error details:', err.message)
        logger.error('Cannot connect to DB', err)
        throw err
    }
}



