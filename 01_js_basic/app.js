let questions = {
    numberQuestion : 0,
    countTry: 0,
    try: 5,
    countHints: 0,
    questions:[
        {
            number: 1,
            text: 'Висит груша нельзя скушать',
            answer: 'Лампочка',
            hints : ['Теплая','Стеклянная']
        },
        {
            number: 2,
            text: 'Что если поставить, будет лежать.',
            answer: 'Посуда',
            hints : ['Стеклянная','Из нее можно есть']
        },        
        {
            number: 1,
            text: 'Висит груша нельзя скушать',
            answer: 'Лампочка',
            hints : ['Теплая','Стеклянная']
        }
    ]
}

function resettrycount(){
    // trycount=0;
}

window.onload = function(){
    questions.numberQuestion = Math.floor(Math.random()*10%3);
    console.log(questions.questions);
    document.getElementById('question').innerHTML= questions.questions[questions.numberQuestion].text;
    document.getElementById('counter').innerText=questions.try - questions.countTry >0 ? questions.try - questions.countTry : 0;
}

function reset(){
    questions.numberQuestion = Math.floor(Math.random()*10%3);
    console.log(questions.questions);
    document.getElementById('question').innerHTML= questions.questions[questions.numberQuestion].text;
    document.getElementById('answer').value='';
    document.getElementById('counter').innerHTML = questions.try - questions.countTry >0 ? questions.try - questions.countTry : 0;
}

function getInputValue(){
    let input = document.getElementById('answer').value;
    if(questions.questions[questions.numberQuestion].answer === input)
        document.getElementById('answer').value = 'Правильный ответ';
    else { 
        questions.countTry++;
        document.getElementById('counter').innerHTML= questions.try - questions.countTry >0 ? questions.try - questions.countTry : 0;
        console.log(questions.countTry);
        document.getElementById('answer').value = 'Ошибка';
    }
}
function getHint(){   
    let numberHint = Math.floor(Math.random()*10%(questions.questions[questions.numberQuestion].hints.length));
    console.log(numberHint)
    let hint = questions.questions[questions.numberQuestion].hints[numberHint];
    console.log(hint)
    document.getElementById('answer').value = hint;
}

function checkAnswer(number){
    document.getElementById
}