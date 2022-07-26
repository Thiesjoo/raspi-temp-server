import express from "express"
import cors from "cors"
import { getCPUTemperature, getTemperatureSensor } from './temperature.js'

const app = express()
app.use(cors())
const port = 3000


app.get("/", (req, res) => {
  res.json({ "ok": true, room: getTemperatureSensor(), pi: getCPUTemperature() })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
