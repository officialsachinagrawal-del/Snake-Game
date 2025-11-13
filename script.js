// game constant and variables
let inputDir = {x:0, y:0};
let score = 0;
const foodSound = new Audio("food.mp3");
const gameOverSound= new Audio("game_over_music.mp3");
const moveSound = new Audio("move.mp3");
let musicSound = new Audio("background_music.mp3");
let lastPaintTime = 0;
let speed = 6;
let snakeArr = [// here only single array element
    
        {x:13, y:15} // its coordinate are as head of snake
    
];
let food = {x:4, y:6} ;
let gameOver = false // added : prevent repeated game-over actions



//game function
function main(ctime){ //!kis tiem pe program chalega

    // console.log(ctime)// to get what is the fps now

    window.requestAnimationFrame(main);  //repeateadly call the function to make 
    // lastPaintTime => tumhari screen last time kb paint hui
    // 1000 = to get time in sec
    if((ctime - lastPaintTime)/1000 < 1/speed){ // after a given time (2s) ye chalega 
       return ;

    }
    lastPaintTime = ctime;
    gameEngine();
    
}
const board = document.getElementById('board');

let ScoreBox = document.getElementById("ScoreBox");
let highscoreBox = document.getElementById("HighScoreBox")

function isCollide(snake){
    // if it bump(takraaya) to yourself
    for (let i = 1; i < snake.length; i++) {
        //snake[0] => head of snake
        // snake[i] => any postion of snake body
       if(snake[i].x === snake[0].x  && snake[i].y === snake[0].y){
        return true;
       }
    }

    //? if it bump to waal  (agr diwar se takraata h to)
    if(snake[0].x >= 18 || snake[0].x<=0 || snake[0].y >=18 || snake[0].y <=0){
      
        return true;
    }
    return false;

  
        
    

 
}
//! start button
const startBtn = document.getElementById('start-btn');
startBtn.addEventListener('click', () => {
  musicSound.play();
  window.requestAnimationFrame(main);
  startBtn.style.display = 'none';
});

function gameEngine(){

    //! part1 := update snake body part location as it as array 
    
    // agr collide ho jaata h to
    if(isCollide(snakeArr)){
        if(!gameOver){
            gameOver = true;
            musicSound.pause();
            gameOverSound.play();
            moveSound.pause();
            inputDir = {x:0, y:0};
            
            const gameOverScreen = document.querySelector('.game-over');
            gameOverScreen.classList.add('show');
        }
        return ;
        

    }
    // ?if you have eaten the food , increament in the score and regenerate the food 

    // snakeArr[0] => head of snake 
    if(snakeArr[0].x === food.x  && snakeArr[0].y === food.y){ // head or food ke coordinate matching condition
        foodSound.play();
        score += 1; // update the score;

        if(score > highscoreVal){    
            highscoreVal = score;
             localStorage.setItem('highscore', JSON.stringify(highscoreVal));
             highscoreBox.innerHTML  = "HighScore :" + highscoreVal;
        }
        ScoreBox.innerHTML = "Score :" + score;
        //snake length increament
        snakeArr.unshift({x:snakeArr[0].x + inputDir.x , y:snakeArr[0].y + inputDir.y});
        //update food location
        let a = 2;
        let b = 16;
        food = {x:Math.round(a + (b-a)* Math.random()) , y:Math.round(a+(b-a)* Math.random())}; // random location generate kr rha h 
    } 
    
    // moving the snake
    for (let i = snakeArr.length-2; i >=0; i--) {
    
        snakeArr[i+1] = {...snakeArr[i]} // desturcturing 
        
    }
    snakeArr[0].x += inputDir.x;  //? changing head x coordinate 
    snakeArr[0].y += inputDir.y;  // changing head y coordinate
    


    //! part2 := display snake and food( jo khana jaaega)
    board.innerHTML = "" // starting me board khaali hona chahie
  
    // display snake 
    snakeArr.forEach((element,index)=>{ // jese jese vo khana khata jaaega element add hote jaegnge
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = element.y; // gridRoWstart => jo postion daal rhe h us row me aaa jaaege
        snakeElement.style.gridColumnStart = element.x; //gridRwoClm = > jo postion daal rhe h us row me aaa jaaege
        if(index === 0){
            
            snakeElement.classList.add('head')
      
        }
        else{
            snakeElement.classList.add('snake');
        }
     
        board.appendChild(snakeElement);


    });

       //!disply food

        let foodElement = document.createElement("div");
        foodElement.style.gridRowStart = food.y; // gridRoWstart => jo postion daal rhe h us row me aaa jaaege
        foodElement.style.gridColumnStart = food.x; //gridRwoClm = > jo postion daal rhe h us row me aaa jaaege
        
        foodElement.classList.add('food');
        board.appendChild(foodElement);


}




// game logic
let highscore = localStorage.getItem('highscore');
if(highscore === null){
    var highscoreVal = 0;
    localStorage.setItem('highscore', JSON.stringify(highscoreVal));
}
else{
    var highscoreVal = JSON.parse(highscore);
    highscoreBox.innerHTML = "HighScore : "  + highscore;


}
window.requestAnimationFrame(main);

// 🟩 Touch controls for mobile
let startX, startY, endX, endY;

board.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

board.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
});

function handleSwipe() {
    const diffX = endX - startX;
    const diffY = endY - startY;

    // Prevent tiny accidental touches
    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10) return;

    // Determine direction (horizontal vs vertical swipe)
    if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0 && inputDir.x !== -1) {
            inputDir = { x: 1, y: 0 }; // right
        } else if (diffX < 0 && inputDir.x !== 1) {
            inputDir = { x: -1, y: 0 }; // left
        }
    } else {
        // Vertical swipe
        if (diffY > 0 && inputDir.y !== -1) {
            inputDir = { x: 0, y: 1 }; // down
        } else if (diffY < 0 && inputDir.y !== 1) {
            inputDir = { x: 0, y: -1 }; // up
        }
    }

    // Play move sound & start music
    moveSound.play();
    musicSound.play();
}






window.addEventListener('keydown',e =>{
    if(gameOver){
        gameOver = false;
        snakeArr = [{ x: 13, y: 15 }];
        food = { x: 4, y: 6 };
        score = 0;

    }
    inputDir = {x:0, y:0} // start the game
    musicSound.play();
    moveSound.play();

    switch (e.key) { //! ye bataege konsi key press kri h uske hissab se action peform hoga
      
        case "ArrowUp":
          console.log("Up key pressed");
          inputDir.x =0 ;
          console.log(inputDir.x);
          inputDir.y =-1 ;
          console.log(inputDir.y)
          break;
    
        case "ArrowDown":
          console.log("Down key pressed");
          inputDir.x =0 ;
          inputDir.y = 1;
          break;
    
        case "ArrowLeft":
          console.log("Left key pressed");
          inputDir.x =-1 ;
          inputDir.y =0 ;
          break;
    
        case "ArrowRight":
          console.log("Right key pressed");
          inputDir.x =1;
          inputDir.y =0 ;
          break;
        
         default:
             console.log("spaceBar is pressed")
         break;
    }
})

