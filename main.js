// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submit = document.querySelector('.submit');
let res = document.querySelector(".result");
let bulletsContainer = document.querySelector(".bullets") ;
let countdownContainer = document.querySelector(".countdown");

// Set Options
let currentIndex = 0 ;
let countRightAnswers = 0 ;
let countdownInterval ;
// Fetch Questions From JSON File
function getQuestions () {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            let QuestionsObj = JSON.parse(this.responseText);
            // console.log(QuestionsObj);
            let qLen = QuestionsObj.length ;
            // console.log(QuestionsLen);

            // Create Bullets
            createBullets (qLen) ;

            // Add Questions Data
            addQuestionsData(QuestionsObj[currentIndex] , qLen);
            
            // Count down
            countdown(5 , qLen);

            // Check submit
            submit.onclick = () => {
                // Get Right Answer
                let theRightAnswer = QuestionsObj[currentIndex].right_answer ;
                // console.log(theRightAnswer);

                // increase current Index
                currentIndex++;

                // Check The Right Answer
                checkAnswer(theRightAnswer , qLen) ;

                // Remove Previos Questions
                quizArea.innerHTML = '' ;
                answersArea.innerHTML = '' ;

                // Add Next Questions And Answers
                addQuestionsData(QuestionsObj[currentIndex] , qLen);

                // Handle Bullets
                handleBullets();

                //  Clear interval
                clearInterval(countdownInterval);

                // Count down
                countdown(5 , qLen);
                // Show Result
                showResualt(qLen);

            }
        }
    };
    myRequest.open("GET","Guizs-And-Answers.json",true);
    myRequest.send();
}

getQuestions ();

// Fetcj Number Of Questions

function createBullets (num) {
    countSpan.innerHTML = num ;

    // Create Spans
    for(let i = 0 ; i < 9 ; i++) {
        // Create span
        let Bullet = document.createElement("span");

        // Check First Span
        if(i == 0) {
            Bullet.className = "on" ;
        } 

        // Append Chield
        bulletsSpanContainer.appendChild(Bullet);
    }
}

// Function Add Questions

function addQuestionsData(obj , count) {
    if(currentIndex < count )
    {
        // create H2 Questions
        let HeadingQuestion = document.createElement("h2");

        // Create Questions Text
        let questionText = document.createTextNode(obj.title);

        // append Text To H2
        HeadingQuestion.appendChild(questionText);

        // append H2 To Questions Area
        quizArea.appendChild(HeadingQuestion);

        // Create Answers
        for(let i = 1 ; i <= 4 ; i++) {

            // Create Main Answer Div
            let mainDiv = document.createElement('div');

            // Add Class To The Main Div
            mainDiv.className = 'answer' ;

            // create Radio Input
            let radioInput = document.createElement('input');

            // Add Type + Name + id + Data Attribute
            radioInput.name = 'questions' ;
            radioInput.type = 'radio' ;
            radioInput.id = `answer-${i}` ;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // First Input Checked
            if( i === 1) {
                radioInput.checked = true ;
            }
            // Create Label
            let theLabel = document.createElement("label");
            // Add Attribute For
            theLabel.htmlFor = `answer-${i}` ;

            // Create Label Text
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);

            // append Text To The Label
            theLabel.appendChild(theLabelText);

            // Add Input + Label To The Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            // append Main Div To The Answers Div
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer (rigthAnswer , count) {
    
    // Select All Answers
    let Answers = document.getElementsByName("questions") ;

    // Choosen One Answer
    let theChoosenAnswer ;

    // Select The Choosen Answer
    for(let i = 0 ; i < Answers.length ; i++) {
        if(Answers[i].checked) {
            theChoosenAnswer = Answers[i].dataset.answer ;
        }
    }
    
    // Checked The Right Answer
    if(theChoosenAnswer === rigthAnswer) {
        countRightAnswers++ ;
    }
}

function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arraySpans = Array.from(bulletsSpans) ;
    arraySpans.forEach((span , index) => {
        if(currentIndex === index ) {
            span.className = 'on' ;
        }
    });
}

// Function Result
function showResualt(count) {

    let theResualt ;
    if(currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submit.remove();
        bulletsContainer.remove();
        
        if(countRightAnswers >= (count/2) && countRightAnswers < (count)) {
            res.innerHTML =`<span class="good"> good :) </span> Your Resualt is ${countRightAnswers} From ${count}` ;
        } else if (countRightAnswers === count) {
            res.innerHTML = `<span class="Perfect"> Perfect :) </span> Your Resualt is ${count} From ${count}` ;
        } else {
            res.innerHTML = `<span class="bad"> bad :( </span> Your Resualt is ${countRightAnswers} From ${count}` ;
        }
    }
}

function countdown(duration , count) {
    if(currentIndex < count) {
        let minute , second ;
        countdownInterval = setInterval(function () {
            minute = parseInt(duration / 60 ) ;
            second = parseInt(duration % 60 ) ;
            countdownContainer.innerHTML = `${minute}:${second}`;
            if(minute < 10 ) {
                minute = `0${minute}`;
            }
            if(second < 10) {
                second = `0${second}`;
            }
            if(--duration < 0) {
                clearInterval(countdownInterval);
                submit.click() ;
            }
        },1000)
    }
}