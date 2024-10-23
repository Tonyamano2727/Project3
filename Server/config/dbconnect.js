const {default : mongoose} = require('mongoose')
mongoose.set('strictQuery' , false) // hide bug teminal 
const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGPDB_URI)
        if(conn.connection.readyState === 1) console.log('DB Connecttion is successfully')
        else console.log('Db connecting')
    } catch (error) {
        console.log('Db connect is failed')
        throw new Error(error)
    }
}
module.exports = dbConnect