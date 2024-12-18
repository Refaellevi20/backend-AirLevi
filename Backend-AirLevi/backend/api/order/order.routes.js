const express = require('express')
const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const { getOrders, addOrder, deleteOrder, updateOrder, addOrderMsg, removeOrderMsg } = require('./order.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getOrders)
router.post('/',  log, requireAuth, addOrder)
router.put('/:id', log, requireAuth, updateOrder)
router.delete('/:id', requireAuth, deleteOrder)

router.post('/:id/msg', requireAuth, addOrderMsg)
router.delete('/:id/msg/:msgId', requireAuth, removeOrderMsg)
module.exports = router