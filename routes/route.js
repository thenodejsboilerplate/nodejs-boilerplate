/**
 * Created by frank25184 on 7/20/16.
 */
"use strict";
let controllers = require('../controllers/mainController.js');

module.exports = function(app) {
    app.get('/', controllers.index);
    app.get('/about', controllers.about);
//donot need to add views
    app.get('/cross-browser/hood-river', controllers.hood_river);
    app.get('/cross-browser/request-group-rate', controllers.request_group_rate);
};






// app.get('/no-layout',function(req,res){
//     res.render('no-layout',{layout:null});//or layout:false
// });
//if you do not want to use layout

// app.get('/custom-layout',function(req,res){
//     res.render('custom-layout',{layout: 'custom'});
// });
//if you want another layout
