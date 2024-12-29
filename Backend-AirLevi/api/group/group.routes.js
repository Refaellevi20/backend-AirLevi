const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { getGroups, getGroupById, addGroup, updateGroup, removeGroup, addGroupMsg, removeGroupMsg } = require('./group.controller')
const router = express.Router()

// Group CRUD
router.get('/', requireAuth, getGroups)
router.get('/:id', requireAuth, getGroupById)
router.post('/', requireAuth, addGroup)
router.put('/:id', requireAuth, updateGroup)
router.delete('/:id', requireAuth, removeGroup)

// Group Messages
router.post('/:id/msg', requireAuth, addGroupMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeGroupMsg)

module.exports = router