async function getBookingStats(req, res) {
    try {
        const bookings = await analyticsService.aggregateBookings(req.query)
        res.json(bookings)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get booking statistics' })
    }
}

async function getRevenueData(req, res) {
    try {
        const revenue = await analyticsService.aggregateRevenue(req.query)
        res.json(revenue)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get revenue data' })
    }
}

async function getReviewMetrics(req, res) {
    try {
        const reviews = await analyticsService.aggregateReviews(req.query)
        res.json(reviews)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get review metrics' })
    }
}

async function getOccupancyRates(req, res) {
    try {
        const occupancy = await analyticsService.aggregateOccupancy(req.query)
        res.json(occupancy)
    } catch (err) {
        res.status(500).send({ err: 'Failed to get occupancy rates' })
    }
}

async function getCustomInsight(req, res) {
    try {
        const data = await analyticsService.generateCustomInsight(req.body)
        res.json(data)
    } catch (err) {
        res.status(500).send({ err: 'Failed to generate custom insight' })
    }
}