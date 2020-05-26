const express=require('express')
const path=require('path')

const hbs=require('express-handlebars')
const session=require("express-session")
var nodemailer=require('nodemailer')
const bodyparser=require('body-parser')
var app=express();

app.use(session({secret:"asdff"}))
app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs')
app.engine('hbs', hbs({
   extname: 'hbs',
   defaultLayout : 'mainLayouts' ,
   layoutDir: __dirname + '/views/layouts'}));




app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.listen(3000,()=>{console.log("Server Started........");})


const mongoose=require('mongoose')
const URL="mongodb://localhost:27017/amdb";
mongoose.connect(URL)
//code for admin data insertion
const Alogin=require('./models/alogin')
/*app.get('/insert',(req,res)=>{
 var newdata=Alogin({
   aid:'sumitnaik2@gmail.com',
   password:'sumitnaik2'
 })
 newdata.save()
})*/

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'randyortonoo171@gmail.com',
    pass: 'randy@123'
  }
});
//code for open admin login page
app.get('/alog',(req,res)=>{
  res.render('alogin')
})

//code to check admin login
app.post('/logcheck',(req,res)=>{
  var logid=req.body.alog;
  var pass=req.body.pass;
  Alogin.find({aid:logid,password:pass},(err,result)=>{
if (err) throw err;
else if (result.length!=0){
  req.session.usera=logid;
res.render('home',{login:req.session.usera})}
    else res.render('alogin',{msg:'login fail try again'})
  })
})

//code to open creat employee page
app.get('/creat',(req,res)=>{

  res.render('createemp',{login:req.session.usera})
})



const Employee=require('./models/addemployee')
//code for creating employee and insert it in data base
app.post('/addemp',(req,res)=>{
      var fname=req.body.ename;
      var lname=req.body.elname;
      var elogid=req.body.elogid;
      var emob=req.body.emob;
      var eid=req.body.eid;
      var epass=req.body.epass;
	    var dsg=req.body.dsg;
	    var doj=req.body.doj;
	    var mid=req.body.mid;

        var newemp=Employee({
          name:fname,
          lastname:lname,
          mobileno:emob,
          emailid:elogid,
          emp_id:eid,
        	epassword:epass,
          designation:dsg,
          dateofjoining:doj,
          manager_id:mid

                            })
     newemp.save().then((data)=>{
      //  var mailOptions = {
      //   from: 'randyortonoo171@gmail.com',
      //   to: elogid,
      //   subject: 'password for asset management',
      //   text: 'Hello '+fname+" , your passwword is "+epass
      // };
      // transporter.sendMail(mailOptions, function(error, info){
      //   if (error) {
      //     console.log(error);
      //   } else {
   res.render('createemp',{login:req.session.usera,msg:'Password is sent on email id'})

      //   }
      // })
})})



//code for viewing employees
 app.get('/showemp',(req,res)=>{
      Employee.find({},(err,result)=>{
          if (err) throw err;

       else res.render('viewemployee',{data:result,login:req.session.usera})
                               })
                             })
//code to open perticular employee to update
var ObjectID = require('mongodb').ObjectID;
  app.get('/upemp',(req,res)=>{
var eid=req.query.id
Employee.find({_id:eid},(err,result)=>{
if(err) throw err;
else {
  console.log(result);
  res.render('updateemp',{data:result[0],login:req.session.usera})
}
})
})

//code to update the employee details
app.post('/updateemp',(req,res)=>{
      var objid=req.body.objid;
      var fname=req.body.ename;
      var lname=req.body.elname;
      var elogid=req.body.elogid;
      console.log(elogid);
      var emob=req.body.emob;
      var eid=req.body.eid;
      var epass=req.body.epass;
	    var dsg=req.body.dsg;
	    var doj=req.body.doj;
	    var mid=req.body.mid;

      Employee.update({_id:objid},{$set:{name:fname,lastname:lname,emailid:elogid,mobileno:emob,emp_id:eid,epassword:epass,designation:dsg,dateofjoining:doj,manager_id:mid}},(err,result)=>{
        console.log(result);
         if(err) throw err;
         else
   {          console.log("Updated");
             Employee.find((err,result)=>{
               if(err) throw err;
               res.render('viewemployee',{data:result,login:req.session.usera,msg:'updated successfully...!'})
             })
   }
        })
})

//code to delete  employee
app.get('/deleteemp',(req,res)=>{
  var id=req.query._id;

  Employee.remove({_id:id},(err,result)=>{
    if(err) throw err;
    else if(result.affectedRows!=0){
       Employee.find({},(err,result)=>{
          if (err) throw err;
              else res.render('viewemployee',{data:result,login:req.session.usera,msg:'data deleted successfully....!'})
                                    })}
                             })
})

//code to open create asset page
app.get('/createasset',(req,res)=>{

  res.render('createasset',{login:req.session.usera})
})
//code to creat asset and insert in databse
const Asset=require('./models/addasset')
app.post('/addasset',(req,res)=>{
      var aid=req.body.aid;
      var aname=req.body.assetname;
      var assetid;
      var quantity=parseInt(req.body.qty);
      var start=0;
      var c=0;
       Asset.find({aid:aid,assetname:aname},(err,result)=>{
       console.log((result.length!=0))
       if(err) throw err;
       else{
             if(result.length!=0){
              start=start+(result.length)+1;
              quantity=quantity+(result.length)
              } else{
              start=start+1
              quantity=quantity
               }
        // console.log(quantity)
        // console.log(start)
              for (var i = start; i <=quantity; i++) {
               assetid=aid+"_"+i;
        // console.log(assetid)
              var newasset=Asset({
              aid:aid,
              asset_id:assetid,
              assetname:aname,
            })
               newasset.save()
               c=i;
                        }
                        // console.log(c)
   if(c==quantity){res.render('createasset',{msg:'asset created successfully....!',login:req.session.usera})}
              }
              })})

//code to see the asset list

app.get('/showasset',(req,res)=>{

     Asset.find({},(err,result)=>{
   if (err) throw err;
        else res.render('viewasset',{data:result,login:req.session.usera})
                              })
                            })


//code to open deactivating page
app.get('/deactemp',(req,res)=>{
res.render('deactivateemp',{login:req.session.usera})
                          })

//code to deactivate employee
app.post('/deactivate',(req,res)=>{
      var empid=req.body.empid;
      var stat=0;
      Employee.update({emp_id:empid},{$set:{status:stat}},(err,result)=>{
         if(err) throw err;
         else
     {
        res.render('deactivateemp',{login:req.session.usera,msg:'employee deactivated......!'})
      }
        })
})
//code to logout all type of employee session
       app.get('/alogout',(req,res)=>{
       req.session.destroy();
       res.render('alogin',{msg2:'Logout successfully'})

       })


//code to get the password of Admin if he forget the Password
app.post('/adminforgotpwd',(req,res)=>{
  var logid=req.body.logid;
  var remailid=req.body.remailid;
  // console.log(remailid);
  var password;
  var fname;
  Alogin.findOne({aid:logid},(err,result)=>{
    // console.log(result);
   if (err) throw err;
  else if(result!=null){
     password=result.password;
    fname=result.name;
       var mailOptions = {
       from: 'randyortonoo171@gmail.com',
        to: remailid,
      subject: 'password for asset management',
      text: 'Hello '+fname+" , your password for asset management is "+password
                       };
    transporter.sendMail(mailOptions, function(error, info){
    // console.log(info);
      if (error) {
      res.render('alogin',{msg1:'entered wrong recovery email-id'})
     // console.log(error);
                }
      else {
     res.render('alogin',{msg2:'Password is sent on email id'})
            }
   })
       }
         else {
           res.render('alogin',{msg1:'you have entered wrong emailid'})
              }
})
})


//All type of employee module
//code to open the login page for all emplolyees
app.get('/emplogin',(req,res)=>{
  res.render('emplogin')
})

//code to check the valid employee ,all employee login from one page
app.post('/emplogcheck',(req,res)=>{
  var emplogid=req.body.emplog;
  var emppass=req.body.emppass;
  Employee.find({emailid:emplogid,epassword:emppass},(err,result)=>{
if (err) throw err;

else if (result.length!=0 && result[0].status==1 && result[0].designation=="Manager"){
  req.session.manager=emplogid;
res.render('home',{mloggedin:req.session.manager})}
else if(result.length!=0 && result[0].status==1 && result[0].designation=="Employee"){
  req.session.employee=emplogid;
  res.render('home',{eloggedin:req.session.employee})
}
else if(result.length!=0 && result[0].status==1 && result[0].designation=="Support"){
  req.session.support=emplogid;
  res.render('home',{sloggedin:req.session.support})
}
else if(result.length!=0 && result[0].status==0){
  res.render('emplogin',{msg:'You are deactivated'})
}
    else res.render('emplogin',{msg:'login fail try again'})
  })
})


//code to get the password of Admin if he forget the Password
app.post('/empforgotpwd',(req,res)=>{
  var logid=req.body.logid;
  var remailid=req.body.remailid;
  // console.log(remailid);
  var password;
  var fname;
  Employee.findOne({emailid:logid},(err,result)=>{
    // console.log(result);
   if (err) throw err;
  else if(result!=null){
     password=result.epassword;
    fname=result.name;
       var mailOptions = {
       from: 'randyortonoo171@gmail.com',
        to: remailid,
      subject: 'password for asset management',
      text: 'Hello '+fname+" , your password for asset management is "+password
                       };
    transporter.sendMail(mailOptions, function(error, info){
    // console.log(info);
      if (error) {
      res.render('emplogin',{msg1:'entered wrong recovery email-id'})
     // console.log(error);
                }
      else {
     res.render('emplogin',{msg2:'Password is sent on email id'})
            }
   })
       }
         else {
           res.render('emplogin',{msg1:'you have entered wrong emailid'})
              }
})
})


//code to see the employees profile
app.get('/profile',(req,res)=>{
        var logid=req.query.logid;
        Employee.findOne({emailid:logid},(err,result)=>{
         if (err) throw err;
         else if(result.designation=="Manager"){
         res.render("profilepage",{data:result,mloggedin:req.session.manager})
       }
         else if(result.designation=="Employee"){
           res.render("profilepage",{data:result,eloggedin:req.session.employee})
         }
         else if(result.designation=="Support"){
           res.render("profilepage",{data:result,sloggedin:req.session.support})
         }
       })

})


//code to open the update page of employees
app.get('/upbyemp',(req,res)=>{
var emplogid=req.query.emplogid
Employee.findOne({emailid:emplogid},(err,result)=>{
if(err) throw err;
else if(result.designation=="Manager"){
res.render("updatebyemp",{data:result,mloggedin:req.session.manager})
}
else if(result.designation=="Employee"){
  res.render("updatebyemp",{data:result,eloggedin:req.session.employee})
}
else if(result.designation=="Support"){
  res.render("updatebyemp",{data:result,sloggedin:req.session.support})
}
})
})

//code to update the employee details by employees themselves
app.post('/updatebyemp',(req,res)=>{
      var fname=req.body.ename;
      var lname=req.body.elname;
      var elogid=req.body.elogid;
      var emob=req.body.emob;
      var eid=req.body.eid;
      var epass=req.body.epass;
	    // var dsg=req.body.dsg;
	    // var doj=req.body.doj;
	    var mid=req.body.mid;

      Employee.update({emailid:elogid},{$set:{name:fname,lastname:lname,emailid:elogid,mobileno:emob,emp_id:eid,epassword:epass,manager_id:mid}},(err,result)=>{
         if(err) throw err;
         else
   {          //console.log("Updated");
     Employee.findOne({emailid:elogid},(err,result)=>{
     if(err) throw err;
     else if(result.designation=="Manager"){
     res.render("profilepage",{data:result,mloggedin:req.session.manager,msg:"updated successfully....!"})
     }
     else if(result.designation=="Employee"){
       res.render("profilepage",{data:result,eloggedin:req.session.employee,msg:"updated successfully....!"})
     }
     else if(result.designation=="Support"){
       res.render("profilepage",{data:result,sloggedin:req.session.support,msg:"updated successfully....!"})
     }
              })
   }
        })
})

//code to open the asset request page for empolyee only
app.get('/createereq',(req,res)=>{
  var stat=0;
  Asset.find({status:stat},(err,result)=>{
if (err) throw err;
     else
res.render('createempreq',{data:result,eloggedin:req.session.employee})
})
})
//code to raise the request of employee and insert in request table
const Request=require('./models/request')
app.post('/raisereq',(req,res)=>{
  var emplogid=req.body.elogid;
  var assetid=req.body.assetname;
  // console.log(assetname);
  var empid;
  var assetname;
  var reqid=parseInt(Math.random()*100);
  var mid;
  var stat=2;
  var assetstat=0;
  var remark="asset request pending..."
  Employee.findOne({emailid:emplogid},(err,result)=>{
// console.log(result)
if (err) throw err;
else{
  empid=result.emp_id;
  mid=result.manager_id;
  Asset.find({asset_id:assetid},(err,result)=>{
  if (err) throw err;
  else{
    assetname=result[0].assetname;
    var newempreq=Request({
      request_id:reqid,
      emp_id:empid,
      asset_id:assetid,
      assetname:assetname,
      manager_id:mid,
      status:stat,
      remark:remark

    })
    newempreq.save().then((data)=>{

      Asset.find({status:assetstat},(err,result)=>{
    if (err) throw err;
         else
      res.render('createempreq',{data:result,eloggedin:req.session.employee,msg:'your request is sent to manager successfully....!'})
    })
  })
}
})
}
  })
})

//code to see the status of both the asset requests and the transfer request of employee
app.get('/showempreq',(req,res)=>{
       var logid=req.session.employee;
       var empid;
     Employee.findOne({emailid:logid},(err,result)=>{
      if (err) throw err;
      else {
        empid=result.emp_id
        Request.find({emp_id:empid,transferto:{$exists:false}},(err,result)=>{
      if (err) throw err;
           else
            {
               data1=result;
             // console.log(data1)
       Request.find({emp_id:empid,transferto:{$exists:true}},(err,result)=>{
      if (err) throw err;
            else
            {
               data2=result;
            // console.log(data2)
       res.render('empmyreq',{data1:data1,data2:data2,eloggedin:req.session.employee})
             }})
              }
                        })
              }
                                  })
                                  })

//code to open the transfer asset page for employee only
app.get('/transfereasset',(req,res)=>{
    var emplogid=req.session.employee;
    Employee.find({emailid:emplogid},(err,result)=>{
     if (err) throw err;
     else{
      empid=result[0].emp_id;
      mid=result[0].manager_id;
    Asset.find({held_by:empid},(err,result)=>{
  if (err) throw err;
       else
  res.render('emptransferreq',{data:result,eloggedin:req.session.employee})
})
}
})
})


//code to raise the request of transfer asset by employee and insert in request table
app.post('/raisemptransferreq',(req,res)=>{
  var emplogid=req.body.elogid;
  var assetid=req.body.assetid;
  console.log(assetid);
  var transid=req.body.transid;
  var empid;
  var assetid;
  var reqid=parseInt(Math.random()*100);
  var mid;
  var stat=2;
  var remark="transfer request pending....."
  Employee.find({emailid:emplogid},(err,result)=>{
if (err) throw err;
else{
  empid=result[0].emp_id;
  mid=result[0].manager_id;
  Asset.find({asset_id:assetid},(err,result)=>{
  if (err) throw err;
  else{
    assetname=result[0].assetname;
    var newempreq=Request({
      request_id:reqid,
      emp_id:empid,
      asset_id:assetid,
      assetname:assetname,
      manager_id:mid,
      transferto:transid,
      status:stat,
      remark:remark

    })
    newempreq.save().then((data)=>{
      Asset.find({held_by:empid},(err,result)=>{
    if (err) throw err;
         else
      res.render('emptransferreq',{eloggedin:req.session.employee,msg:'your request is sent to manager successfully....!'})
    })
  })
  }
  })
}
})
})

//code to see the Tasks assigned
app.get('/showemptask',(req,res)=>{
       var logid=req.session.employee;
       var empid;
       var open="open"
       var closed="closed"
     Employee.findOne({emailid:logid},(err,result)=>{
      if (err) throw err;
      else {
        empid=result.emp_id
        Task.find({emp_id:empid,final_status:open},(err,result)=>{
          console.log(result);
            if (err) throw err;
           else{
               data1=result;
             // console.log(data1)
        Task.find({emp_id:empid,final_status:closed},(err,result)=>{
          console.log(result);
            if (err) throw err;
            else
            {
               data2=result;
            // console.log(data2)
       res.render('viewemptask',{data1:data1,data2:data2,eloggedin:req.session.employee})
             }})
              }
                        })
              }
                                  })
                                  })


//code for responding the task that it is in progress
app.get('/inprogress',(req,res)=>{
      var empid=req.query.empid;
      var taskname=req.query.taskname;
      var status=1;
      var open="open"
      var closed="closed"
      Task.update({emp_id:empid,taskname:taskname},{$set:{status:status}},(err,result)=>{
         if(err) throw err;
         else
         {  Task.find({emp_id:empid,final_status:open},(err,result)=>{
           console.log(result);
             if (err) throw err;
            else{
                data1=result;
              // console.log(data1)
         Task.find({emp_id:empid,final_status:closed},(err,result)=>{
           console.log(result);
             if (err) throw err;
             else
             {
                data2=result;
             // console.log(data2)
        res.render('viewemptask',{data1:data1,data2:data2,eloggedin:req.session.employee,msg:'you responded successfully....!'})
              }})
               }
                         })
            }
             })
           })


//code for responding the task that it is completed
app.get('/completed',(req,res)=>{
      var empid=req.query.empid;
      var taskname=req.query.taskname;
      var status=2;
      var open="open"
      var closed="closed"
      Task.update({emp_id:empid,taskname:taskname},{$set:{status:status}},(err,result)=>{
         if(err) throw err;
         else
         {  Task.find({emp_id:empid,final_status:open},(err,result)=>{
           console.log(result);
             if (err) throw err;
            else{
                data1=result;
              // console.log(data1)
         Task.find({emp_id:empid,final_status:closed},(err,result)=>{
           console.log(result);
             if (err) throw err;
             else
             {
                data2=result;
             // console.log(data2)
        res.render('viewemptask',{data1:data1,data2:data2,eloggedin:req.session.employee,msg:'you responded successfully....!'})
              }})
               }
                         })
            }
             })
           })


//code for responding the task that it is unable to do
app.get('/unabletodo',(req,res)=>{
      var empid=req.query.empid;
      var taskname=req.query.taskname;
      var status=3;
      var open="open";
      var closed="closed";
      Task.update({emp_id:empid,taskname:taskname},{$set:{status:status}},(err,result)=>{
         if(err) throw err;
         else
         {  Task.find({emp_id:empid,final_status:open},(err,result)=>{
           console.log(result);
             if (err) throw err;
            else{
                data1=result;
              // console.log(data1)
         Task.find({emp_id:empid,final_status:closed},(err,result)=>{
           console.log(result);
             if (err) throw err;
             else
             {
                data2=result;
             // console.log(data2)
        res.render('viewemptask',{data1:data1,data2:data2,eloggedin:req.session.employee,msg:'you responded successfully....!'})
              }})
               }
                         })
            }
             })
           })


//code with the help of which employees and manager both can see their assetstatus
app.get('/showassets',(req,res)=>{
        var logid=req.query.logid;
        var designation;
        var empid;
        Employee.findOne({emailid:logid},(err,result)=>{
         if (err) throw err;
         else {
           empid=result.emp_id;
           designation=result.designation;
           Asset.find({held_by:empid},(err,result)=>{
            if (err) throw err;
            else if(designation=="Manager"){
              res.render("viewemployeesasset",{data:result,mloggedin:req.session.manager})
            }
            else if(designation=="Employee"){
              res.render("viewemployeesasset",{data:result,eloggedin:req.session.employee})
            }
                })
              }
            })
          })




//code with the help of which employees and manager both can see the member employees of their team
app.get('/showteam',(req,res)=>{
        var logid=req.query.logid;
        var designation;
        var mid;
        var empid
        Employee.findOne({emailid:logid},(err,result)=>{
         if (err) throw err;
         else if(result.designation=="Manager"){
           mid=result.emp_id;
             Employee.find({manager_id:mid},(err,result)=>{
            if (err) throw err;
            else
              res.render("viewteam",{data:result,mloggedin:req.session.manager})
            })
            }
          else if(result.designation=="Employee"){
            mid=result.manager_id;
            empid=result.emp_id;
              Employee.find({manager_id:mid,emp_id:{$ne:empid}},(err,result)=>{
             if (err) throw err;
             else
              res.render("viewteam",{data:result,eloggedin:req.session.employee})
                })
              }
            })
          })




//code with the help of which employee and manager both can see all the e-mail option
const Mail=require('./models/mail')
app.get('/email',(req,res)=>{
        var logid=req.query.logid;
        var designation;
        var mid;
        var empid;
        var data1;
        var data2;
        Employee.findOne({emailid:logid},(err,result)=>{
         if (err) throw err;
         else {
           empid=result.emp_id;
           designation=result.designation
             Mail.find({reciever_id:empid},(err,result)=>{
            if (err) throw err;
            else{
              data1=result
              Mail.find({sender_id:empid},(err,result)=>{
             if (err) throw err;
             else{
               data2=result
               if(designation=="Manager"){
              res.render("emailoption",{data1:data1,data2:data2,mloggedin:req.session.manager})
                                         }
            else if(designation=="Employee"){
            res.render("emailoption",{data1:data1,data2:data2,eloggedin:req.session.employee})
                                       }
                  }
            })
                 }
          })
        }
      })
    })



//code with the help of which employee and manager both can send mail which insert in mail document
    app.post('/sendmail',(req,res)=>{
      var logid=req.body.logid;
      var recieverid=req.body.recieverid;
      var subject=req.body.subject;
      var message=req.body.message;
      var empid;
      var designation;
      Employee.findOne({emailid:logid},(err,result)=>{
    if (err) throw err;
    else{
      empid=result.emp_id;
      designation=result.designation
        var newmail=Mail({
          sender_id:empid,
          reciever_id:recieverid,
          subject:subject,
          message:message,

        })
        newmail.save().then((data)=>{

            Mail.find({reciever_id:empid},(err,result)=>{
           if (err) throw err;
           else{
             data1=result
             Mail.find({sender_id:empid},(err,result)=>{
            if (err) throw err;
            else{
              data2=result
              if(designation=="Manager"){
             res.render("emailoption",{data1:data1,data2:data2,mloggedin:req.session.manager,msg:'Message sent successfully....!'})
                                        }
           else if(designation=="Employee"){
           res.render("emailoption",{data1:data1,data2:data2,eloggedin:req.session.employee,msg:'Message sent successfully....!'})
                                      }
                 }
           })
                }
         })
        })
      }
      })
    })


//code to open the create request page for manager
app.get('/createmreq',(req,res)=>{
  var stat=0;
  Asset.find({status:stat},(err,result)=>{
if (err) throw err;
     else
  res.render('createmanagerreq',{data:result,mloggedin:req.session.manager })
})})


//code to raise the manager request and insert in request table
app.post('/raisemanagerreq',(req,res)=>{
  var mlogid=req.body.mlogid;
  var assetid=req.body.assetid;
  var empid;
  var assetname;
  var reqid=parseInt(Math.random()*100);
  var stat=4;
  var assetstat=0;
  var remark="asset request pending..."
  Employee.find({emailid:mlogid},(err,result)=>{
console.log(result)
if (err) throw err;
else{
  empid=result[0].emp_id;
  Asset.find({asset_id:assetid},(err,result)=>{
  if (err) throw err;
  else{
    assetname=result[0].assetname;
    var newempreq=Request({
      request_id:reqid,
      emp_id:empid,
      asset_id:assetid,
      assetname:assetname,
      status:stat,
      remark:remark

    })
    newempreq.save().then((data)=>{

      Asset.find({status:assetstat},(err,result)=>{
    if (err) throw err;
         else
      res.render('createmanagerreq',{data:result,mloggedin:req.session.manager,msg:'your request is sent to support successfully....!'})
    })
  })
  }
  })
}
})
})





//code to open transfer asset page for manager
app.get('/transfermasset',(req,res)=>{
    var mlogid=req.session.manager;
    Employee.find({emailid:mlogid},(err,result)=>{
     if (err) throw err;
     else{
      empid=result[0].emp_id;
    Asset.find({held_by:empid},(err,result)=>{
  if (err) throw err;
       else
  res.render('managertransferform',{data:result,mloggedin:req.session.manager})
})
}
})
})
//code to transfer the asset directly by manager
app.post('/transfermanagerasset',(req,res)=>{
  var mlogid=req.body.mlogid;
  var assetid=req.body.assetid;
  console.log(assetid);
  var transid=req.body.transid;
  var empid;
  var assetid;
  var reqid=parseInt(Math.random()*100);
  var stat=4;
  var remark="transfered directly"
  Employee.find({emailid:mlogid},(err,result)=>{
if (err) throw err;
else{
  empid=result[0].emp_id;
  console.log(empid)
  Asset.find({asset_id:assetid},(err,result)=>{
  if (err) throw err;
  else{
    assetname=result[0].assetname;
    var newempreq=Request({
      request_id:reqid,
      emp_id:empid,
      asset_id:assetid,
      assetname:assetname,
      transferto:transid,
      status:stat,
      remark:remark

    })
    newempreq.save().then((data)=>{
      Asset.update({asset_id:assetid},{$set:{held_by:transid}},(err,result)=>{
         if(err) throw err;
         else{
           Asset.find({held_by:empid},(err,result)=>{
         if (err) throw err;
              else
      res.render('managertransferform',{mloggedin:req.session.manager,msg:'your request is sent to manager successfully....!'})
    })
  }
  })
})
}
  })
}
})
})

//code to see both the pending request and the pending transfer requests come to manager by employees
app.get('/showpending',(req,res)=>{
     var stat=2;
     var logid=req.session.manager;
     var mid;
     var data1;
     var data2;
     Employee.find({emailid:logid},(err,result)=>{
   if (err) throw err;
        else {
          mid=result[0].emp_id
          Request.find({manager_id:mid,status:stat,transferto:{$exists:false}},(err,result)=>{
        if (err) throw err;
             else
              {
                 data1=result;
               // console.log(data1)
         Request.find({manager_id:mid,status:stat,transferto:{$exists:true}},(err,result)=>{
        if (err) throw err;
              else
              {
                 data2=result;
              // console.log(data2)
         res.render('pendingreq',{data1:data1,data2:data2,mloggedin:req.session.manager})
               }})
                }
                          })
                }
                          })
                          })

//code to approve the request of employees by manager
app.get('/approvebym',(req,res)=>{
      var reqid=req.query.reqid;
      var mid=req.query.mid;
      var assetid=req.query.assetid;
      var to=req.query.to;
      var remark="approved by manager"
      var status=2;
      var stat=4;
      var assetstatus=1
      Request.find({request_id:reqid,manager_id:mid,transferto:{$exists:true}},(err,result)=>{
         // console.log(result);
         if (err) throw err;
         else if(result.length!=0)
         {
      Request.update({request_id:reqid,transferto:to},{$set:{status:stat,remark:remark}},(err,result)=>{
         if(err) throw err;
         else
         {
      Asset.update({asset_id:assetid},{$set:{status:assetstatus,manager_id:mid,held_by:to}},(err,result)=>{
         if(err) throw err;
         else
          {
      Request.find({manager_id:mid,status:status,transferto:{$exists:false}},(err,result)=>{
         if (err) throw err;
         else
         {
          data1=result;
        // console.log(data1)
      Request.find({manager_id:mid,status:status,transferto:{$exists:true}},(err,result)=>{
         if (err) throw err;
         else
         {
          data2=result;
          // console.log(data2)
  res.render('pendingreq',{data1:data1,data2:data2,mloggedin:req.session.manager,msg:"transfer request approved successfully....!"})
         }})
         }
        })
         }
       })
     }})
       }
  else
       {
      Request.update({request_id:reqid},{$set:{status:stat,remark:remark}},(err,result)=>{
       if(err) throw err;
       else
       {
      Request.find({manager_id:mid,status:status,transferto:{$exists:false}},(err,result)=>{
       if (err) throw err;
       else
       {
        data1=result;
       // console.log(data1)
      Request.find({manager_id:mid,status:status,transferto:{$exists:true}},(err,result)=>{
       if (err) throw err;
       else
       {
        data2=result;
        // console.log(data2)
       res.render('pendingreq',{data1:data1,data2:data2,mloggedin:req.session.manager,msg:"approved successfully.......!"})
        }})
        }
       })
       }
     })
     }
   })
 })

//code to open a page to enter the reason for rejecting the request by manager
 app.get('/rejectbym',(req,res)=>{
   var reqid=req.query.reqid;
   Request.findOne({request_id:reqid},(err,result)=>{
     console.log(result);
 if (err) throw err;
      else res.render('rejectreason',{data:result,mloggedin:req.session.manager})
    })
 })

//code to send the reason of rejection and update in request table by manager
 app.post('/sendmanagerreason',(req,res)=>{
       var mid=req.body.mid;
       var reqid=req.body.reqid;
       var reason=req.body.reason;
console.log(reason);
       var status=2;
       var stat=0;
      Request.update({request_id:reqid},{$set:{status:stat,remark:reason}},(err,result)=>{
       if(err) throw err;
       else
       {
      Request.find({manager_id:mid,status:status,transferto:{$exists:false}},(err,result)=>{
       if (err) throw err;
       else
       {
        data1=result;
       console.log(data1)
      Request.find({manager_id:mid,status:status,transferto:{$exists:true}},(err,result)=>{
       if (err) throw err;
       else
       {
        data2=result;
        console.log(data2)
       res.render('pendingreq',{data1:data1,data2:data2,mloggedin:req.session.manager,msg:"reason sent successfully....!"})
        }})
        }
       })
       }
     })
   })





//code to see the request of asset requested by manager and the transfer details
app.get('/showmreq',(req,res)=>{
       var logid=req.session.manager;
       var empid;
     Employee.findOne({emailid:logid},(err,result)=>{
      if (err) throw err;
      else {
        empid=result.emp_id
        Request.find({emp_id:empid,transferto:{$exists:false}},(err,result)=>{
      if (err) throw err;
           else
            {
               data1=result;
             // console.log(data1)
       Request.find({emp_id:empid,transferto:{$exists:true}},(err,result)=>{
      if (err) throw err;
            else
            {
               data2=result;
            // console.log(data2)
       res.render('managermyreq',{data1:data1,data2:data2,mloggedin:req.session.manager})
             }})
              }
                        })
              }
                                  })
                                  })



//code to see all information related to Tasks
const Task=require('./models/task')
app.get('/task',(req,res)=>{
  var logid=req.session.manager;
  var empid;
  var stat="open"
  var data1;
  var data2;
Employee.findOne({emailid:logid},(err,result)=>{
 if (err) throw err;
 else {
   empid=result.emp_id
     Employee.find({manager_id:empid},(err,result)=>{
         if (err) throw err;
        else{
          data1=result
          Task.find({manager_id:empid,final_status:stat},(err,result)=>{
            console.log(result);
              if (err) throw err;
             else{
               data2=result
          res.render('task',{data1:data1,data2:data2,mloggedin:req.session.manager})
                  }
                })
                }
              })
          }
                })
                })


//code for assigning the task and insert in task document
app.post('/assigntask',(req,res)=>{
  var logid=req.body.logid;
  var taskname=req.body.taskname;
  var disc=req.body.disc;
  var empid=req.body.empid;
  var duedate=req.body.duedate;
  var mid;
  var stat=0;
  var status="open"
  Employee.findOne({emailid:logid},(err,result)=>{
if (err) throw err;
else{
  mid=result.emp_id;
    var newassign=Task({
      taskname:taskname,
      discription:disc,
      emp_id:empid,
      manager_id:mid,
      deadline:duedate,
      status:stat,
      final_status:status

    })
    newassign.save().then((data)=>{
      Employee.find({manager_id:mid},(err,result)=>{
          if (err) throw err;
         else{
           data1=result
           Task.find({manager_id:mid,final_status:status},(err,result)=>{
             console.log(result);
               if (err) throw err;
              else{
                data2=result
           res.render('task',{data1:data1,data2:data2,mloggedin:req.session.manager,msg:"Task assigned successfully....!"})
                   }
                 })
                 }
  })
    })
  }
  })
})

//code for open the page to close the task and give ratings
app.get('/closebym',(req,res)=>{
  var empid=req.query.empid;
  var taskname=req.query.taskname;
  var mid=req.query.mid;
//   Request.findOne({request_id:reqid},(err,result)=>{
//     console.log(result);
// if (err) throw err;
   res.render('close&rating',{empid:empid,taskname:taskname,mid:mid,mloggedin:req.session.manager})
   // })
})


//code to close the task and update task by rating and Feedback
 app.post('/close&rating',(req,res)=>{
  var logid=req.session.manager;
  var empid=req.body.empid;
  var taskname=req.body.taskname;
  var rating=req.body.rating;
  var feedback=req.body.feedback;
  var mid=req.body.mid;;
  var open="open"
  var closed="closed"
  var data1;
  var data2;
Task.update({emp_id:empid,taskname:taskname},{$set:{final_status:closed,final_rating:rating,feedback:feedback}},(err,result)=>{
 if (err) throw err;
 else {
     Employee.find({manager_id:mid},(err,result)=>{
         if (err) throw err;
        else{
          data1=result
          Task.find({manager_id:mid,final_status:open},(err,result)=>{
            //console.log(result);
              if (err) throw err;
             else{
               data2=result
          res.render('task',{data1:data1,data2:data2,mloggedin:req.session.manager,msg:"task closed successfully....!"})
                  }
                })
                }
              })
          }
                })
                })




//code to see the completion status and completion percentage of Previous tasks
app.get('/taskcompPercentage',(req,res)=>{
       var logid=req.session.employee;
       var empid=req.query.empid;
       var name=req.query.name;
       var totaltask;
       var completedtask;
       var uncompletedtask;
       var compstat=2;
       var percentage;
     Task.find({emp_id:empid},(err,result)=>{
      if (err) throw err;
      else {
        totaltask=result.length
        Task.find({emp_id:empid,status:compstat},(err,result)=>{
          console.log(result);
            if (err) throw err;
           else{
               completedtask=result.length;
             // console.log(data1)
        Task.find({emp_id:empid,status:{$ne:compstat}},(err,result)=>{
          console.log(result);
            if (err) throw err;
            else
            {
               uncompletedtask=result.length;
               percentage=(completedtask/totaltask)*100
            // console.log(data2)
       res.render('viewcompletionpercentage',{name:name,empid:empid,totaltask:totaltask,completedtask:completedtask,uncompletedtask:uncompletedtask,percentage:percentage,mloggedin:req.session.manager})
             }})
              }
                        })
              }
                                  })
                                  })



//code to going back to the completion status page to see another employee's status
app.get('/backtocompstatus',(req,res)=>{
  var logid=req.session.manager;
  var empid;
  var stat="open"
  var data1;
  var data2;
Employee.findOne({emailid:logid},(err,result)=>{
 if (err) throw err;
 else {
   empid=result.emp_id
     Employee.find({manager_id:empid},(err,result)=>{
         if (err) throw err;
        else{
          data1=result
          Task.find({manager_id:empid,final_status:stat},(err,result)=>{
            console.log(result);
              if (err) throw err;
             else{
               data2=result
          res.render('task',{data1:data1,data2:data2,mloggedin:req.session.manager,msg:"Now you can see another employee's completion status"})
                  }
                })
                }
              })
          }
                })
                })


//code to see both the requests and the transfer request come to te support which is approved by manager
  app.get("/showsupportreq",(req,res)=>{
       var stat=4;
       Request.find({status:stat,transferto:{$exists:false}},(err,result)=>{
         console.log(result);
     if (err) throw err;
     else
      {
         data1=result;
       // console.log(data1)
 Request.find({status:stat,transferto:{$exists:true}},(err,result)=>{
if (err) throw err;
      else
      {
         data2=result;
      // console.log(data2)
 res.render('showsupportreq',{data1:data1,data2:data2,sloggedin:req.session.support})
       }})
        }
                                })
                              })



//code to approve the asset requests by support
app.get('/approvebysupport',(req,res)=>{
      var reqid=req.query.reqid;
      var mid=req.query.mid;
      var empid=req.query.empid;
      var assetid=req.query.assetid;
      console.log(empid);
      console.log(assetid);
      var remark="approved by support department now you can collect"
      var status=4;
      var stat=6;
      var assetstatus=1;
      Request.update({request_id:reqid},{$set:{status:stat,remark:remark}},(err,result)=>{
       if(err) throw err;
       else
       {
      Asset.update({asset_id:assetid},{$set:{status:assetstatus,manager_id:mid,held_by:empid}},(err,result)=>{
        console.log(result);
       if(err) throw err;
       else
        {
      Request.find({status:status,transferto:{$exists:false}},(err,result)=>{
       if (err) throw err;
       else
       {
        data1=result;
       // console.log(data1)
      Request.find({status:status,transferto:{$exists:true}},(err,result)=>{
       if (err) throw err;
       else
       {
        data2=result;
        // console.log(data2)
       res.render('showsupportreq',{data1:data1,data2:data2,sloggedin:req.session.support,msg:"Dispatched successfully...!"})
        }})
        }
       })
     }})
       }
     })
     })

//code to open the page to enter the reason for rejection
     app.get('/rejectbysupport',(req,res)=>{
       var reqid=req.query.reqid;
       Request.findOne({request_id:reqid},(err,result)=>{
         console.log(result);
     if (err) throw err;
          else res.render('supportrejectreason',{data:result,mloggedin:req.session.manager})
        })
     })

//code to send the reason for rejecting the request
     app.post('/sendsupportreason',(req,res)=>{
           var reqid=req.body.reqid;
           var reason=req.body.reason;
    // console.log(reason);
           var status=4;
           var stat=0;
          Request.update({request_id:reqid},{$set:{status:stat,remark:reason}},(err,result)=>{
           if(err) throw err;
           else
           {
          Request.find({status:status,transferto:{$exists:false}},(err,result)=>{
           if (err) throw err;
           else
           {
            data1=result;
           console.log(data1)
          Request.find({status:status,transferto:{$exists:true}},(err,result)=>{
           if (err) throw err;
           else
           {
            data2=result;
            console.log(data2)
           res.render('showsupportreq',{data1:data1,data2:data2,sloggedin:req.session.support,msg:"reason sent successfully....!"})
            }})
            }
           })
           }
         })
       })


//code to logout all type of employee session
       app.get('/logout',(req,res)=>{
       req.session.destroy();
       res.render('emplogin',{msg2:'Logout successfully'})

       })
