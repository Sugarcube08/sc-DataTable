const express = require('express');
const router = express.Router();
const DataItem = require('../models/DataItems');


// Query Params Example: ?skip=20&limit=10&sortBy=username&sortOrder=asc&search=john


router.get('/datatable/v1', async (req, res) => {
    try {

        // 1. Read 'skip' directly from the query parameter
        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 10;

        // Basic validation
        if (skip < 0 || limit <= 0) {
            return res.status(400).json({ success: false, message: 'Skip must be non-negative and limit must be positive.' });
        }

        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };
        const filter = {};
        const searchTerm = req.query.search;

        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            filter.$or = [
                { username: regex },
                { name: regex },
                { email: regex },
            ];
        }

        const totalItems = await DataItem.countDocuments(filter);


        const data = await DataItem.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit);


        res.json({
            success: true,
            data: data,
            pagination: {
                totalItems,
                skip: skip,
                limit,
                currentPage: Math.floor(skip / limit) + 1,
                totalPages: Math.ceil(totalItems / limit) || 1,
                hasMore: skip + limit < totalItems,
            }
        });

    } catch (error) {
        console.error("Datatable API Error:", error);
        res.status(500).json({ success: false, message: 'Server error fetching datatable data.' });
    }
});

router.get('/datatable/v2', async (req, res) => {
    try {
        // parse query
        const skip = Math.max(parseInt(req.query.skip) || 0, 0);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };

        // fetch results
        const totalItems = await DataItem.countDocuments();
        const data = await DataItem.find()
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // send response
        res.json({
            success: true,
            data,
            totalItems,
            offset: skip,
            limit,
            currentPage: Math.floor(skip / limit) + 1,
            totalPages: Math.ceil(totalItems / limit) || 1,
            hasMore: skip + limit < totalItems,
        });
    } catch (error) {
        console.error('Datatable V2 Base API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching datatable v2 data.',
        });
    }
});

router.get('/datatable/v2/search', async (req, res) => {
    try {
        // extract query params
        const skip = Math.max(parseInt(req.query.skip) || 0, 0);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const sortField = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        const sort = { [sortField]: sortOrder };
        const searchTerm = req.query.search?.trim();

        // build filter
        const filter = {};

        if (searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            filter.$or = [
                { username: regex },
                { name: regex },
                { email: regex },
                { title: regex },
                { description: regex },
            ];
        }

        // fetch results
        const totalItems = await DataItem.countDocuments(filter);
        const data = await DataItem.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean();

        // send response
        res.json({
            success: true,
            data,
            search: searchTerm || null,
            totalItems,
            offset: skip,
            limit,
            currentPage: Math.floor(skip / limit) + 1,
            totalPages: Math.ceil(totalItems / limit) || 1,
            hasMore: skip + limit < totalItems,
        });
    } catch (error) {
        console.error('Datatable V2 Search API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching datatable v2 search results.',
        });
    }
});

module.exports = router;
