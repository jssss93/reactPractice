var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var autoIncrement = require('mongoose-auto-increment');

const uri = properties.get("mongoURI");
var connection = mongoose.createConnection(uri);
autoIncrement.initialize(connection);

var commentSchema = new Schema({
    content: String,
    author: String,
    comment_date: {type: Date, default: Date.now()}
});

var boardSchema = new Schema({
    seq         : {type: Number},
    title       : String,
    content     : String,
    author      : String,
    reg_date    : {type: Date, default: Date.now()},
    comments    : [commentSchema]

//     seq : 'number', boardcd : 'string', title : 'string', contents : 'string', userid : 'string', regdate : 'date', moddate : 'date', viewcnt : 'number'

});

boardSchema.plugin(autoIncrement.plugin,{ 
    model : 'board',
    field : 'seq',// auto-increment할 field
    startAt : 1, //시작
    increment : 1 // 증가 
});

  
  

module.exports = mongoose.model('board', boardSchema);
