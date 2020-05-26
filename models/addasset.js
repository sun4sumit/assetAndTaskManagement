const mongoose=require('mongoose')

const addassetSchema=mongoose.Schema({

  aid:String,
  asset_id:String,
	assetname:String,
  held_by:String,
  manager_id:String,
  status:{type:Number, default:0}
            })
module.exports=mongoose.model('asset',addassetSchema)
