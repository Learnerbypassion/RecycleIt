import express from "express"
import dotenv from "dotenv"
import wasteRoutes from "./routes/waste.routes.js"
import collectorRoutes from "./routes/collector.routes.js"
import pickupRoutes from "./routes/pickup.routes.js"
import aiRoutes from "./routes/ai.routes.js"
import cors from "cors"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

app.use('/api/waste', wasteRoutes)
app.use('/api/collector', collectorRoutes)
app.use('/api/pickup', pickupRoutes)
app.use('/api/ai', aiRoutes)
app.get('/', (req, res)=>{
    res.send("This is the backend of our hack")
})

export default app;