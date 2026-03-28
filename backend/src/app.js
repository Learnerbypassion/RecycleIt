import express from "express"
import dotenv from "dotenv"
import wasteRoutes from "./routes/waste.routes.js"
import collectorRoutes from "./routes/collector.routes.js"
import pickupRoutes from "./routes/pickup.routes.js"
dotenv.config()
const app = express()
app.use(express.json())
app.use('/api/waste', wasteRoutes)
app.use('/api/collector', collectorRoutes)
app.use('/api/pickup', pickupRoutes)
app.get('/', (req, res)=>{
    res.send("This is the backend of our hack")
})

export default app;