const express = require('express');
const {TexasHoldem, SixPlusHoldem, Omaha} = require('poker-odds-calc');

const exhaustive = false; 

class Card {
    constructor(card) {
        this.card = card;
        this.value = card.substring(1,card.length);
        this.suit = card.substring(0,1);
        this.number = this.value;
        switch(this.value){
            case 'J':this.number = 11;break;
            case 'Q':this.number = 12;break;
            case 'K':this.number = 13;break;
            case 'A':this.number = 14;break;
        }
    }
}

try {
    const app = express();
    app.use("/oddsHandler", function(request, response){
        let playerCards = request.query.playerCards;
        let tableCards = request.query.tableCards;
        parserPlayerCards(playerCards);
        let board = parserTableCards(tableCards);
        let hands = parserPlayerCards(playerCards);
        let Table = new TexasHoldem();
        Table._exhaustive = false;
        hands.forEach(h=>{
            Table.addPlayer(h);
        });
        Table.setBoard(board);
        let result = Table.calculate();
        response.send(JSON.stringify(getProbabilityResult(result)));
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
    var playerStats=[];
    var iterations = calc.result.iterations;
    var royalFlush = 0;
    var straightFlush= 0;
    var fourOfAKind= 0;
    var fullHouse= 0;
    var flush= 0;
    var straight= 0;
    var threeOfAKind= 0;
    var twoPairs= 0;
    var onePair= 0;
    var highCard =0;
    calc.getPlayers().forEach(p=>{
        var handData = {
            'winProb1':p.data.wins / iterations,
            'winProb2':p.getWinsPercentage(),
            'tieProb':{
                'probability1':p.data.ties / iterations,
                'probability2':p.getTiesPercentage(),
                'count':p.ties 
            }
        };
        // royalFlush += p.data.ranks.ROYAL_FLUSH;
        // straightFlush += p.data.ranks.STRAIGHT_FLUSH;
        // fourOfAKind += p.data.ranks.QUADS;
        // fullHouse += p.data.ranks.FULL_HOUSE;
        // flush += p.data.data.ranks.FLUSH;
        // straight += p.data.ranks.STRAIGHT;
        // threeOfAKind += p.data.ranks.TREE_OF_A_KIND;
        // twoPairs += p.data.ranks.TWO_PAIRS;
        // onePair += p.data.ranks.ONE_PAIR;
        // highCard += p.data.ranks.HIGH_CARDS;
        playerStats.push(handData);
    });
    
    return {
        'playerStats':playerStats,
        'handStats': {
            'royalFlush':royalFlush / iterations,
            'straightFlush':straightFlush / iterations,
            'fourOfAKind':fourOfAKind / iterations,
            'fullHouse':fullHouse / iterations,
            'flush':flush / iterations,
            'straight':straight / iterations,
            'threeOfAKind':threeOfAKind / iterations,
            'twoPairs':twoPairs / iterations,
            'onePair':onePair / iterations,
            'highCard':highCard / iterations
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

//The strongest Hold'em combination. 
//It consists of five cards of the same suit, from ten to Ace.
//It's worth remembering that there is no suits precedence in poker, 
//so in case two or more players collect a royal flush (which is very unlikely), they divide the pot. 

function royalFlush(handCards, table){
    
}
function straightFlush(handCards, table){
    
}
function fourOfAKind(handCards, table){
    
}

function fullHouse(handCards, table){
    
}

function setTriple(handCards, table){
    
}
function twoPairs(handCards, table){
    
}
function pair(handCards, table){
    
}
function highCard(handCards, table){
    
}


