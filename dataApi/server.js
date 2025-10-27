require('dotenv').config();


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const datatableRoutes = require('./routes/datatable');
app.use('/api', datatableRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});