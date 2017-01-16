import React, { Component } from 'react';
import './App.css';
import WelcomePage from './WelcomePage';
import GamePage from './GamePage';
import ResultsPage from './ResultsPage';

const OPERATIONS = ['+','-','x',':'];
const DIGITS = ['1','2','3','4','5','6','7','8','9'];

const HISTORY = [{"expression":"3 x 4 = 11","result":12,"choices":[10,15,12,7,14],"answer":"11"},{"expression":"6 - 1 = 5","result":5,"choices":[9,6,2,7,5],"answer":"5"},{"expression":"30 : 10 = 3","result":3,"choices":[6,7,4,0,3],"answer":"3"},{"expression":"3 - 1 = 1","result":2,"choices":[1,4,0,5,2],"answer":"1"},{"expression":"15 - 10 = 5","result":5,"choices":[3,4,6,1,5],"answer":"5"},{"expression":"20 : 4 = 5","result":5,"choices":[9,6,7,5,0],"answer":"5"},{"expression":"4 + 5 = 9","result":9,"choices":[6,8,5,10,9],"answer":"9"},{"expression":"9 - 7 = 2","result":2,"choices":[6,2,3,0,1],"answer":"2"},{"expression":"35 : 7 = 5","result":5,"choices":[6,5,4,2,8],"answer":"5"},{"expression":"2 : 2 = 1","result":1,"choices":[3,4,2,5,1],"answer":"1"}];


class App extends Component {
  constructor(props){
    super(props);
    this.config={
      applicationName: 'Arithmetix',
    }

    this.state={
      activePage: 'welcome', //should be 'welcome',
      operations:[], //set of operations user has choosed
      numbers:[], //set of numbers user has choosed
      countQuestions: 10,
      history: [],
      list:[]
    }
  }
  componentWillMount(){
    if(this.state.activePage === 'game'){
      this.startTest();
    }
  }
  handleStartNewTest(){
    this.setState({
      activePage: 'welcome',
      history:[],
      questionNo: 0,
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
        'activePage': 'game',
        'questionNo': 0,
    })
    this.nextQuestion();
  }
  nextQuestion(){
    var question = this.generateQuestion();
    var questionNo = this.state.questionNo || 0;
    console.log(question, history);
    this.setState({
      activePage: 'game',
      question: question,
      questionNo: questionNo+1,
    })    
  }
  generateQuestion(){
    var op = randomElement(this.state.operations);
    var n1 = parseInt(randomElement(this.state.numbers), 10);
    var n2 = randomInt(1, 11);      
    var result = 0;
    if(op === '+'){
      result = n1+n2;
    }
    if(op === 'x'){
      result = n1*n2;
    }
    if(op === '-'){
      var n2init = n2;
      result = n2;
      n2 = n1;
      n1 = n1+n2init;
    }
    if(op === ':'){
      var n2init = n2;
      result = n2;
      n2 = n1;
      n1 = n1*n2init;
    }
    var expression = n1+ ' ' + op + ' ' + n2 + ' =';
    //check for dublicates
    if(this.state.list.indexOf(expression) >=0){
      return this.generateQuestion();
    }
    else{
      this.state.list.push(expression); //add expression in list
    }

    var choices = this.generateChoices(result);
    return {expression, result, choices} 
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
    var history = this.state.history;
    var question = this.state.question;
    var result = question.result;

    question.expression += ' ' + answer;
    question.answer = answer;
    question.result = result;
    
    history.push(question);

    this.setState({
      question: question,
      history: history,
    })

    //check if it's  the last question
    if(history.length >= this.state.countQuestions){
      this.setState({
        activePage: 'results'
      })
      //exit from this function
      return;
    }

    //show next page 
    setTimeout(this.nextQuestion.bind(this), 1000);

  }
  render() {
    var content = "";
    if(this.state.activePage === 'welcome'){
      content=<WelcomePage 
                allOperations={OPERATIONS}
                allDigits={DIGITS}
                operations={this.state.operations}
                numbers={this.state.numbers}
                errors={this.state.errors}
                onClickOperation={this.handleClickOperation.bind(this)} 
                onClickDigit={this.handleClickDigit.bind(this)} 
                onClickStart={this.handleClickStart.bind(this)} 
              />
    }
    if(this.state.activePage ==='game'){
      content = <GamePage 
                    countQuestions={this.state.countQuestions}
                    questionNo={this.state.questionNo}
                    question={this.state.question}
                    onClickChoice={this.handleClickAnswer.bind(this)}
                />;
    }
    if(this.state.activePage === 'results'){
      content = <ResultsPage 
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