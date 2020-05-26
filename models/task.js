const mongoose=require('mongoose')

const taskSchema=mongoose.Schema({

  taskname:String,
  discription:String,
  emp_id:String,
  manager_id:String,
  assign_date:{type:Date,default:Date.now},
  deadline:String,
  status:{type:Number, default:0},
  final_status:String,
  final_rating:String,
	feedback:String,
  })
module.exports=mongoose.model('task',taskSchema)
