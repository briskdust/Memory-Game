/*
 * 创建一个包含所有卡片的数组
 */

const iconList = [
    "fa fa-barcode", "fa fa-bitcoin", "fa fa-chrome", "fa fa-balance-scale",
    "fa fa-500px", "fa fa-edit", "fa fa-camera-retro", "fa fa-github-square",
    "fa fa-barcode", "fa fa-bitcoin", "fa fa-chrome", "fa fa-balance-scale",
    "fa fa-500px", "fa fa-edit", "fa fa-camera-retro", "fa fa-github-square"
];

/*
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 */

// 洗牌函数来自于 http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * 完善洗牌函数
 */

function completeShuffle(){
    let newList = shuffle(iconList);
    for(let i =0; i < cards.length; i++){
        cards[i].firstElementChild.className = newList[i];
    }
}

/*
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */

const cards = document.querySelectorAll('.card');
const restart = document.querySelector('.restart');

let matchedCards = [];

let hour = 0;
let minute = 0;
let second = 0;
let timerSwitch = false;
const hourTimer = document.querySelector('.hour');
const minuteTimer = document.querySelector('.minute');
const secondTimer = document.querySelector('.second');

let moves = 0;
let numOfMoves = document.querySelector('.moves');

let finalStars = 3;
let numOfStars = document.querySelectorAll('.fa-star');

const modal = document.querySelector('.modal');
const modalTime = document.querySelector('.modal-time');
const modalScore = document.querySelector('.modal-score');
const modalMoves = document.querySelector('.modal-moves');
const restartBtn = document.querySelector('.restart-btn');
const closeBtn = document.querySelector('.red-circle');

let isCardOpen = false;
let prevention = false;
let firstCard, secondCard;

/*
 * 点击任意卡牌后实现翻牌功能
 */

function openCard(){

    //启动计时器
    if(!timerSwitch){
        timeCalc();
        timerSwitch = true;
    }

    //防止有第三张牌被点击翻动
    if(prevention)return;
    this.classList.add('open');
    this.classList.add('show', 'scale-up-center');

    if(!isCardOpen){
        isCardOpen = true;
        firstCard = this;
        //防止同一张牌被点击两次
        firstCard.removeEventListener('click', openCard);
        return;
    }

    isCardOpen = false;
    secondCard = this;
    
    examination();
    
}

/*
 * 验证点击的两张卡牌是否相符
 */
function examination(){
    moveCalc();
    prevention = true;
    if(firstCard.firstElementChild.classList[1] === secondCard.firstElementChild.classList[1]){
        discard();
        setTimeout(function(){
            firstCard.classList.add('match', 'jello-horizontal');
            secondCard.classList.add('match', 'jello-horizontal');
        }, 400)
        prevention = false;

        //若所有卡牌均被匹配，则结束游戏
        matchedCards.push(firstCard.firstElementChild.classList[1]);
        if(matchedCards.length===8){
            console.log(matchedCards);
            timerStop();
            endGame();
        }
        
        return;
    
    }

    setTimeout(function(){
        firstCard.classList.add('shake', 'red');
        secondCard.classList.add('shake', 'red');
        firstCard.addEventListener('click', openCard);
    }, 300)

    resetCards();
}

/*
 * 防止已匹配的卡牌被重复点击
 */
function discard(){
    firstCard.removeEventListener('click', openCard);
    secondCard.removeEventListener('click', openCard);
}

/*
 * 若匹配失败，则重置卡牌
 */
function resetCards(){
    setTimeout(function(){
        firstCard.classList.remove('open');
        firstCard.classList.remove('show');
        firstCard.classList.remove('scale-up-center');
        firstCard.classList.remove('shake', 'red');
        secondCard.classList.remove('open');
        secondCard.classList.remove('show');
        secondCard.classList.remove('scale-up-center');
        secondCard.classList.remove('shake', 'red');
        prevention = false;
    }, 1300)
}

/*
 * 在第一张卡牌被点击后启动计步器
 */
function moveCalc(){
    moves++;
    numOfMoves.innerHTML = (moves === 1 ? "1 Move" : `${moves} Moves`);

    starsCalc();
}

function starsCalc(){
    if(moves === 17){
        finalStars--;
        numOfStars[2].classList.add('translucent');
    }else if(moves === 30){
        finalStars--;
        numOfStars[1].classList.add('translucent');
    }
}

function timeCalc(){
    calc = setInterval(() => {
        second++;
        if(second === 60){
            minute++;
            second = 0;
        }else if(minute == 60){
            hour++;
            minute = 0;
        }

        displayTime();

    }, 1000);
}

/*
 * 将时间转换为字符串
 */
function displayTime(){
    hourTimer.textContent = strTime(hour);
    minuteTimer.textContent = strTime(minute);
    secondTimer.textContent = strTime(second);
}

function strTime(time){
    let result = '' + time;
    return result.length>1? `${result}`:`0${result}`;
}

/*
 * 重置时间
 */
function resetTime(){
    clearInterval(calc);
    timerSwitch = false;
    hour = 0;
    minute = 0;
    second = 0;
    hourTimer.textContent = "00";
    minuteTimer.textContent = "00";
    secondTimer.textContent = "00";
}

function timerStop(){
    clearInterval(calc);
}

function resetScores(){
    finalStars = 3;
    if(numOfStars[2].classList.contains('translucent')){
        numOfStars[2].classList.remove('translucent');
    }
    if(numOfStars[1].classList.contains('translucent')){
        numOfStars[1].classList.remove('translucent');
    }
}

/*
 * 重置所有卡牌
 */
function clearBoard(){
    cards.forEach(item => item.classList.remove('open', 'show', 'scale-up-center', 'shake', 'red'));
    prevention = false;
    isCardOpen = false;
    firstCard = '';
    secondCard = '';
}

function removeMatches(){
    cards.forEach(item => item.classList.remove('match', 'jello-horizontal'));
}

/*
 * 重启游戏
 */
function restartGame(){
    resetTime();
    resetScores();
    matchedCards = [];
    clearBoard();
    moves = 0;
    numOfMoves.innerHTML = `${moves} Moves`;
    removeMatches();
    cards.forEach(card => card.addEventListener('click', openCard));
    completeShuffle();
}

/*
 * 结束游戏并触发 Modal
 */
function endGame(){
    modalTime.innerHTML = `${strTime(hour)}:${strTime(minute)}:${strTime(second)}`;
    modalScore.innerHTML = `${finalStars} Stars`;
    modalMoves.innerHTML = `${moves}`;
    modal.style.display = 'block';
}


cards.forEach(card => card.addEventListener('click', openCard));
restart.addEventListener('click', restartGame);
closeBtn.addEventListener('click', function(){
    modal.style.display = 'none';
});
restartBtn.addEventListener('click', function(){
    modal.style.display = 'none';
    restartGame();
});
completeShuffle();