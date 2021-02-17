const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const axios = require('axios');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('dist'));

const port = 3000;

const listening = () => {
  console.log(`running on localhost: ${port}`);
};

app.listen(port, listening);

require('./thoughts')(app);