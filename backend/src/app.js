const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Hello, i'm in learning phase of backend")
    
});


module.exports = app;