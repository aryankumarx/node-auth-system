require('dotenv').config();
const express = require('express');
const connectToDB = require('./database/db')
const authRoutes = require('./Routes/auth-routes');
const homeRoutes = require('./Routes/home-routes');
const adminRoutes = require('./Routes/admin-routes');
const uploadImageRoutes = require('./Routes/image-routes');

const PORT = process.env.PORT || 3000;
const app = express(); 


// Connects to MongoDB via
connectToDB();

//middleware
app.use(express.json());


//route
app.get('/', (req,res)=>{
   res.send("Secure Node.js Authentication & File Management System is Live.");
})

app.use('/api/auth',authRoutes);

app.use('/api/home', homeRoutes); //Home routes (protected)

app.use('/api/admin', adminRoutes); //Admin-only routes

app.use('/api/image',uploadImageRoutes);


app.listen(PORT,()=>{
   // console.log(`Server is running on port ${PORT}`)
})


// do not use semicolon ';' in .env file



//Register → Save user → Login → Get token → Use token to access /home → If admin → access /admin

