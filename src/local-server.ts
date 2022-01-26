import { redisSync } from "./database/cloudSync";


const app = require("../functions/server")

app.get("/sync", async (r, w)=>{
  // let rr = await redisSync("localToCloud")
  w.send("sync")
})


const PORT = process.env.PORT || 3300
app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`) )

