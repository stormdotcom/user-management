const Promise = require("promise");
const db = require("../config/connection")
const bcrypt = require("bcrypt")
const ObjectID=require("mongodb").ObjectID

module.exports={
    signup:(userData)=>{
        return new Promise((resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection("users").insertOne(userData).then((data) =>{
                console.log(data)
            })
        })
    }
}