const mongoose=require('mongoose')

const mailSchema=mongoose.Schema({

  sender_id:String,
  reciever_id:String,
  subject:String,
  message:String,
  date:{type:Date,default:Date.now}
  })
module.exports=mongoose.model('mail',mailSchema)
