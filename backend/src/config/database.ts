import mongoose from "mongoose";

async function connectDatabase(){
    try{
        await mongoose.connect(process.env.MONGO_URI as string);
         console.log("✅ Database Connected Successfully");
    }catch(error){
         console.error("Database Connection Error:", error);

    }
}

export default connectDatabase;