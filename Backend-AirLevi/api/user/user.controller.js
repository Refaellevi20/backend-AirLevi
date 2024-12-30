const userService = require('./user.service')
const socketService = require('../../services/socket.service')
const logger = require('../../services/logger.service')

async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query?.txt || '',
            minBalance: +req.query?.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

async function getAllUserCounts(req, res) {
    try {
        const users = await userService.query()
        const userCounts = users.map(user => ({
            _id: user._id,
            fullname: user.fullname,
            count: user.count
        }))
        res.send(userCounts)
    } catch (err) {
        logger.error('Failed to get user counts', err)
        res.status(500).send({ err: 'Failed to get user counts' })
    }
}


async function updateUserCount(req, res) {
    try {
        const userId = req.params.id
        const user = await userService.updateUserCount(userId)
        res.send(user)
    } catch (err) {
        logger.error('Failed to update user count', err);
        res.status(500).send({ err: 'Failed to update user count' })
    }
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    updateUserCount,
    getAllUserCounts,
}