const express = require('express');

const { calculateEquity } = require('poker-odds');


const iterations = 1000000000; 
const exhaustive = false; 

try {
    const app = express();
    app.use("/oddsHandler", function(request, response){
        let playerCards = request.query.playerCards;
        let tableCards = request.query.tableCards;
        parserPlayerCards(playerCards);
        let board = parserTableCards(tableCards);
        let hands = parserPlayerCards(playerCards);
        
        response.send(JSON.stringify(calculateEquity(hands, board, iterations, exhaustive)));
    });
    app.listen(8080);
} catch (error) {
    console.log(error);
}


function parserPlayerCards(playerCards) {
    let hands = playerCards.split(';').filter(c=>c);;
    let result = [];
    
    hands.forEach(hand => {
        var cards = hand.split(',').filter(c=>c).map(c=> fixCard(c));
        result.push(cards);
    });
    
    return result;
}

function parserTableCards(tableCards){
    return tableCards.split(',').filter(c=>c).map(c=>fixCard(c));
}

function fixCard(card){
    var cardType = card.substring(0, 1);
    var cardValue = card.substring(1);
    if (cardValue=='10')
    {
        cardValue = 'T';
    }
    
    return `${cardValue.toUpperCase()}${cardType.toLowerCase()}`;
}