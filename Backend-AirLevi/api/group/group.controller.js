const groupService = require('./group.service')
const logger = require('../../services/logger.service')

async function getGroups(req, res) {
    try {
        const groups = await groupService.query(req.query)
        res.json(groups)
    } catch (err) {
        logger.error('Failed to get groups', err)
        res.status(500).send({ err: 'Failed to get groups' })
    }
}

async function getGroupById(req, res) {
    try {
        const group = await groupService.getById(req.params.id)
        res.json(group)
    } catch (err) {
        logger.error('Failed to get group', err)
        res.status(500).send({ err: 'Failed to get group' })
    }
}

async function addGroup(req, res) {
    try {
        const group = req.body
        const addedGroup = await groupService.add(group)
        res.json(addedGroup)
    } catch (err) {
        logger.error('Failed to add group', err)
        res.status(500).send({ err: 'Failed to add group' })
    }
}

async function updateGroup(req, res) {
    try {
        const group = req.body
        const updatedGroup = await groupService.update(group)
        res.json(updatedGroup)
    } catch (err) {
        logger.error('Failed to update group', err)
        res.status(500).send({ err: 'Failed to update group' })
    }
}

async function removeGroup(req, res) {
    try {
        await groupService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to remove group', err)
        res.status(500).send({ err: 'Failed to remove group' })
    }
}

async function addGroupMsg(req, res) {
    try {
        const groupId = req.params.id
        const msg = req.body
        const savedMsg = await groupService.addGroupMsg(groupId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to add group msg', err)
        res.status(500).send({ err: 'Failed to add group msg' })
    }
}

async function removeGroupMsg(req, res) {
    try {
        const { id: groupId, msgId } = req.params
        const removedId = await groupService.removeGroupMsg(groupId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove group msg', err)
        res.status(500).send({ err: 'Failed to remove group msg' })
    }
}

module.exports = {
    getGroups,
    getGroupById,
    addGroup,
    updateGroup,
    removeGroup,
    addGroupMsg,
    removeGroupMsg
}