const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Repayment = require('./Models/repaymentModel')
const CookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')

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

   const runMigrations = async () => {
    try {
      await Repayment.updateMany(
        { transactionId: { $exists:false } }, 
        { $set: { transactionId:" " } }
      );
      console.log('All users updated with default verification status');
    } catch (err) {
      console.error('Error during migration:', err);
    }
  };
  
  // Call the migration function during startup
  runMigrations();
 
   
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes)
app.use('/api/loan', loanRoutes)
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'Loan-Managment-frontend/build', 'index.html'))
})

