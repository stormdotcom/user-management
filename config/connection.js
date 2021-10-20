const mongoClient = require("mongodb").MongoClient
const dbState = {
    db:null
}
module.exports.connect=function(done){
    let url = "mongodb://localhost:27017/DB"
    let dbname="user-mangement"

    mongoClient.connect(url, (err, data)=>{
        if(err) return  done(err)
        dbState.db=data.db(dbname)
        done()
    })

}
module.exports.get=function() {
    return state.db
}