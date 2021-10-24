const dotenv = require('dotenv')
dotenv.config()
const mongoClient = require("mongodb").MongoClient
const dbState = {
    db:null
}
module.exports.connect=function(done){
    let url = process.env.DB
    let dbname="user-management"

    mongoClient.connect(url, (err, data)=>{
        if(err) return  done(err)
        dbState.db=data.db(dbname)
        done()
    })

}
module.exports.get=function() {
    return dbState.db
}