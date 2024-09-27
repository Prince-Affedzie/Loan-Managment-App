const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const africastalking = require('africastalking')
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes')
const loanRoutes = require('./Routes/loanRoutes')
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(CookieParser())
app.use(cors({
  origin: 'https://loan-managment-frontend.vercel.app', // Replace with your actual Vercel frontend URL
  methods: 'GET,POST,PUT,DELETE',
  credentials: true
}))

app.options('*', cors());
app.use(express.static(path.join(__dirname, 'Loan-Management-frontend/build')));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
   .then(()=>app.listen(port, () => console.log(`Server is running on port ${port}`)))
   .catch((err) => console.log(err));
   
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/loan', loanRoutes)
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'Loan-Managment-frontend/build', 'index.html'))
})

const credentials = {
  apiKey: 'atsk_d2b03e3411190601b8b6144459a427bc9d6c4e680f8d7dbeb6d5d0c7285f17cf27038164',      // Replace with your Africa's Talking API key
  username: 'sandbox'    // Use 'sandbox' if you're in development mode
};

// Initialize the SDK with your credentials
const at = africastalking(credentials);

// Get the SMS service
const sms = at.SMS;