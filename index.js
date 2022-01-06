const express = require('express');
const {TexasHoldem, SixPlusHoldem, Omaha} = require('poker-odds-calc');

try {
    const app = express();
    app.use("/oddsHandler", function(request, response){
        let playerCards = request.query.playerCards;
        let tableCards = request.query.tableCards;
        parserPlayerCards(playerCards);
        let board = parserTableCards(tableCards);
        let hands = parserPlayerCards(playerCards);
        let Table = new TexasHoldem();
        hands.forEach(h=>{
            Table.addPlayer(h);
        });
        Table.setBoard(board);
        let result = Table.calculate();
        response.send(getProbabilityResult(result));
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
            },
            // 'ranks':
            // {
            //     'ROYAL_FLUSH':p.data.ranks.ROYAL_FLUSH/ iterations,
            //     'STRAIGHT':p.data.ranks.STRAIGHT/ iterations,
            //     'STRAIGHT_FLUSH':p.data.ranks.STRAIGHT_FLUSH/ iterations,
            //     'QUADS':p.data.ranks.QUADS/ iterations,
            //     'FULL_HOUSE':p.data.ranks.FULL_HOUSE/ iterations,
            //     'FLUSH':p.data.ranks.FLUSH/ iterations,
            //     'TREE_OF_A_KIND':p.data.ranks.TREE_OF_A_KIND/ iterations,
            //     'TWO_PAIRS':p.data.ranks.TWO_PAIRS/ iterations,
            //     'ONE_PAIR':p.data.ranks.ONE_PAIR/ iterations,
            //     'HIGH_CARDS':p.data.ranks.HIGH_CARDS/ iterations,
            // }
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