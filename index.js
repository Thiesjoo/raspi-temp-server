const express = require('express')
const ds18b20 = require('ds18b20');
const cors = require("cors")

const execSync = require('child_process').execSync;
const tempMatchRegex = /[0-9]*\.[0-9]*/

function getCPUTemp() {
  let result = execSync("vcgencmd measure_temp", { encoding: 'utf-8' });
  return tempMatchRegex.exec(result)[0]
}

const app = express()
app.use(cors())
const port = 3000


app.get("/", (req, res) => {
  const id = req.params.id || "28-0215011c09ff"

  res.json({ "ok": true, room: ds18b20.temperatureSync(id), pi: getCPUTemp() })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
