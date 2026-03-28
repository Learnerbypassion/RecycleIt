import app from "./src/app.js"
import connectDB from "./src/config/db.js"

const PORT = process.env.PORT || 3000
connectDB()
app.listen(PORT , (req, res)=>{
    console.log("This server is running in "+PORT)
    console.log("http://localhost:"+PORT);
    
})