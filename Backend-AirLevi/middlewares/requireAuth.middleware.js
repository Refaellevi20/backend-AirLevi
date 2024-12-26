const authService = require('../api/auth/auth.service')
const logger = require('../services/logger.service')
const config = require('../config')
const asyncLocalStorage = require('../services/als.service')

function requireAuth(req, res, next) {
  const { loggedinUser } = asyncLocalStorage.getStore()
  console.log('loggedinUser', loggedinUser)
  if (config.isGuestMode && !loggedinUser) {
    req.loggedinUser = { _id: '', fullname: 'Guest' }
    return next()
  }
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  req.loggedinUser=loggedinUser
  //IS THIS RIGHT???
  next()
}

function requireAdmin(req, res, next) {
  const { loggedinUser } = asyncLocalStorage.getStore()
  if (!loggedinUser) return res.status(401).send('Not Authenticated')
  if (!loggedinUser.isAdmin) {
    logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
    res.status(403).end('Not Authorized')
    return
  }
  next()
}


// module.exports = requireAuth

module.exports = {
  requireAuth,
  requireAdmin
}
