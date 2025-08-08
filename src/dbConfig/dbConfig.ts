import mongoose from 'mongoose';

export async function connect(){
    try{
        mongoose.connect(process.env.MONGODB_URI!);
        console.log("Db connected")
        const connection = mongoose.connection;
        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });
        connection.on('error', (err) => {
            console.log(`MongoDB connection error: ${err}`);
            process.exit();
        });
    } catch(error){
        console.log("Db connection failed");
    }
}