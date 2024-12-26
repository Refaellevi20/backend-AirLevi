const dbService = require('./db.service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    aggregateBookings,
    aggregateRevenue,
    aggregateReviews,
    aggregateOccupancy,
    generateCustomInsight
}

async function aggregateBookings(filters = {}) {
    try {
        const collection = await dbService.getCollection('booking')
        const pipeline = [
            {
                $match: {
                    ...(filters.startDate && {
                        checkIn: { $gte: new Date(filters.startDate) }
                    }),
                    ...(filters.endDate && {
                        checkOut: { $lte: new Date(filters.endDate) }
                    }),
                    ...(filters.hostId && {
                        hostId: new ObjectId(filters.hostId)
                    })
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$checkIn" },
                        month: { $month: "$checkIn" }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]

        const bookings = await collection.aggregate(pipeline).toArray()
        return bookings.map(booking => ({
            date: new Date(booking._id.year, booking._id.month - 1),
            count: booking.count,
            revenue: booking.revenue
        }))
    } catch (err) {
        console.error('Failed to aggregate bookings:', err)
        throw err
    }
}

async function aggregateRevenue(filters = {}) {
    try {
        const collection = await dbService.getCollection('booking')
        const pipeline = [
            {
                $match: {
                    status: 'completed',
                    ...(filters.startDate && {
                        checkOut: { $gte: new Date(filters.startDate) }
                    }),
                    ...(filters.endDate && {
                        checkOut: { $lte: new Date(filters.endDate) }
                    }),
                    ...(filters.hostId && {
                        hostId: new ObjectId(filters.hostId)
                    })
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$checkOut" },
                        month: { $month: "$checkOut" }
                    },
                    amount: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]

        const revenue = await collection.aggregate(pipeline).toArray()
        return revenue.map(item => ({
            date: new Date(item._id.year, item._id.month - 1),
            amount: item.amount
        }))
    } catch (err) {
        console.error('Failed to aggregate revenue:', err)
        throw err
    }
}

async function aggregateReviews(filters = {}) {
    try {
        const collection = await dbService.getCollection('review')
        const pipeline = [
            {
                $match: {
                    ...(filters.startDate && {
                        createdAt: { $gte: new Date(filters.startDate) }
                    }),
                    ...(filters.endDate && {
                        createdAt: { $lte: new Date(filters.endDate) }
                    }),
                    ...(filters.hostId && {
                        hostId: new ObjectId(filters.hostId)
                    })
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    averageRating: { $avg: "$rating" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]

        const reviews = await collection.aggregate(pipeline).toArray()
        return reviews.map(review => ({
            date: new Date(review._id.year, review._id.month - 1),
            averageRating: parseFloat(review.averageRating.toFixed(2)),
            count: review.count
        }))
    } catch (err) {
        console.error('Failed to aggregate reviews:', err)
        throw err
    }
}

async function aggregateOccupancy(filters = {}) {
    try {
        const collection = await dbService.getCollection('booking')
        const pipeline = [
            {
                $match: {
                    ...(filters.startDate && {
                        checkIn: { $gte: new Date(filters.startDate) }
                    }),
                    ...(filters.endDate && {
                        checkOut: { $lte: new Date(filters.endDate) }
                    }),
                    ...(filters.hostId && {
                        hostId: new ObjectId(filters.hostId)
                    })
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$checkIn" },
                        month: { $month: "$checkIn" },
                        stayId: "$stayId"
                    },
                    occupiedDays: {
                        $sum: {
                            $divide: [
                                { $subtract: ["$checkOut", "$checkIn"] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$_id.year",
                        month: "$_id.month"
                    },
                    totalOccupiedDays: { $sum: "$occupiedDays" },
                    totalStays: { $sum: 1 }
                }
            },
            {
                $project: {
                    date: {
                        $dateFromParts: {
                            year: "$_id.year",
                            month: "$_id.month"
                        }
                    },
                    rate: {
                        $multiply: [
                            {
                                $divide: [
                                    "$totalOccupiedDays",
                                    { $multiply: ["$totalStays", 30] }
                                ]
                            },
                            100
                        ]
                    }
                }
            },
            {
                $sort: {
                    date: 1
                }
            }
        ]

        const occupancy = await collection.aggregate(pipeline).toArray()
        return occupancy.map(item => ({
            date: item.date,
            rate: parseFloat(item.rate.toFixed(2))
        }))
    } catch (err) {
        console.error('Failed to aggregate occupancy:', err)
        throw err
    }
}

async function generateCustomInsight(config) {
    try {
        const collection = await dbService.getCollection(config.collection)
        const pipeline = buildCustomPipeline(config)
        const data = await collection.aggregate(pipeline).toArray()
        return transformCustomData(data, config)
    } catch (err) {
        console.error('Failed to generate custom insight:', err)
        throw err
    }
}

// Helper functions
function buildCustomPipeline(config) {
    const pipeline = []

    // Match stage
    if (config.filters) {
        pipeline.push({
            $match: buildMatchStage(config.filters)
        })
    }

    // Group stage
    if (config.groupBy) {
        pipeline.push({
            $group: buildGroupStage(config.groupBy, config.metrics)
        })
    }

    // Sort stage
    if (config.sortBy) {
        pipeline.push({
            $sort: { [config.sortBy]: config.sortOrder || 1 }
        })
    }

    // Limit results
    if (config.limit) {
        pipeline.push({ $limit: config.limit })
    }

    return pipeline
}

function buildMatchStage(filters) {
    const match = {}
    Object.entries(filters).forEach(([key, value]) => {
        if (value.type === 'date') {
            match[key] = {
                $gte: new Date(value.start),
                $lte: new Date(value.end)
            }
        } else if (value.type === 'id') {
            match[key] = new ObjectId(value.value)
        } else {
            match[key] = value.value
        }
    })
    return match
}

function buildGroupStage(groupBy, metrics) {
    const group = {
        _id: buildGroupId(groupBy)
    }

    metrics.forEach(metric => {
        switch (metric.type) {
            case 'sum':
                group[metric.name] = { $sum: `$${metric.field}` }
                break
            case 'avg':
                group[metric.name] = { $avg: `$${metric.field}` }
                break
            case 'count':
                group[metric.name] = { $sum: 1 }
                break
            // Add more aggregation types as needed
        }
    })

    return group
}

function buildGroupId(groupBy) {
    if (typeof groupBy === 'string') {
        return `$${groupBy}`
    }

    const groupId = {}
    groupBy.forEach(field => {
        if (field.type === 'date') {
            groupId[field.name] = {
                $dateToString: {
                    format: field.format || '%Y-%m-%d',
                    date: `$${field.field}`
                }
            }
        } else {
            groupId[field.name] = `$${field.field}`
        }
    })
    return groupId
}

function transformCustomData(data, config) {
    switch (config.outputFormat) {
        case 'timeSeries':
            return data.map(item => ({
                date: new Date(item._id),
                value: item[config.metrics[0].name]
            }))
        case 'categorical':
            return data.map(item => ({
                label: item._id,
                value: item[config.metrics[0].name]
            }))
        default:
            return data
    }
}