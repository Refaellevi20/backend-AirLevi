const logger = require('../services/logger.service')

async function log(req, res, next) {
  // logger.info('Sample Logger Middleware')
  next()
}

async function requireAuth(req, res, next) {
  if (!req.loggedinUser) {
      res.status(401).send('Not Authenticated')
      return
  }
  next()
}

// Add this new middleware for checking owner rights
async function requireOwner(req, res, next) {
  if (!req.loggedinUser) {
      res.status(401).send('Not Authenticated')
      return
  }
 
  if (!req.loggedinUser.isOwner) {
      res.status(403).send('Not Authorized')
      return
  }
  next()
}

module.exports = {
  log,
  // requireOwner,
  // requireAuth
}
