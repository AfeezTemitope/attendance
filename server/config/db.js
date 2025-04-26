import mongoose from "mongoose"
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            authMechanism: 'SCRAM-SHA-1',
        })
        console.log('mongoDB connected successfully')
    } catch (err){
        console.error('mongoDB connection error: ', err.message)
        process.exit(1)
    }
}

export default connectDB