const h1 = document.querySelector('h1');

// MAIN OUTOUT DIV
const output = document.querySelector('.output');

// OUTPUT SETTINGS SELECTOR DIV
const settingsText = genElement(output, 'div', 'Please choose your game options:');
settingsText.classList.add('settingsText');

// SETTINGS BUTTONS IN OUTPUT
const settingsSelectDiv = genElement(output, 'div', '# Questions :');
settingsSelectDiv.classList.add('settingsSelectDiv');

// QUESTION # INPUT, APPEND TO ABOVE DIV
const inputVal = document.querySelector('.questionVal');
inputVal.setAttribute('type', 'number');
inputVal.setAttribute('max', 50);
inputVal.setAttribute('min', 1);
inputVal.value = 10;
settingsSelectDiv.append(inputVal);

// QUESTION FILTERS
const selectCat = genElement(settingsSelectDiv, 'select', '');
const selectDif = genElement(settingsSelectDiv, 'select', '');

// START BUTTON
const startBtn = document.querySelector('.startBtn');
startBtn.classList.add('startBtn');
settingsSelectDiv.append(startBtn);

// Elements in settings div in order are: text, input, select, select, start button

const baseURL = 'https://opentdb.com/api.php?';
const game = {
    que: [],
    question: 0,
    eles: [],
    score: 0
};

const categories = [
{
    "title" : "General", 
    "num" : 9
},
{
    "title" : "Entertainment: Music", 
    "num" : 12
},
{
    "title" : "Science & Nature", 
    "num" : 17
},
{
    "title" : "Mythology", 
    "num" : 20
},
{
    "title" : "Geography", 
    "num" : 22
},
{
    "title" : "Animals", 
    "num" : 27
}];

// CASE SENSITIVE, PART OF URL
const difficulty = ['easy', 'medium', 'hard'];

window.addEventListener('DOMContentLoaded', (e) => {
    // console.log('DOM Ready');
    genSelections();
})

// FOR EASE OF GENERATING AND APPENDING NEW DOM ELEMENTS
function genElement(parent, eleType, html){
    const temp = document.createElement(eleType);
    temp.innerHTML = html;
    parent.append(temp);
    return temp;
}

function genSelections() {
    categories.forEach((cat) => {
        const optEle = genElement(selectCat, 'option', cat.title);
        optEle.value = cat.num;
    })

    difficulty.forEach((d) => {
        const optEle = genElement(selectDif, 'option', d);
        optEle.value = d;
    })
}

startBtn.addEventListener('click', (e) => {
    let tempURL = `${baseURL}amount=${inputVal.value}&difficulty=${selectDif.value}&category=${selectCat.value}`;
    popPage(tempURL);
    initGameStyle();
})

function initGameStyle(){
    output.classList.add('active');
    settingsSelectDiv.classList.add('hidden');
    settingsText.classList.add('hidden');
}

function popPage(url){
    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        game.que = data.results;
        outputPage();
    })
    .catch((err) => {
        console.log(err);
    })
}

function outputPage(){
    h1.innerHTML = `Question ${game.question} of ${game.que.length} <br>Score: ${game.score}`;

    if(game.question >= game.que.length){
        output.innerHTML = `<div class="finalMessage">Your final score was ${game.score} out of ${game.que.length}!</div>`;
        const replayBtn = genElement(output, 'button', 'Play Again?');
        replayBtn.classList.add('replayBtn');
        replayBtn.addEventListener('click', (e) => {
            window.location.reload();
        })
        settingsSelectDiv.classList.remove('hidden');
        game.score = 0;
        game.question = 0;

    } else {
        output.innerHTML = '';
        let question = (game.que[game.question]);
        game.question++;

        // MAIN QUIZ DIV, APPENDED TO OUTPUT
        const mainDiv = genElement(output, 'div', '');

        // QUESTION DIV
        const que1 = genElement(mainDiv, 'div', question.question);
        que1.classList.add('question');
        game.eles.length = 0;
        const optsDiv = genElement(output, 'div', '');
        optsDiv.classList.add('optsDiv');
        
        // WILL SHOW CORRECT/INCORRECT MESSAGE DIV
        resultsDiv = genElement(output, 'div', '');
        resultsDiv.classList.add('hidden');

        // NEXT BUTTON DIV
        nextDiv = genElement(output, 'div', '');
        nextDiv.classList.add('hidden');
        nextDiv.classList.add('nextDiv');

        let answers = genAnswers(question); //returns randomized answers
        answers.forEach(opt => {
            const opt1 = genElement(optsDiv, 'button', opt);
            opt1.classList.add('optionButtons');
            game.eles.push(opt1);

            if(opt == question.correct_answer){
                opt1.bgC = 'rgb(75, 128, 75)';

            } else {
                opt1.bgC = 'rgb(233, 109, 109)'
            }

            opt1.addEventListener('click', (e) => {
                game.eles.forEach((btnv) => {
                    btnv.disabled = true;
                    btnv.style.backgroundColor = btnv.bgC;
                })
                resultsDiv.classList.remove('hidden');
                const message = genElement(resultsDiv, 'div', '');
                message.classList.add('message');

                if(opt == question.correct_answer){
                    game.score++;
                    message.textContent = `Correct!`
                } else {
                    message.textContent = `Wrong! The answer was ${question.correct_answer}.`
                }

                nextDiv.classList.remove('hidden');
                nextQue(nextDiv);
            });
        });
    }
}

function genAnswers(question){
    let answers = question.incorrect_answers;

    let randomIndex = Math.floor(Math.random() * (answers.length + 1));
    answers.splice(randomIndex, 0, question.correct_answer);

    return answers;
}

function nextQue(parent){
    const nextBtn = genElement(parent, 'button', 'Next Question');
    nextBtn.classList.add('nextBtn');
    nextBtn.addEventListener('click', outputPage);
}