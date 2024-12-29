const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('group')
        const groups = await collection.find(criteria).toArray()
        return groups
    } catch (err) {
        logger.error('cannot find groups', err)
        throw err
    }
}

async function getById(groupId) {
    try {
        const collection = await dbService.getCollection('group')
        const group = await collection.findOne({ _id: new ObjectId(groupId) })
        return group
    } catch (err) {
        logger.error(`while finding group ${groupId}`, err)
        throw err
    }
}

async function add(group) {
    try {
        const collection = await dbService.getCollection('group')
        await collection.insertOne(group)
        return group
    } catch (err) {
        logger.error('cannot insert group', err)
        throw err
    }
}

async function update(group) {
    try {
        const groupToSave = {
            ...group,
            _id: new ObjectId(group._id)
        }
        const collection = await dbService.getCollection('group')
        await collection.updateOne({ _id: groupToSave._id }, { $set: groupToSave })
        return group
    } catch (err) {
        logger.error(`cannot update group ${group._id}`, err)
        throw err
    }
}

async function remove(groupId) {
    try {
        const collection = await dbService.getCollection('group')
        await collection.deleteOne({ _id: new ObjectId(groupId) })
    } catch (err) {
        logger.error(`cannot remove group ${groupId}`, err)
        throw err
    }
}

async function addGroupMsg(groupId, msg) {
    try {
        const collection = await dbService.getCollection('group')
        await collection.updateOne(
            { _id: new ObjectId(groupId) },
            { $push: { msgs: msg } }
        )
        return msg
    } catch (err) {
        logger.error(`cannot add group msg ${groupId}`, err)
        throw err
    }
}

async function removeGroupMsg(groupId, msgId) {
    try {
        const collection = await dbService.getCollection('group')
        await collection.updateOne(
            { _id: new ObjectId(groupId) },
            { $pull: { msgs: { _id: msgId } } }
        )
        return msgId
    } catch (err) {
        logger.error(`cannot remove group msg ${msgId}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
   
    if (filterBy.hostId) {
        criteria.hostId = filterBy.hostId
    }
   
    if (filterBy.memberId) {
        criteria.members = filterBy.memberId
    }

    return criteria
}

module.exports = {
    query,
    getById,
    add,
    update,
    remove,
    addGroupMsg,
    removeGroupMsg
}