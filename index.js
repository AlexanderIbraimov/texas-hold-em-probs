const express = require('express');
const {TexasHoldem, SixPlusHoldem, Omaha} = require('poker-odds-calc');
var port = process.env.PORT || 3000;

try {
    const app = express();
    app.use("/oddsHandler", function(request, response){
        if(!request.query.playerCards){
            response.send({
                isSuccess: false,
                message: "playerCards cannot be empty"
            });
        }
        if(!request.query.tableCards){
            response.send({
                isSuccess: false,
                message: "tableCards cannot be empty"
            });
        }
        try{
            let board = parserTableCards(request.query.tableCards);
            let players = parserPlayerCards(request.query.playerCards);
            let table = new TexasHoldem();
            players.forEach(p=>table.addPlayer(p));
            table.setBoard(board);
            response.send(getProbabilityResult(table.calculate()));
        }
        catch {
            response.send({
                isSuccess: false,
                message: "Invalid input data format"
            });
        }
    });
    app.listen(port);
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
    var suit = card.substring(0, 1);
    var cardValue = card.substring(1);
    if (cardValue=='10')
    {
        cardValue = 'T';
    }
    
    return `${cardValue.toUpperCase()}${suit.toLowerCase()}`;
}

function getProbabilityResult(calc){
    var playerStats = [];
    var iterations = calc.result.iterations;
    var royalFlush = 0;
    var straightFlush = 0;
    var fourOfAKind = 0;
    var fullHouse = 0;
    var flush = 0;
    var straight = 0;
    var threeOfAKind = 0;
    var twoPairs = 0;
    var onePair = 0;
    var highCard =0;
    calc.getPlayers().forEach(p=>{
        var handData = {
            'winProb':p.data.wins / iterations,
            'tieProb':{
                'probability':p.data.ties / iterations,
                'count':p.ties 
            }
        };
        
        royalFlush += p.data.ranks.ROYAL_FLUSH;
        straightFlush += p.data.ranks.STRAIGHT_FLUSH;
        fourOfAKind += p.data.ranks.QUADS;
        fullHouse += p.data.ranks.FULL_HOUSE;
        flush += p.data.ranks.FLUSH;
        straight += p.data.ranks.STRAIGHT;
        threeOfAKind += p.data.ranks.TREE_OF_A_KIND;
        twoPairs += p.data.ranks.TWO_PAIRS;
        onePair += p.data.ranks.ONE_PAIR;
        highCard += p.data.ranks.HIGH_CARDS;
        playerStats.push(handData);
    });
    
    return {
        'isSuccess': true,
        'playerStats':playerStats,
        'handStats': {
            'royalFlush':royalFlush / iterations / 6,
            'straightFlush':straightFlush / iterations/ 6,
            'fourOfAKind':fourOfAKind / iterations/ 6,
            'fullHouse':fullHouse / iterations / 6,
            'flush':flush / iterations/ 6,
            'straight':straight / iterations/ 6,
            'threeOfAKind':threeOfAKind / iterations/ 6,
            'twoPairs':twoPairs / iterations/ 6,
            'onePair':onePair / iterations/ 6,
            'highCard':highCard / iterations/ 6
        }
    }
}
