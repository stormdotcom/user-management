const Promise = require("promise");
const db = require("../config/connection")
const bcrypt = require("bcrypt")
const ObjectID=require("mongodb").ObjectID

module.exports ={
    login:(data)=>{
        return new Promise(async(resolve, reject)=>{
            let admin = await db.get().collection("admin").findOne({email:data.email})
            if(admin){
                bcrypt.compare(data.password, admin.password).then((status)=>{
                    if(status){
                        resolve(admin)
                    }
                    else console.log("Err fetching admin password")
                })
            }
            else console.log("admin failed")
        })
    }
}