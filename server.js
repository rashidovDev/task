const express = require("express")
const router = require("./routes/auth")

const app = express()

//parse
app.use(express.json())

const PORT = process.env.PORT || 5000

app.use("/", router)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))


