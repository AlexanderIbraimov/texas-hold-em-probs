### Texas Hold`em Probability Calculator
[![Build and deploy poker-odds-calc](https://github.com/AlexanderIbraimov/texas-hold-em-probs/actions/workflows/main_poker-odds-calc.yml/badge.svg)](https://github.com/AlexanderIbraimov/texas-hold-em-probs/actions/workflows/main_poker-odds-calc.yml)

### About

- This calculator contains only one method that returns probabilities for Texas Hold'em
- This server is a wrapper over the [poker-odds-calc](https://www.npmjs.com/package/poker-odds-calc) library

### Usage

Request example:
http://localhost:3000/oddsHandler?playerCards=S2,SQ;D6,D7;C2,C3;C4,C5;C10,CQ&tableCards=H5,HK,HQ

Headers:

Key  | Value
------------- | -------------
API_KEY | A5F6F2A0-CE93-4A4E-AEC6-FC75F30888A 

Response example: 
```javascript
{
    "isSuccess": true,
    "playerStats": [
        {
            "winProb": 0.06882591093117409,
            "tieProb": [
                {
                    "probability": 0.1592442645074224,
                    "count": 118
                }
            ]
        },
        {
            "winProb": 0.06477732793522267,
            "tieProb": [
                {
                    "probability": 0.06072874493927125,
                    "count": 45
                }
            ]
        },
        {
            "winProb": 0.029689608636977057,
            "tieProb": [
                {
                    "probability": 0.06072874493927125,
                    "count": 45
                }
            ]
        },
        {
            "winProb": 0.14304993252361672,
            "tieProb": [
                {
                    "probability": 0.06072874493927125,
                    "count": 45
                }
            ]
        },
        {
            "winProb": 0.5344129554655871,
            "tieProb": [
                {
                    "probability": 0.1592442645074224,
                    "count": 118
                }
            ]
        }
    ],
    "handStats": {
        "royalFlush": 0,
        "straightFlush": 0,
        "fourOfAKind": 0.00022492127755285648,
        "fullHouse": 0.010571300044984256,
        "flush": 0.05060728744939271,
        "straight": 0.01866846603688709,
        "threeOfAKind": 0.03126405757984705,
        "twoPair": 0.203778677462888,
        "onePair": 0.3945119208277103,
        "highCard": 0.12370670265407108
    }
}
```
