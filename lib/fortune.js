/**
 * Created by frank25184 on 7/14/16.
 */
"use strict";
let fortunes =[
    "you get $100",
    "you get $1000",
    "you get $10000",
    "you get $100000",
    "you get $1000000",
    "you get $100000009"
];

module.exports.getFortune = function(){
    let idx = Math.floor(Math.random()*fortunes.length);
    return fortunes[idx];
};