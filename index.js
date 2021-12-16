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
        var quity = calculateEquity(hands, board, iterations, exhaustive);
        console.log(quity);
        response.send(JSON.stringify(getProbabilityResult(quity)));
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

function getProbabilityResult(quity){
        var playerStats=[];

        for(var hand=0; hand < 6;hand++){
            var handData = {
                'winProb':0.0,
                'tieProb':{
                    'probability':0.0,
                    'count':0
                }
            };
            playerStats.push(handData);
        }

        return {
            'playerStats':playerStats,
            'handStats': {
                'royalFlush':0.0,
                'straightFlush':0.0,
                'fourOfAKind':0.0,
                'fullHouse':0.0,
                'flush':0.0,
                'straight':0.0,
                'threeOfAKind':0.0,
                'twoPairs':0.0,
                'onePair':0.0,
                'highCard':0.0
            },
            'additionalStats':{
                'redsOver25':0.0,
                'redsUnder25':0.0,
                'clubsOver15':0.0,
                'clubsUnder15':0.0,
                'heartsOver15':0.0,
                'heartsUnder15':0.0,
                'diamondsOver15':0.0,
                'diamondsUnder15':0.0,
                'spadesOver15':0.0,
                'spadesUnder15':0.0,
            }
        }
}