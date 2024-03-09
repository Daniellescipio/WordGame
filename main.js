//I tried a few different APIs, but I just need like normie five letter words, so I made my own file, it's got...lots of 5-letter words in it!
import { wordArray } from "./words.js";
document.addEventListener('DOMContentLoaded', ()=>{
//randomly selects a word from our...many words.
let generateWord = ()=>{
    //so many words that they are broken into arrays, so a random array is chosen...
    let randomArray = wordArray[Math.floor(Math.random() * wordArray.length)]
    //...and then a random word from that array
    let randomWord = randomArray[Math.floor(Math.random() * randomArray.length)]
    //retrun the word for furture use...
    return randomWord
}
//the word our game will be played with
let newWord = generateWord()
console.log(newWord)
//let newWord = "inbox"


//Game container, board, keyboard, and keyboard rows are gotten from html
//the entered word will appear here as the player types/clicks
const gameBoard = document.getElementById("gameboard");
//three different keyboard rows to make it look like a real keyboard
const keyboardRowOne = document.getElementById("keyboardRowOne");
const keyboardRowTwo = document.getElementById("keyboardRowTwo");
const keyboardRowThree = document.getElementById("keyboardRowThree");
//displays win messages, loss messages, and warning for undefined and tooshort words. 
const dialogeBox = document.getElementById("dialogeBox")
//keeps track of the try a user is on, user has six tries
let currentAttempt="row-1"
//keeps track of the word being entered by the user
let enteredWord =[]
//create square tiles on game board in rows
for(let i = 0; i<6; i++){
    //each row is a div...
    let row = document.createElement("div")
    //give each row it's index as a rowID
    row.setAttribute("id",`row-${i+1}`)
    //styling...
    row.style.display = "contents"
    //nested array to make square dives inside each row for letters
    for(let x = 0; x<5; x++){
        //create each letter div
        const letterDiv = document.createElement("div")
        //class for styling
        letterDiv.setAttribute("class","letterDiv")
        //attribute for solving puzzle
        letterDiv.setAttribute("data-letter",false)
        // letterDiv.addEventListener("click",()=>{
        //     const letterInput = document.createElement("input")
        //     letterInput.classList.add("phoneType")
        //     letterDiv.append(letterInput)
        // })

        //append the square to the row...
        row.append(letterDiv)
    }
    //...append the row to the board.
    gameBoard.append(row)
}

//Letters for key board rows
const keyboardOneArray = ["Q","W","E","R","T","Y","U","I","O","P"]
const keyboardTwoArray = ["A","S","D","F","G","H","J","K","L"]
const keyboardThreeArray = ["ENTER","Z","X","C","V","B","N","M","DELETE"]
const alphabetArray = keyboardOneArray.concat(keyboardTwoArray, keyboardThreeArray)


//function to submit new word 
async function checkWord(){
    //turn current attempt into a number for easy evaluation and incrimenting
    //this is a sting with a hiphenated number, so the last index should always be a number
    let attempt = Number(currentAttempt[currentAttempt.length-1])
    //this will be assigned with a function 5 = win anything less = not win
    let winCount
    //First we check to be sure the word is long enough...
    if(enteredWord.length === 5){
        //then we run an API call to the dictionary to make sure it's actually a word...
        try{ 
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord.join("")}`)
            const result = await res.json()
            if(result[0]){ 
                //if it is a word we run our win loop to see if it's the winning word
                winCount = enterLoop()
                //if it is the winning word, we give a win message dependent of the players current attempt
                if(winCount === 5){
                    dialogeBox.textContent = attempt ===1 ? "Wow! You're a cheater!!" 
                    : attempt === 2 ? "Super smart or super lucky? Who cares! Great Job!"
                    : attempt === 3 ? "Awesome! Good Job!"
                    : attempt === 4 ? "Well Done"
                    : attempt === 5 ? "Better late than never!"
                    : "Really made me hold my breath...!"
                    gsap.to(dialogeBox, {display:"block"})
                //if they did not win...
                }else{
                    //if they are on their sixth attempt, game is over, and we display the word. 
                    if(attempt === 6){
                        dialogeBox.textContent = newWord
                        gsap.to(dialogeBox, {display:"block"})
                    }else{
                    //if they still have tries left, we just empty the word and go to the next attempt. 
                    enteredWord = []
                    attempt ++
                    currentAttempt = `row-${attempt}`
                    }

                }
            //if the word is not a word, we tell the player
            }else{
                dialogeBox.textContent = "That's not a word!"
                gsap.to(dialogeBox, {display:"block", repeat:1, yoyo:true})
            }
        //api error catch
        }catch(error){
            console.log(error)
        }
    //if the word is too short, we tell them such.
    }else{
        dialogeBox.textContent = "That word is too short!"
        gsap.to(dialogeBox, {display:"block", repeat:1, yoyo:true})
    }

}


//Creates each row of the keyboard from the keyboard array ad assigns an even listener to each letter/ enter and delete
function handleArray(array, keyBoardRow){
     for(let i = 0; i<array.length; i++){
        //a p tag is created for each letter in the array
        const keyDiv = document.createElement("p")
        //letters get one class and enter and delete get another for styling purposes
        array[i].length <= 1 ? keyDiv.setAttribute("class","keyDiv") : keyDiv.setAttribute("class","wordDiv")
        // the letter is assigned to the tile in a few different ways included the html text
        keyDiv.setAttribute("letter", array[i])
        keyDiv.setAttribute("data-key", array[i])
        keyDiv.textContent=array[i]
        //the tile is appended to the appropriate keyboard row
        keyBoardRow.append(keyDiv)
        //event listeners added based on whether the tile is a letter, delete, or enter
        if(array[i].length === 1){
            keyDiv.addEventListener("click", ()=>newLetterLoop(array[i])) 
        }else if(array[i].length === 5){
            keyDiv.addEventListener("click", ()=>checkWord()) 
        }else if(array[i] === "DELETE"){
            keyDiv.addEventListener("click", deleteLoop)
        } 
    }
}


//Enter, Delete and NewLetter Loops


function enterLoop(){
    //gsap timeline to ensure animation happens one letter at a time.
    const tl = gsap.timeline()
    //will keep track of the correctly guessed and placed letters, if it gets to five they win
    let winner = 0
    //get the row we are on
    let row = document.getElementById(currentAttempt)
    //get the spaces to check
    let spacesToCheck = [...row.children]
    //split the new word into an array, this is the word the user is trying to guess
    let newWordArray = newWord.split("")
    const foundLetters  = []
    //we loop throught the spaces to check...
    for(let i = 0; i<spacesToCheck.length; i++){
        //get each letter from it's space
       let letterToCheck = spacesToCheck[i].textContent
        //tracks the color change of each inner loop
        let color
        //checks the amount of times each letter appears in the new word
        let countArray = newWordArray.map(letter=>{
            var count = 0;
            newWordArray.forEach((v) => (v === letter && count++));
            return count;
        })
        // these variable will depend on the row where the letter is on the keyboard since there are three different keyboard arrays that are responsible for finding the keys on the keyboard that need to change colors
        let keyboardPlace
        let keyboardRow
        //first row
        if(keyboardOneArray.indexOf(letterToCheck)>=0){
            keyboardRow = document.getElementById("keyboardRowOne")
            keyboardPlace = keyboardOneArray.indexOf(letterToCheck)
        //second row
        }else if(keyboardTwoArray.indexOf(letterToCheck)>=0){
            keyboardRow = document.getElementById("keyboardRowTwo")
            keyboardPlace = keyboardTwoArray.indexOf(letterToCheck)
        //third row
        }else if(keyboardThreeArray.indexOf(letterToCheck)>=0){
            keyboardRow = document.getElementById("keyboardRowThree")
            keyboardPlace = keyboardThreeArray.indexOf(letterToCheck)
        }
        //we will loop through each letter of the new word. 
        //This loop will set the color of the letter being checked. a green color returned means the leter was found in the right place, yellow means it was found in the wrong place, grey means it was not found
       for(let x = 0; x <newWordArray.length; x++){
        //get's the number of appearances of each letter in the new word from peviousl defined array
        const appearences = countArray[x]
        //get each letter from the new word array
            let letterToCheckAgainst = newWordArray[x]
            //if the letter that we are on in spaces to check loop is equal to the letter we are on in the new word loop
            if(letterToCheck === letterToCheckAgainst.toUpperCase()){
                //..futhermore if they are in the same positions...
                if(i===x){
                    //change the color green
                    foundLetters.push(letterToCheckAgainst.toUpperCase())
                    color = "#69b969"
                    winner++
                    {break}
                    //if they are not in the same positions...
                }else{
                    //if we already found the letter we are checking AND it appears in the new word once or less 
                    if(foundLetters.indexOf(letterToCheck) >= 0 && appearences <=1){
                        //change the color grey
                        color = "grey" 
                        //in all other cases...
                    }else{
                        //change the color yellow
                        color = "#c3c311"
                       
                    }
                    
                }
            //the letter is not in the word
            }else{
                //the letter has been found previously, leave it how it was found
                if(color === "#c3c311"||color === "#69b969"){
                    continue
                    //otherwise...
                }else{
                    //change it grey
                    color = "grey" 
                }
            }
       }
       //use gsap to change the color of the keys on the gameboard and keyboard
       tl.to(spacesToCheck[i], {background:color, duration:.75})
       tl.to(keyboardRow.children[keyboardPlace], {background:color, duration:.75},"<")
    }
    //the winner variable (a number) is retuned from this variable. 
    return winner
}
//delete loop will run backwards on each/the approprite gameboard row.
function deleteLoop(){
    let row = document.getElementById(currentAttempt)
    let spacesToEmpty = row.children
    for(let i = spacesToEmpty.length-1; i>= 0; i--){
        // for the row the user is on, if the loop ecounters a gameboard tile that has a letter in it...
        if(spacesToEmpty[i].textContent !== ""){
            //the letter will be replaced with a "" which is to say to the user the letter will be deleted. it will be done in an animation, so we just assign it to a variable
             const callback = ()=> spacesToEmpty[i].textContent = ""

             //gsap will hide the game tile and clear the letter with animation
             gsap.to(spacesToEmpty[i], {opacity:1, ease: "bounce.out", onComplete: callback()})

             //the last letter of the entered word will be removed
             enteredWord.pop()
             //loop breaks to ensure only one letter is deleted
             {break}           
         }else{
            //if the tile is already empty, the loop will skip it
             {continue}   
         }
    }
} 
//newLetter loop will run  on each/the approprite gameboard row. 
function newLetterLoop(letter){
    let row = document.getElementById(currentAttempt)
    let spacesToFill = row.children
    for(let i = 0; i<=spacesToFill.length; i++){
        //if the loop encounters a tile in the row that is empty...
        if(spacesToFill[i].textContent === ""){
            //the tile looks a little different when a letter is in it. so well put the letter in a new p tag
            const testLetter = document.createElement("p")
            //for style
            testLetter.classList.add("testLetter")
            testLetter.setAttribute("id", letter)
            //set html with letter
            testLetter.textContent = letter
            //append the letter to the appropriate tile
            spacesToFill[i].append(testLetter)
            //gsap to animate letter tile in place
            gsap.to(testLetter, {opacity:1, ease: "bounce.out", delay:0})
            //add the new letter the the entered word
            enteredWord.push(letter)
            //break the loop so it only adds one letter at a time
            {break}           
        }else{
            //if there is already a letter in that spot the function will skip/not run
            {continue}   
        }
    }
}
//event listener to add custom evets to only the show keyboard tiles
document.addEventListener("keydown", (e)=>{
    //remove the word delete and replace it with backspace so .key will recognize it
    //on the keyboard it's delete, in the code it's backspace...
    alphabetArray.pop()
    alphabetArray.push("Backspace")
    //only the letters on our custom key board, so no numbers, backslashes, etc
    if(alphabetArray.indexOf(e.key[0].toUpperCase()) >= 0){
        //a-z
        if(e.key.length === 1){
            newLetterLoop(e.key.toUpperCase())
        //delete
        }else if (e.key === "Backspace"){
            deleteLoop()
        //eneter
        }else{
            checkWord()
        }
    }
})
//create the keyboard
handleArray(keyboardOneArray, keyboardRowOne)
handleArray(keyboardTwoArray, keyboardRowTwo)
handleArray(keyboardThreeArray, keyboardRowThree)
})