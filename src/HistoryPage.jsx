import React, { Component } from 'react';

export default class HistoryPage extends Component {
	render() {
		var items = [];
		let start;
		this.props.history.forEach( (questions, testIndex) => {
			var points = 0;
			var seconds = 0;
			var liItems = [];
			let className, time
			questions.forEach( (question, index) => {
				if(index === 0){
					start = question.start;	
				}
				time = parseFloat(new Date(question.end) - new Date(question.start));
				seconds += time;
				if(question.answer == question.result){
					points++;
					className = "glyphicon glyphicon-ok text-success"						
				}
				else{
					className = "glyphicon glyphicon-remove text-danger"						
				}

				liItems.push(
					<li key={index}>
						<i className={className}></i>  &nbsp;
						{question.expression} 
						<small className="time">{(time/1000).toFixed(1)}s</small> 
					</li>
				);
			})
			seconds = (seconds / 1000).toFixed(1);
			var item = ( 
				<div className="panel panel-default" key={testIndex}>
					<div className="panel-heading" >
						<label className="label label-primary">{testIndex+1}</label> &nbsp;
						<b>{points} points</b>  <small>{seconds} seconds</small>
						<small className="badge pull-right">{new Date(start).toLocaleString()}</small>
					</div>
					<div className="panel-body">
						<ol >
							{liItems}
						</ol>
					</div>	
				</div>
			);
			items.push(item);

		});
		return (
			<div className="history">
				<div className="color-section">
					<div className="container">
						<h1>History Page</h1>
					</div>
				</div>
				<div className="container">
					<br/>
					<div>
						{items}
					</div>
					<div className="text-center">
						<button className="btn btn-primary btn-big" onClick={this.props.onStartNewTest.bind(this)}>Start New Test</button>
					</div>

				</div>

			</div>
		);
	}
}
