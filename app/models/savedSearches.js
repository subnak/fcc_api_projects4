'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var savedSearches = new Schema({
    term:String,
    when:Date
});

module.exports = mongoose.model('savedSearches', savedSearches);