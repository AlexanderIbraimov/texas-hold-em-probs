const express = require('express');
const { calculateEquity } = require('poker-odds');


try {
    const app = express();
    app.use("/oddsHandler", function(request, response){
    });
    app.listen(8080);
} catch (error) {
    
}

