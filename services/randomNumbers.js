'use strict'

exports.randomNumber = function(array,score,max){

    const results = !array.results ? array : array.results;
    let randomNumbers = [];

    for(let value of results){    
        let randomNum = Math.floor(Math.random() * max);
        
        if(!randomNumbers.length){
            randomNumbers.push(randomNum);
        }else{
            var repeted = true;
            while(repeted == true){
                if(randomNumbers.indexOf(randomNum) < 0){
                    randomNumbers.push(randomNum);
                    repeted = false;
                }else{
                    randomNum = Math.floor(Math.random() * max);
                }
            }
        } 
        value[score] = randomNum;
        results.sort(function(a, b) {
            if (score == "suggestionScore")
                return b.suggestionScore - a.suggestionScore;
            else    
                return b.suggestionForTodayScore - a.suggestionForTodayScore
        });        
    }

    return array;
};