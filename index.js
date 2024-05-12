const express = require('express');
const connectDB = require('./database/connectDB')
const cors = require('cors');
const app = express()
connectDB()


app.use(express.json())
app.use(cors());
app.use('/app/v1/users', require('./routes/UserRoutes') )
app.use('/app/v1/product', require('./routes/ProductRoutes') )


app.listen(9090, ()=>{
    console.log('server started')
})