const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const  ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    const store = asyncLocalStorage.getStore()
    const { loggedinUser } = store
    try {
        const criteria = _buildCriteria(filterBy)
        console.log(loggedinUser._id, 'loggedinUser._id')
        console.log('Criteria:', criteria)

        // const buyers = await dbService.getCollection('user').find({ _id: new ObjectId(loggedinUser._id) }).toArray();
        // console.log('Buyers:', buyers);
        
        // const stays = await dbService.getCollection('stay').find({ _id: new ObjectId('676334c7bb16c66df3f13fe3') }).toArray();
        // console.log('Stays:', stays)

        const collection = await dbService.getCollection('orders')

        // First match condition check
        const matchResult = await collection.find({
            $or: [
                { "buyerId": new ObjectId(loggedinUser._id) },
                { "hostId": new ObjectId(loggedinUser._id) }
            ]
        }).toArray()
        // console.log('Match Result:', matchResult) //*v 

        var orders = await collection.aggregate([
            {
                $match: {
                    $or: [
                        { "buyerId": new ObjectId(loggedinUser._id) },
                        { "hostId": new ObjectId(loggedinUser._id) }
                    ]
                }
            },
            {
                $match: criteria
            },
            {
                $lookup: {
                    localField: 'buyerId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'buyer'
                }
            },
            {
                $unwind: {
                    path: '$buyer',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    localField: 'stayId',
                    from: 'stay',
                    foreignField: '_id',
                    as: 'stay'
                }
            },
            {
                $unwind: {
                    path: '$stay',
                    preserveNullAndEmptyArrays: true 
                }
            }
        ]).toArray()

        console.log('After unwind - Orders:', orders)

        // Mapping the result
        orders = orders.map(order => {
            console.log(order, 'order before mapping')

            order.buyer = { _id: order.buyer._id, fullname: order.buyer.fullname, imgUrl: order.buyer.imgUrl }
            order.createdAt = order._id.getTimestamp()
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
            buyerId: new ObjectId(order.buyerId),
            stayId: new ObjectId(order.stayId),
            hostId: new ObjectId(order.hostId),
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            msgs: order.msgs,
            status: order.status
        }
        const collection = await dbService.getCollection('orders')
        await collection.insertOne(orderToAdd)
        console.log('buyerId:', order.buyerId, 'stayId:', order.stayId);

        return orderToAdd
    } catch (err) {
        logger.error('cannot insert order', err)
        throw err
    }
}

async function update(order) {
    try {
        const orderToAdd = {
            buyerId: new ObjectId(order.buyer._id),
            stayId: new ObjectId(order.stay._id),
            hostId: new ObjectId(order.hostId),
            totalPrice: order.totalPrice,
            startDate: order.startDate,
            endDate: order.endDate,
            guests: order.guests,
            msgs: order.msgs,
            status: order.status
        }
        const collection = await dbService.getCollection('orders')
        await collection.updateOne({ _id: new ObjectId(order._id) }, { $set: orderToAdd })
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
        const collection = await dbService.getCollection('orders')
        const criteria = { _id: new ObjectId(orderId) }

        // remove only if user is admin or the review's owner
        if (!loggedinUser.isAdmin) criteria.hostId = new ObjectId(loggedinUser._id)

        const { deletedCount } = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove order ${orderId}`, err)
        throw err
    }
}


async function getById(orderId) {
    try {
        const collection = await dbService.getCollection('orders')
        const order = await collection.findOne({ '_id': new ObjectId(orderId) })
        return order
    } catch (err) {
        logger.error(`while finding order ${orderId}`, err)
        throw err
    }
}


function _buildCriteria(filterBy) {
    const criteria = {}
    // if (filterBy.status) criteria.status = filterBy.status
    // if (filterBy.startDate) criteria.startDate = { $gte: new Date(filterBy.startDate) }
    // if (filterBy.endDate) criteria.endDate = { $lte: new Date(filterBy.endDate) }
    return criteria
}



module.exports = {
    query,
    add,
    update,
    remove,

    getById
}

// addOrderMsg,
// removeOrderMsg,
// async function addOrderMsg(orderId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         msg.createdAt = Date.now()
//         delete (msg.to)
//         const collection = await dbService.getCollection('orders')
//         await collection.updateOne({ _id: new ObjectId(orderId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add order message ${orderId}`, err)
//         throw err
//     }
// }


// async function removeOrderMsg(orderId, msgId) {
//     try {
//         const collection = await dbService.getCollection('orders')
//         await collection.updateOne({ _id: new ObjectId(orderId) }, { $pull: { msgs: { id: msgId } } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot remove order message ${orderId}`, err)
//         throw err
//     }
// }
