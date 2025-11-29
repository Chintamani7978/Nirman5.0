const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require("cors")
const router = require("./routes/Route")

dotenv.config()
const app = express()

app.use(cors({
    origin:'*'
}));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api',router)

try {
    mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log("Connectd to DataBase")
        app.listen(3000,()=>{
            console.log("Server is Running")
        })
    })
} catch (error) {
    console.log("Unabel to Connect Database")
}