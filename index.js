const express = require('express')
const ds18b20 = require('ds18b20');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/temp", (req, res) => {
  const id = req.params.id || "28-0215011c09ff"

  res.json({ "ok": true, temp: ds18b20.temperatureSync(id) })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})