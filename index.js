const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())

app.get('/', (req, res) => {
    res.send('Blog server running')
});
app.listen(port, () => {
    console.log(`Blog app listening on port ${port}`)
})