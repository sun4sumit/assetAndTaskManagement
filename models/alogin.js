const mongoose=require('mongoose')

const aloginSchema=mongoose.Schema({
	aid:String,
	password:String,
            })
module.exports=mongoose.model('alogin',aloginSchema)
