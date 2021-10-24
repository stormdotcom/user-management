const Promise = require("promise");
const db = require("../config/connection")
const bcrypt = require("bcrypt")
const ObjectID=require("mongodb").ObjectId;
const { reject, resolve } = require("promise");

module.exports ={
    login:(data)=>{
        return new Promise(async(resolve, reject)=>{
            let admin = await db.get().collection("admin").findOne({email:data.email})
            let response={err:{status:false, msg:""}}
            if(admin){
                bcrypt.compare(data.password, admin.password).then((status)=>{
                    if(status){
                        response.admin=admin
                        resolve(response)
                    }
                    else {
                        response.err.status=true;
                        response.err.msg="Failed Login"
                         resolve(response)
                         console.log("Err fetching admin password")
                    } 
                })
            }
            
            else {
               response.err.status=true;
               response.err.msg="Failed Login"
                resolve(response)
            }
            
        })
    },
    getUser:(id)=>{
        return new Promise(async(resolve, reject)=>{
            let user=await db.get().collection("users").findOne({_id:ObjectID(id)})
            resolve(user)
        })
    },
    updateUser:(id, userData)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection("users").updateOne({_id:ObjectID(id)}, {
                $set:{
                    name:userData.name,
                    age:userData.age,
                    gender:userData.gender,
                    address:{
                        place:userData.place,
                        city:userData.city,
                        country:userData.country
                    },
                    phone:userData.phone
    
                }
            }).then((res)=>{
                resolve(res)
            })
        })

    },
    blocKUser:(id)=>{
        return new Promise((resolve, reject)=>{
             db.get().collection("users").updateOne({_id:ObjectID(id)}, {
                $set:{isBlocked:true}
            }).then((result)=>{
                console.log(result)
                resolve({status:true})
            })
        })
    },
    unBlocKUser:(id)=>{
        console.log(id)
        return new Promise((resolve, reject)=>{
             db.get().collection("users").updateOne({_id:ObjectID(id)}, {
                $set:{isBlocked:false}
            }).then((result)=>{
                resolve({status:true})
            })
        })
    },
    deleteUser:(id)=>{
        return new Promise((resolve, reject)=>{
        db.get().collection("users").deleteOne({_id:ObjectID(id)}).then((result)=>{
            resolve({status:true})
        })
    })
    },
    userView:(id)=>{
        return new Promise(async (resolve, reject)=>{
            await db.get().collection("users").findOne({_id:ObjectID(id)}).then((user)=>{
                resolve(user)
            })
        })
    },
    addNewUser:(userData)=>{
        return new Promise(async (resolve, reject)=>{
            userData.address={place:userData.place, city:userData.city, country:userData.country};;
            userData.password = await bcrypt.hash(userData.password, 10);
            userData.isBlocked=false;
             db.get().collection("users").insertOne(userData).then((res)=>{
                 resolve(res.acknowledged)
             })
        })
    },
    updateUserPassword:(id, userData)=>{
        return new Promise(async (resolve, reject)=>{
            userData.password= await bcrypt.hash(userData.password, 10)
            db.get().collection("users").updateOne({_id:ObjectID(id)}, {$set:{password:userData.password}}).then((result)=>{
                console.log(result)
                resolve(result.acknowledged)
            })
        })
    },
    allUserLogout:(id)=>{
        return new Promise(async(resolve, reject)=>{
            let Id = ObjectID(id);
            let timeOut= new Date().getTime();
            await db.get().collection("Sessions").updateMany( {}, {$set:{'session.userLoggedIn':false, 'session.user':null}}).then((result)=>{
                resolve(result.acknowledged)
            })
        })
    },
    logoutOneUser:(id)=>{
        console.log("action " + id)
        return new Promise((resolve, reject)=>{
            db.get().collection("Sessions").updateOne({'session.user._id':ObjectID(id)}, {$set:{
                'session.userLoggedIn':false, 'session.user':null
            }}).then((result)=>{
                console.log(result)
                resolve({status:true})
            })
        })
    }

}