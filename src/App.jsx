import React, { Component } from 'react';
import './App.css';
import WelcomePage from './WelcomePage';
import GamePage from './GamePage';
import ResultsPage from './ResultsPage';
import HistoryPage from './HistoryPage';

const OPERATIONS = ['+','-','x',':'];
const DIGITS = ['1','2','3','4','5','6','7','8','9'];
const PAGES={Welcome:'welcome', Game:'game', Results: 'results', History: 'history'}

class App extends Component {
  constructor(props){
    super(props);

    this.config={
      applicationName: 'Arithmetix',
    }

    this.state={
      activePage: PAGES.Welcome, //should be 'PAGES.Welcome',
      operations:[], //set of operations user has choosed
      numbers:[], //set of numbers user has choosed
      countQuestions: 10,
      totals: [],
      list:[],
    }
  }
  componentDidMount(){
    //restore session from local storage if available
    var current = localStorage.getItem('currentState');
    if(current){
      this.setState(JSON.parse(current));
    }
  }
  componentWillMount(){
    if(this.state.activePage === PAGES.Game){
      this.startTest();
    }
    if(this.state.activePage === PAGES.History){
      this.handleShowHistory();
    }
  }
  handleStartNewTest(){
    this.setState({
      activePage: PAGES.Welcome,
      totals:[],
      question: [], 
      list: [],
    });
  }
  handleClickOperation(e){
    var operation = e.target.value;
    var operations = this.state.operations;
    var operationPos = operations.indexOf(operation); 
    if(operationPos>=0){
      operations.splice(operationPos, 1); //remove it
    }
    else{
      operations.push(operation);
    }
    this.setState({
      operations: operations
    });  
  }
  handleClickDigit(e){
    var digit = e.target.value;
    var numbers = this.state.numbers;
    var digitPos = numbers.indexOf(digit); 
    if(digitPos>=0){
      numbers.splice(digitPos, 1); //remove it
    }
    else{
      numbers.push(digit);
    }
    this.setState({
      numbers: numbers
    });
  }
  handleClickStart(){
    var errors=[];
    if(this.state.operations.length===0){
      errors.push('Please select at least one operation');
    }
    if(this.state.numbers.length===0){
      errors.push('Please select at least one number');
    }
    if(errors.length > 0){
      this.setState({
        errors: errors
      })
    }
    else{
      this.nextQuestion();
    } 
  }
  startTest(){
    this.setState({
        'activePage': PAGES.Game,
    })
    this.nextQuestion();
  }
  nextQuestion(){

    //check if it was the last question
    if(this.state.totals.length >= this.state.countQuestions){
      this.setState({
        activePage: PAGES.Results
      })

      //remove current state from localStorage
      localStorage.removeItem('currentState');

      //save results in localStorage for history
      var history = JSON.parse(localStorage.getItem('history')) || [];
      history.push(this.state.totals);
      localStorage.setItem('history', JSON.stringify(history));

      //exit from this function
      return;
    }

    var question = this.generateQuestion();
    this.setState({
      activePage: PAGES.Game,
      question: question,
    });

    //save current state in localStorage
    localStorage.setItem('currentState', JSON.stringify(this.state)); 
  }
  generateQuestion(){
    var op = randomElement(this.state.operations);
    var n1 = parseInt(randomElement(this.state.numbers), 10);
    var n2 = randomInt(1, 11);      
    var result = 0;
    let n2init;
    if(op === '+'){
      result = n1+n2;
    }
    if(op === 'x'){
      result = n1*n2;
    }
    if(op === '-'){
      n2init = n2;
      result = n2;
      n2 = n1;
      n1 += n2init;
    }
    if(op === ':'){
      n2init = n2;
      result = n2;
      n2 = n1;
      n1 *= n2init;
    }
    var expression = n1+ ' ' + op + ' ' + n2 + ' =';
    //check for dublicates
    if(this.state.list.indexOf(expression) >=0){
      return this.generateQuestion();
    }
    else{
      this.state.list.push(expression); //add expression in list
    }

    var choices = this.generateChoices(result)
    var start = new Date()
    return {expression, result, choices, start} 
  }
  generateChoices(result, choices){
    if(!choices){
      choices = [result];
    }
    //generate a random choice in interval [result-5...result+5]
    var choice = result + randomInt(-5,5); 
    if(choice>=0 && choices.indexOf(choice) === -1){
      choices.push(choice);
    }

    if(choices.length>4){
      shuffle(choices); 
      return choices; 
    }
    return this.generateChoices(result, choices);
  }
  handleClickAnswer(e){
    var answer = e.target.value;
    var totals = this.state.totals;
    var question = this.state.question;
    var result = question.result;

    question.expression += ' ' + answer;
    question.answer = answer;
    question.result = result;
    question.end = new Date();
    
    totals.push(question);

    this.setState({
      question: question,
      totals: totals,
    })

    //show next page 
    setTimeout(this.nextQuestion.bind(this), 1000);

  }
  handleShowHistory(){
    var history = JSON.parse(localStorage.getItem('history')) || []; 
    this.setState({
      activePage: PAGES.History,
      history: history
    })
  }

  render() {
    var content = "";
    if(this.state.activePage === PAGES.Welcome){
      content = <WelcomePage 
                  allOperations={OPERATIONS}
                  allDigits={DIGITS}
                  operations={this.state.operations}
                  numbers={this.state.numbers}
                  errors={this.state.errors}
                  showHistory={localStorage.hasOwnProperty('history')}
                  onClickOperation={this.handleClickOperation.bind(this)} 
                  onClickDigit={this.handleClickDigit.bind(this)} 
                  onClickStart={this.handleClickStart.bind(this)} 
                  onShowHistory={this.handleShowHistory.bind(this)}
                />
    }
    if(this.state.activePage ===PAGES.Game){
      content = <GamePage 
                  countQuestions={this.state.countQuestions}
                  question={this.state.question}
                  questionNo={this.state.list.length}
                  onClickChoice={this.handleClickAnswer.bind(this)}
                />;
    }
    if(this.state.activePage === PAGES.Results){
      content = <ResultsPage 
                  totals={this.state.totals}
                  onStartNewTest={this.handleStartNewTest.bind(this)}
                />
    }
    if(this.state.activePage === PAGES.History){
      content = <HistoryPage 
                  history={this.state.history}
                  onStartNewTest={this.handleStartNewTest.bind(this)}
                />
    }
    return (
      <div>
        <header>
          <div className="container">
            <div className="title">
              {this.config.applicationName}
            </div>
          </div>
        </header>
          {content}
      </div>  
    )
  }
}

export default App;


/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
/**
* Returns a random element from an array
*/ 
function randomElement(items){
  return items[Math.floor(Math.random()*items.length)]
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}