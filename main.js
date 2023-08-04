document.addEventListener('DOMContentLoaded', ()=>{

//Game container, board, keyboard, and keyboard rows are gotten from html
const gameBoard = document.getElementById("gameboard");
const keyboardRowOne = document.getElementById("keyboardRowOne");
const keyboardRowTwo = document.getElementById("keyboardRowTwo");
const keyboardRowThree = document.getElementById("keyboardRowThree");
const dialogeBox = document.getElementById("dialogeBox")
//keeps track of the row a user is on
let currentRow="first"
//the random word the user i trying to find is gererated with an async function
let randomWord
//keeps track of the word being entered by the user
let enteredWord =[]

//Set up the game board by creating 30 divs that are arranged with css into six rows of five
for(let i = 0; i<30; i++){
    const letterDiv = document.createElement("div")
    letterDiv.setAttribute("class","letterDiv")
    letterDiv.setAttribute("data-letter",false)
    gameBoard.append(letterDiv)
}
//Letters for key board rows
const keyboardOneArray = ["Q","W","E","R","T","Y","U","I","O","P"]
const keyboardTwoArray = ["A","S","D","F","G","H","J","K","L"]
const keyboardThreeArray = ["ENTER","Z","X","C","V","B","N","M","DELETE"]
const alphabetArray = keyboardOneArray.concat(keyboardTwoArray, keyboardThreeArray)

//when a key is pressed or clicked it pops up on the board
function newLetterEntered(letter){
    if(currentRow === "first"){
        newLetterLoop(letter,0,4)
    }else if(currentRow === "second"){
        newLetterLoop(letter,5,9)
    }else if(currentRow === "third"){
        newLetterLoop(letter,10,14)
    }else if(currentRow === "fourth"){
        newLetterLoop(letter,15,19)
    }else if(currentRow === "fifth"){
        newLetterLoop(letter,20,24)
    }else if(currentRow === "sixth"){
        newLetterLoop(letter,25,29)
    }
}

//function to delete letters
function deleteLetter(){
    if(currentRow === "first"){
        deleteLoop(4,0)
    }else if(currentRow === "second"){
        deleteLoop(9,5)
    }else if(currentRow === "third"){
        deleteLoop(14,10)
    }else if(currentRow === "fourth"){
        deleteLoop(19,15)
    }else if(currentRow === "fifth"){
        deleteLoop(24,20)
    }else if(currentRow === "sixth"){
        deleteLoop(29,25)
    }
}

//function to submit new word 
async function enterWord(){
    if(enteredWord.length === 5){
        try{ 
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${enteredWord.join("")}`)
            const result = await res.json()
            checkWord(result)
        }catch(error){
            console.log(error)
        }
    }else{
        dialogeBox.textContent = "That word is too short!"
        gsap.to(dialogeBox, {display:"block", repeat:1, yoyo:true})
    }
}

function checkWord(data){
    //if the word exist
    if(data[0]){ 
        //this function checks the row the user is on, switches to the next row and calls the enter loop with the indexes of the appropriate row to check the word entered.
        let winCount
        if(currentRow === "first"){
            currentRow = "second"
            winCount = enterLoop(0,4)
            dialogeBox.textContent = "Wow! Did you cheat? Good Job!"
        }else if(currentRow === "second"){
            currentRow = "third"
            winCount = enterLoop(5,9)
            dialogeBox.textContent = "Super smart or super lucky? Who cares! Great Job!"
        }else if(currentRow === "third"){
            currentRow = "fourth"
            winCount = enterLoop(10,14)
            dialogeBox.textContent = "Awesome! Good Job!"
        }else if(currentRow === "fourth"){
            currentRow = "fifth"
            winCount = enterLoop(15,19)
            dialogeBox.textContent = "Well Done!"
        }else if(currentRow === "fifth"){
            currentRow = "sixth"
            dialogeBox.textContent = "Better late than never!"
            winCount = enterLoop(20,24)
        }else if(currentRow === "sixth"){
            winCount = enterLoop(25,29)
            if(winCount === 5){
                dialogeBox.textContent = "Really made me hold my breath..."
            }else{
                dialogeBox.textContent = randomWord
                gsap.to(dialogeBox, {display:"block"})
            }    
        }
        //resets the entered word
            enteredWord = []
        if(winCount === 5){
            gsap.to(dialogeBox, {display:"block"})
        }
    }else{
        dialogeBox.textContent = "That's not a word!"
        gsap.to(dialogeBox, {display:"block", repeat:1, yoyo:true})
    }
}


//Creates each row of the keyboard from the keyboard array ad assigns an even listener to each letter/ enter and delete
function handleArray(array, keyBoardRow){
     for(let i = 0; i<array.length; i++){
        //a p tag is created for each letter in the array
        const keyDiv = document.createElement("p")
        //letters get on class and enter and delete get another for styling purposes
        array[i].length <= 1 ? keyDiv.setAttribute("class","keyDiv") : keyDiv.setAttribute("class","wordDiv")
        // the letter is assigned to the tile in a few different ways included the html text
        keyDiv.setAttribute("letter", array[i])
        keyDiv.setAttribute("data-key", array[i])
        keyDiv.textContent=array[i]
        //the tile is appended to the appropriate keyboard row
        keyBoardRow.append(keyDiv)
        //event listeners added based on whether the tile is a letter, delete, or enter
        if(array[i].length === 1){
            keyDiv.addEventListener("click", ()=>newLetterEntered(array[i])) 
        }else if(array[i].length === 5){
            keyDiv.addEventListener("click", ()=>enterWord()) 
        }else if(array[i] === "DELETE"){
            keyDiv.addEventListener("click", deleteLetter)
        } 
    }
}


//Enter, Delete and NewLetter Loops

//enter loop will be run on each/the approprite gameboard row. The appropriate row will be determined by the indexes passed to the function. The function will recieve the index of the first letter's tile on the gmeboard and the index of the last letter's tile on the gameboard.
function enterLoop(iEquals,iLessThan){
    console.log("is this running?")
    //gsap timeline to ensure animation happens one letter at a time.
    const tl = gsap.timeline()
    //this will keep track of the number of times a letter appears in the random word...
    let winner = 0
    for(let i = iEquals; i<=iLessThan; i++){

        let position = i === 0|| i === 5||i === 10||i === 15||i === 20||i === 25 ? 0 
        :i === 1|| i === 6||i === 11||i === 16||i === 21||i === 26 ? 1
        :i === 2|| i === 7||i === 12||i === 17||i === 22||i === 27 ? 2 
        :i === 3|| i === 8||i === 13||i === 18||i === 23||i === 28 ? 3 
        :4
        const letterTile = gameBoard.children[i]
        const letter = letterTile.textContent
        // the keyboardplace will chage depending on the row on the keyboard where the letter is found
        let keyboardPlace
        // the keyboardplace will chage depending on the row on the keyboard where the letter is found
        let keyboardRow
        //first row
        if(keyboardOneArray.indexOf(letter)>=0){
            keyboardRow = document.getElementById("keyboardRowOne")
            keyboardPlace = keyboardOneArray.indexOf(letter)
        //second row
        }else if(keyboardTwoArray.indexOf(letter)>=0){
            keyboardRow = document.getElementById("keyboardRowTwo")
            keyboardPlace = keyboardTwoArray.indexOf(letter)
        //third row
        }else if(keyboardThreeArray.indexOf(letter)>=0){
            keyboardRow = document.getElementById("keyboardRowThree")
            keyboardPlace = keyboardThreeArray.indexOf(letter)
        }

        let keyboardTile = keyboardRow.children[keyboardPlace]
        let positionArray = keyboardTile.getAttribute("position")&&keyboardTile.getAttribute("position").split("")
        if(keyboardTile.getAttribute("chosenLetter") === null){
           color = "grey" 
        }else{
            if(positionArray.indexOf(position.toString())<0){
                color = "#c3c311" 
            }else{
                color = "#69b969"
                winner ++
            } 
        }
        //gameboard tile
        tl.to(letterTile, {backgroundColor:color, duration:.75})
        //keyboard tile
        tl.to(keyboardRow.children[keyboardPlace], {backgroundColor:color, duration:.75}, "<")      
    }
    return winner
}
//delete loop will run backwards on each/the approprite gameboard row. The appropriate row will be determined by the indexes passed to the function. The function will recieve the index of the first letter's tile on the gmeboard and the index of the last letter's tile on the gameboard.
function deleteLoop(iequals, igreaterThan){
    for(let i = iequals; i>= igreaterThan; i--){
        // for the row the user is on, if the loop ecounters a gameboard tile that has a letter in it...
        if(gameBoard.children[i].textContent !== ""){
            //the letter will be replaced with a "" which is o say to the user the letter will be deleted.
             const callback = ()=> gameBoard.children[i].textContent = ""
             //gsap will hide the game tile and clear the letter
             gsap.to(gameBoard.children[i], {opacity:1, ease: "bounce.out", onComplete: callback()})
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
//newLetter loop will run  on each/the approprite gameboard row. The appropriate row will be determined by the indexes passed to the function. The function will recieve the index of the first letter's tile on the gmeboard and the index of the last letter's tile on the gameboard.
function newLetterLoop(letter, iEquals, iLessThan){
    for(let i = iEquals; i<=iLessThan; i++){
        //if the loop encounters a tile in the row that is empty...
        if(gameBoard.children[i].textContent === ""){
            //the tile looks a little different when a letter is in it. so well pu the letter in a new p tag
            const testLetter = document.createElement("p")
            //for style
            testLetter.classList.add("testLetter")
            testLetter.setAttribute("id", letter)
            //set html with letter
            testLetter.textContent = letter
            //append the letter to the appropriate tile
            gameBoard.children[i].append(testLetter)
            //gsap to animate letter tile in place
            gsap.to(testLetter, {opacity:1, ease: "bounce.out"})
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
    alphabetArray.pop()
    alphabetArray.push("Backspace")
    //only the letters on our custom key board, so no letters, bacslashes, etc
    if(alphabetArray.indexOf(e.key[0].toUpperCase()) >= 0){
        //a-z
        if(e.key.length === 1){
            newLetterEntered(e.key.toUpperCase())
        //delete
        }else if (e.key === "Backspace"){
            deleteLetter()
        //eneter
        }else{
            enterWord()
        }
    }
})

//create the keyboard
handleArray(keyboardOneArray, keyboardRowOne)
handleArray(keyboardTwoArray, keyboardRowTwo)
handleArray(keyboardThreeArray, keyboardRowThree)

//gets and sets the random word
//this is not working properly....
function setWord(data){
    console.log(data)
    randomWord = data[0]
    let previousLetter = []
    let randomWordArray = randomWord.split("")
    for(let i = 0; i < 5; i++){
        let row
        let array
        let positionArray=[]
        let currentLetter = randomWordArray[i]
        let countArray = randomWordArray.filter((letter, index)=> {
            if(letter === currentLetter){
                positionArray.push(index)
                return letter
            }
        })
        let key = previousLetter.indexOf(currentLetter)
        if(keyboardOneArray.indexOf(currentLetter.toUpperCase())>=0){
            row = document.getElementById("keyboardRowOne")
            array = keyboardOneArray
        }else if(keyboardTwoArray.indexOf(currentLetter.toUpperCase())>=0){
            row = document.getElementById("keyboardRowTwo")
            array = keyboardTwoArray
        }else if(keyboardThreeArray.indexOf(currentLetter.toUpperCase())>=0){
            row = document.getElementById("keyboardRowThree")
            array = keyboardThreeArray
        } 
        row.children[array.indexOf(currentLetter.toUpperCase())].setAttribute("chosenLetter", key)  
        row.children[array.indexOf(currentLetter.toUpperCase())].setAttribute("position", positionArray)  
        previousLetter.indexOf(currentLetter)<0 && previousLetter.push(currentLetter)
    }
}

function randomWordGenerator(){
   fetch('https://random-word-api.herokuapp.com/word?length=5')
   .then(response=>response.json())
   .then(data=>setWord(data))
}
randomWordGenerator()
})





//Working on the flip, not working right now...
         //WIP
    //     gsap.set(".testLetter", {
    //         transformStyle: "preserve-3d",
    //         transformPerspective: 1000
    //     });
    //     gsap.set(".letterTile", {
    //         transformStyle: "preserve-3d",
    //         transformOrigin: "50% 50%",
    //     });
    //     gsap.set(".letterTileBack", {
    //         rotationY: 180, rotationZ: 180, opacity:1
    //     });
        
        // function flip(){
        //     for(let i = 0; i<5; i++){
        //         let position = i === 0  ? "firstPosition" : i === 1 ? "secondPosition": i === 2  ? "thirdPosition": i === 3  ? "fourthPosition" :"fifthPosition"
        //         if(randomWord.indexOf(enteredWord[i]>=0)){
        //             if(randomWord.indexOf(enteredWord[i]) === i){
        //                 gsap.set( `${position}Back`, {backgroundColor:"green"})
        //             }else{
        //                 gsap.set( `${position}Back`, {backgroundColor:"yellow"})
        //             }
        //         }else{
        //             gsap.set(`${position}Back`, {backgroundColor:"grey"})
        //         }
        //         gsap.to( `${position}Front`, { rotationX: "+=180", duration: 1 });
        //         gsap.to( `${position}Back`, { rotationX: "+=180", duration: 1 }, 0);
        //         gsap.to( `${position}`, { z: 50, duration: 1/2, yoyo: true, repeat: 1 }, 0);
        //     }
        // }