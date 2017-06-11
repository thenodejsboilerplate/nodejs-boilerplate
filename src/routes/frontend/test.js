"use strict";
const express = require('express');
const router = express.Router();

const test = require('../../controllers/test');


router.get('/cross-browser/hood-river',test.hoodRiver);
router.get('/cross-browser/request-group-rate',test.groupRate);

module.exports = router;
