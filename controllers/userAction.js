const Promise = require("promise");
const db = require("../config/connection")
const bcrypt = require("bcrypt")
const ObjectID=require("mongodb").ObjectID

module.exports={
    signup:(userData)=>{
        return new Promise(async(resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection("users").insertOne(userData).then(async (data) =>{
                let id = data.insertedId.toString()
                let user=await db.get().collection("users").findOne({_id:ObjectID(id)});
                resolve(user)
                })


            })  
    },
    login:(userData)=>{
               return new Promise(async (resolve, reject)=>{
            let user  = await db.get().collection("users").findOne({email:userData.email})
            if(user)    {
                bcrypt.compare(userData.password, user.password).then((status)=>{
                    if(status){
                        resolve(user)
                    }
                    else {
                        console.log("Error fetching user password ")
                    }
                })
            }
            else {
                console.log("user not found")
            }
        })
    }
}