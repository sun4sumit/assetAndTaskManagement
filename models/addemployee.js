const mongoose=require('mongoose')

const addemployeeSchema=mongoose.Schema({

  name:String,
  lastname:String,
  mobileno:String,
  emailid:String,
  emp_id:String,
	epassword:String,
  designation:String,
  dateofjoining:{type:Date,default:Date.now},
  manager_id:String,
  status:{type:Number, default:1}
            })
module.exports=mongoose.model('elogin',addemployeeSchema)
