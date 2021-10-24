const Promise = require("promise");
const db = require("../config/connection")
const bcrypt = require("bcrypt")
const ObjectID=require("mongodb").ObjectId

module.exports={
    signup:(userData)=>{
        return new Promise(async(resolve, reject) => {
            let response={err:{msg:"", status:false}}
            let alreadyExists=await db.get().collection("users").findOne({email:userData.email});
            if(!alreadyExists){
                userData.isBlocked=false;
                userData.address={place:"", city:"", country:""}
                userData.password=userData.password2
                userData.password2=null;
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection("users").insertOne(userData).then(async (data) =>{
                    let id = data.insertedId.toString()
                    let user=await db.get().collection("users").findOne({_id:ObjectID(id)});
                    resolve(user)
                    })
            } 
            else  {
                response.err.status=true
                response.err.msg="User already exists"
                resolve(response)
            }




            })  
    },
    login:(userData)=>{
               return new Promise(async (resolve, reject)=>{
                let response={err:{msg:"", status:false}}
            let user  = await db.get().collection("users").findOne({email:userData.email})
            if(user)   {
                if(!user?.isBlocked){
                    bcrypt.compare(userData.password, user.password).then((status)=>{
                        if(status){
                            response.user=user
                            resolve(response)
                        }
                        else {
                            response.err.status=true
                            response.err.msg="Login Failed ❌ Please try again"
                            resolve(response)
                           
                        }
                    })
                }
                else {
                    response.err.status=true
                    response.err.msg="User Blocked"
                    resolve(response)
                }

            }
            else {
                response.err.status=true
                response.err.msg="User Not found"
                resolve(response)
            }
        })
    }
}