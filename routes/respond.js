"use strict";
const express = require('express');
const router = express.Router();

const respond = require('../controllers/respond');

//404:not found; 400 wrong request;401 not authorized
router.get('/success', respond.success);
router.get('/err/500', respond.Error500);//server error
router.get('/err/404', respond.Error404);//page not found	

module.exports = router;
