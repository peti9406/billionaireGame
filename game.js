import promptSync from 'prompt-sync';
import { questions, prizes } from './questions.js';
const prompt = promptSync({sigint: true});

const USEDQUESTIONS = [];
let CORRECT = 0;
let PLAYERNAME = '';
const HELPS = {
    phone: true,
    audience: true,
    computer: true,
};

function delay(time) {
    // eslint-disable-next-line no-promise-executor-return
    return new Promise((resolve) => setTimeout(resolve, time));
}

function welcome() {
    const welcomeText = `
    Welcome to the \x1b[32mBillionaire Game\x1b[0m! 🤑🎉
    
    Are you ready to test your knowledge and climb your way to the top? Here's how it works:
    
    - \x1b[32m10 Questions\x1b[0m: Answer 10 questions correctly to win the ultimate prize!
    - \x1b[32m4 Answer Options\x1b[0m: Each question has 4 possible answers, but only \x1b[31mONE\x1b[0m is correct.
    - \x1b[32m3 Lifelines to Help You\x1b[0m:
      \x1b[36m1. Phone a Friend 📞\x1b[0m – Get advice on the answer.
      \x1b[36m2. Ask the Audience 👥\x1b[0m – See what the audience thinks.
      \x1b[36m3. 50:50 ✂️\x1b[0m – Remove two incorrect options, leaving only two answers to choose from.
    
    Choose wisely, think carefully, and aim to become a \x1b[32mbillionaire\x1b[0m! Good luck! 💎
    You can write 'quit' anytime to exit the game.
    `;

    console.log(welcomeText);
}

function getName() {
    console.log('Welcome to the game! What is your name, contestant?');
    PLAYERNAME = `\x1b[36m${prompt()}\x1b[0m`;
    console.clear();
    console.log(`Well ${PLAYERNAME}!\nLet's get started on your journey to becoming a \x1b[32mbillionaire\x1b[0m! 💰`);
    console.log(`And remember, with each correct answer, you're one step closer to winning \x1b[32m${prizes[9]}\x1b[0m $! 💸`);
    return PLAYERNAME;
}

function getQuestion(questionArray) {
    if (USEDQUESTIONS.length === 10) {
        winGame();
        process.exit(0);
    }

    const questionNumber = Math.floor(Math.random() * questionArray.length);
    if (USEDQUESTIONS.includes(questionNumber)) {
        return getQuestion(questionArray);
    }

    USEDQUESTIONS.push(questionNumber);

    return questionNumber;
}

function showNextFlavour() {
    console.log(`
Alright, it's time for the next question! 🧐
Question number \x1b[36m${USEDQUESTIONS.length}\x1b[0m coming right up for \x1b[32m${prizes[USEDQUESTIONS.length - 1]}\x1b[0m! 💸
                
Get ready, ${PLAYERNAME}!`);
}

async function showAnswers(questionArray, questionIndex, answersArray) {
    showHelp(HELPS);
    await delay(1500);
    // eslint-disable-next-line prefer-template
    console.log('\x1b[36m' + questionArray[questionIndex].question + '\x1b[0m');

    for (let i = 0; i < answersArray.length; i++) {
        if (answersArray[0]['%'] === undefined) {
            console.log(`${Object.keys(answersArray[i])[0]}: ${Object.values(answersArray[i])[0]}`);
            await delay(1000);
        } else {
            console.log(`${Object.keys(answersArray[i])[0]}: ${Object.values(answersArray[i])[0]} ${Object.values(answersArray[i])[2]} %`);
        }
    }
}

function askInput() {
    console.log('What is your answer? (write A,B,C or D)');
    let input = prompt().toUpperCase();

    exitGame(input);

    while ((input === 'COMPUTER' && HELPS.computer === false) ||
    (input === 'PHONE' && HELPS.phone === false) || (input === 'AUDIENCE' && HELPS.audience === false)) {
        console.log(`You have already used the help of the ${input.toLowerCase()}!`);
        input = prompt().toUpperCase();
        exitGame(input);
    }

    while (input !== 'A' && input !== 'B' && input !== 'C' && input !== 'D'
        && input !== 'PHONE' && input !== 'COMPUTER' && input !== 'AUDIENCE') {
        console.log('That is not a valid answer! (write A,B,C or D)');
        input = prompt().toUpperCase();
        exitGame(input);
        while ((input === 'COMPUTER' && HELPS.computer === false) ||
        (input === 'PHONE' && HELPS.phone === false) || (input === 'AUDIENCE' && HELPS.audience === false)) {
            console.log(`You have already used the help of the ${input.toLowerCase()}!`);
            input = prompt().toUpperCase();
            exitGame(input);
        }
    }
    return input;
}

// eslint-disable-next-line consistent-return
function convertAnswer(input) {
    switch (input) {
    case 'A': {
        return 0;
    }
    case 'B': {
        return 1;
    }
    case 'C': {
        return 2;
    }
    case 'D': {
        return 3;
    }
    }
}

function validateAnswer(questionIndex, input) {
    if (questions[questionIndex].answer[input].boolean) {
        CORRECT += 1;
        return true;
    }
    return false;
}

function getMessageForAnswer(boolean) {
    if (boolean && USEDQUESTIONS.length === 10) {
        console.log(`
Congratulations, ${PLAYERNAME}!
You got the correct answer!`);
    } else if (boolean) {
        console.log(`
Congratulations, ${PLAYERNAME}!
You got the correct answer! You're one step closer to becoming a true \x1b[32mbillionaire\x1b[0m!
Ready for the next \x1b[33mchallenge\x1b[0m?`);
    } else {
        console.log(`
Oh no, ${PLAYERNAME}! 😱
            
That's not quite the right answer!
Unfortunately, your journey to becoming a \x1b[32mbillionaire\x1b[0m ends here... for now.
But don't worry, every \x1b[32mbillionaire\x1b[0m has a few setbacks on the way to success!
            
You gave it your best shot, and that's what matters most!
Thanks for playing, ${PLAYERNAME}!
You made it far, and who knows—maybe next time, you'll get all the answers right!
Your total prize: \x1b[32m${prizes[CORRECT - 1]}\x1b[0m $!
`);
        process.exit(0);
    }
}

function pressEnter() {
    let pressed = ' ';
    while (pressed !== '') {
        console.log('\nPress \x1b[31menter\x1b[0m to continue!');
        pressed = prompt('');
    }
}

function exitGame(input) {
    if (input === 'QUIT') {
        console.clear();
        console.log('Thank you for playing!\nQuitting game now...');
        return process.exit(0);
    }
}

function winGame() {
    console.log(`
        🎉 Congratulations, ${PLAYERNAME}! 🏆
        
        You did it! You've answered all the questions correctly and now you're officially a \x1b[32mBillionaire\x1b[0m! 💰💎
        Your total prize: \x1b[32m${prizes[prizes.length - 1]}\x1b[0m $! 😱
        
        What an incredible journey! Your knowledge and determination have paid off, and you've made it to the top! 🌟
        Now, you can enjoy the rewards of your hard work and get ready to start a new adventure—maybe even a new challenge awaits you! 🚀
        
        Well done, and thank you for playing the \x1b[32mBillionaire Game\x1b[0m! 🎉
        `);
}

function showHelp(obj) {
    const canUse = [];
    for (const [key, value] of Object.entries(obj)) {
        if (value === true) {
            canUse.push(key);
        }
    }
    if (Object.values(HELPS).includes(true)) {
        console.log(`You can still use helps: \x1b[33m${canUse}\x1b[0m
(write the name of the help as an answer)\n`);
    } else {
        console.log('You have no more helps.');
    }
}

function getCorrect(questionArray, questionIndex) {
    let correctAnswer = '';
    for (let i = 0; i < questionArray[questionIndex].answer.length; i++) {
        if (Object.values(questionArray[questionIndex].answer[i])[1]) {
            correctAnswer = (questionArray[questionIndex].answer[i]);
        }
    }
    return correctAnswer;
}

function getWrongs(questionArray, questionIndex) {
    const wrongs = [];
    for (let i = 0; i < questionArray[questionIndex].answer.length; i++) {
        if (!Object.values(questionArray[questionIndex].answer[i])[1]) {
            wrongs.push(questionArray[questionIndex].answer[i]);
        }
    }
    return wrongs;
}

function computer(questionArray, questionIndex) {
    console.log(`So ${PLAYERNAME}, you have decided to use the computer.`);
    HELPS.computer = false;
    const halvedQuestions = [];

    halvedQuestions.push(getCorrect(questionArray, questionIndex));
    halvedQuestions.push(getWrongs(questionArray, questionIndex)[Math.floor(Math.random() * 3)]);

    halvedQuestions.sort((a, b) => {
        const keyA = Object.keys(a)[0]; // Get first key of object a
        const keyB = Object.keys(b)[0]; // Get first key of object b
        return keyA.localeCompare(keyB); // Compare the keys alphabetically
    });
    return halvedQuestions;
}

function phone(questionArray, questionIndex) {
    HELPS.phone = false;
    let toPhone = '';

    const correctAnswer = getCorrect(questionArray, questionIndex);
    const wrongs = getWrongs(questionArray, questionIndex);

    console.log(`
Ah, ${PLAYERNAME}, feeling a little unsure, are we?
The pressure's getting to you! But fear not, you have a lifeline at your disposal.
The all-important phone call...

Tell me, who will you call for wisdom in this crucial moment?
A trusted friend? A so-called expert?
Or someone who barely knows what day it is but might get lucky?
Choose wisely... time is ticking!`);

    console.log(`
Write the number of your friend in the console.
1. The Skeptical Expert
2. The Overconfident Friend
3. The Nervous Wreck
4. The Condescending Scholar
5. The Chaotic Wildcard
    `);

    toPhone = prompt();

    while (toPhone !== '1' && toPhone !== '2' && toPhone !== '3' && toPhone !== '4' && toPhone !== '5') {
        console.log('Choose from 1,2,3,4 and 5');
        toPhone = prompt();
    }

    switch (toPhone) {
    case '1': {
        console.log(`
Hmm, ${PLAYERNAME}, I'm surprised you don't know this one.
I thought you were sharper than that!
Well, if I had to take a wild guess… maybe the letter '${Object.keys(correctAnswer)[0]}'`);
        break;
    }
    case '2': {
        console.log(`
Oh, come on, ${PLAYERNAME}, this is basic stuff!
I could answer this in my sleep. But fine, I'll help you out...
I'm like 90% sure the letter '${Object.keys(correctAnswer)[0]}'.`);
        break;
    }
    case '3': {
        console.log(`
Oh man, ${PLAYERNAME}, are you sure we should be trusting me on this?
I barely know what I had for breakfast!
Uh… okay, um, let's go with '${Object.keys(wrongs[Math.floor(Math.random() * 3)])[0]}'? Maybe?`);
        break;
    }
    case '4': {
        console.log(`
Ah, ${PLAYERNAME}, I expected better from you. This is elementary knowledge!
Still, I suppose not everyone can be as well-read as I am.
If you insist, I'd say the letter '${Object.keys(correctAnswer)[0]}' might be correct`);
        break;
    }
    case '5': {
        console.log(`
Pfft, ${PLAYERNAME}, you actually called me for this?
Wow. Alright, let's throw a dart at the board and say… '${Object.keys(wrongs[Math.floor(Math.random() * 3)])[0]}'?
Or wait… was it '${Object.keys(wrongs[Math.floor(Math.random() * 3)])[0]}'? Ah, just pick one, what's the worst that could happen?`);
        break;
    }
    }
}

function audience(questionArray, questionIndex) {
    HELPS.audience = false;
    const correctAnswer = getCorrect(questionArray, questionIndex);
    const wrongs = getWrongs(questionArray, questionIndex);

    console.log(`
Alright, ${PLAYERNAME}, you're putting your fate in the hands of the crowd!
Let's see if the wisdom of the masses can steer you to victory… or straight into disaster.

Ladies and gentlemen, our contestant needs your help!
Cast your votes and reveal what you believe is the right answer.
But beware, ${PLAYERNAME}—just because they're many doesn't mean they're right!`);

    correctAnswer['%'] = (Math.floor(Math.random() * (75 - 38)) + 38);
    let remainder = 100 - correctAnswer['%'];
    for (const option of wrongs) {
        option['%'] = (Math.ceil(Math.random() * remainder));
        remainder -= option['%'];
    }
    return questionArray[questionIndex].answer;
}

async function playLoop() {
    USEDQUESTIONS.splice(0, USEDQUESTIONS.length);
    CORRECT = 0;
    PLAYERNAME = '';
    let answer = 'x';

    console.clear();
    welcome();
    getName();
    pressEnter();
    console.clear();
    while (USEDQUESTIONS.length < 11) {
        const questionNum = getQuestion(questions);
        showNextFlavour();
        await showAnswers(questions, questionNum, questions[questionNum].answer);
        answer = askInput();
        if (answer === 'PHONE' && HELPS.phone) {
            phone(questions, questionNum);
            answer = askInput();
        }

        if (answer === 'COMPUTER' && HELPS.computer) {
            console.clear();
            showNextFlavour();
            await showAnswers(questions, questionNum, computer(questions, questionNum));
            answer = askInput();
        }

        if (answer === 'AUDIENCE' && HELPS.audience) {
            console.clear();
            showNextFlavour();
            await showAnswers(questions, questionNum, audience(questions, questionNum));
            answer = askInput();
        }

        answer = convertAnswer(answer);
        getMessageForAnswer(validateAnswer(questionNum, answer));
        pressEnter();
        console.clear();
    }
    winGame();
}

playLoop();
