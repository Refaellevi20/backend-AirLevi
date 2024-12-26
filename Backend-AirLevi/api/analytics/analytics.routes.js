const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const { 
    getBookingStats, 
    getRevenueData, 
    getReviewMetrics,
    getOccupancyRates,
    getCustomInsight 
} = require('./analytics.controller')

const router = express.Router()

router.get('/booking/stats', requireAuth, getBookingStats)
router.get('/booking/revenue', requireAuth, getRevenueData)
router.get('/stay/reviews/metrics', requireAuth, getReviewMetrics)
router.get('/stay/occupancy', requireAuth, getOccupancyRates)
router.post('/custom', requireAuth, getCustomInsight)

module.exports = router