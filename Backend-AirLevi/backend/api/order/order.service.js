const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')


async function query(filterBy = {}) {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('order')
        // var orders = await collection.find(criteria).toArray()
        console.log(loggedinUser._id, 'loggedinUser._id')
        var orders = await collection.aggregate([
            {
                $match: {
                    $or: [
                       { "buyerId": ObjectId(loggedinUser._id) },
                       { "hostId": ObjectId(loggedinUser._id) }
                    ]
                 }
             },
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'buyerId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'buyer'
                }
            },
            {
                $unwind: '$buyer'
            },
            {
                $lookup:
                {
                    localField: 'stayId',
                    from: 'stay',
                    foreignField: '_id',
                    as: 'stay'
                }
            },
            {
                $unwind: '$stay'
            }
        ]).toArray()
        console.log(orders)
        orders = orders.map(order => {
            order.buyer = { _id: order.buyer._id, fullname: order.buyer.fullname, imgUrl: order.buyer.imgUrl }
            order.createdAt=order._id.getTimestamp()
            delete order.buyerId
            delete order.stayId
            return order
        })
        return orders
    } catch (err) {
        logger.error('cannot find orders', err)
        throw err
    }
}


async function add(order) {
    console.log(order.stayId, 'order.stayId')
    try {
        const orderToAdd = {
            buyerId: ObjectId(order.buyerId),
            stayId: ObjectId(order.stayId),
            hostId: ObjectId(order.hostId),
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            msgs: order.msgs,
            status: order.status
        }
        const collection = await dbService.getCollection('order')
        await collection.insertOne(orderToAdd)
        return orderToAdd
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const orderToAdd = {
            buyerId: ObjectId(order.buyer._id),
            stayId: ObjectId(order.stay._id),
            hostId: ObjectId(order.hostId),
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            msgs: order.msgs,
            status: order.status
        }
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(order._id) }, { $set: orderToAdd })
        return orderToAdd
    } catch {
        logger.error(`cannot update order ${order._id}`, err)
        throw err
    }
}

async function remove(orderId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('order')
        const criteria = { _id: ObjectId(orderId) }

        // remove only if user is admin or the review's owner
        if (!loggedinUser.isAdmin) criteria.hostId = ObjectId(loggedinUser._id)

        const {deletedCount} = await collection.deleteOne(criteria)      
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}

async function addOrderMsg(orderId, msg) {
    try {
        msg.id = utilService.makeId()
        msg.createdAt = Date.now()
        delete(msg.to)
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(orderId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add order message ${orderId}`, err)
        throw err
    }
}


async function removeOrderMsg(orderId, msgId){
    try {
        const collection = await dbService.getCollection('order')
        await collection.updateOne({ _id: ObjectId(orderId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot remove order message ${orderId}`, err)
        throw err
    }
}

async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('order')
        const order = await collection.findOne({ '_id': ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    // if (filterBy.stayId) criteria.stayId = filterBy.stayId
    // if (filterBy.orderId) criteria._id = ObjectId(filterBy.orderId)
    return criteria
}



module.exports = {
    query,
    add,
    update,
    remove,
    addOrderMsg,
    removeOrderMsg,
    getById
}