var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/dsbook',function(){
  console.log('connected to mongodb')
})

module.export = mongoose
