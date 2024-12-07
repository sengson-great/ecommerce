import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import router from './routes/userRoute'
import productRouter from './routes/productRoute'

const app = express()
app.use(express.json())
app.use(cors())

app.use('/user',router);
app.use('/product',productRouter);

mongoose.connect('mongodb://localhost:27017/ecommerce');
app.listen(3001,()=>{
    console.log('Server running on port 3001');
})