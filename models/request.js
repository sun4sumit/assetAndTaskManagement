const mongoose=require('mongoose')

const requestSchema=mongoose.Schema({

  request_id:String,
  emp_id:String,
  asset_id:String,
	assetname:String,
  manager_id:String,
  reqdate:{type:Date,default:Date.now},
  status:Number,
  transferto:String,
  remark:String,

            })
module.exports=mongoose.model('request',requestSchema)
