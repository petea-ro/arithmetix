import React, { Component } from 'react';

export default class ResultsPage extends Component {
	render() {
		var results = [];
		var countCorrect = 0;
		var countWrong = 0;
		this.props.history.forEach( (item, index) => 	{
			var className = "col-md-6 list-group-item list-group-item-"; 
			if(item.answer == item.result){
				className += 'success';
				countCorrect++;
			}
			else{
				className += 'danger';
				countWrong++;
			}

			var result = 
				<li className={className} key={index}>
					<span className="badge">{index+1}</span> 
					{item.expression}
					{item.answer != item.result ? 
						<span className="label label-success">{item.result}</span> : ''
					}
				</li>
			results.push(result);

		});
		return (
			<div className="container results">
				<h3 className="text-success">Total Points: {countCorrect} </h3>
				<h4 className=" text-danger">Wrong answers: {countWrong} </h4>
				<div className="clearfix"></div>
				<ul className="list-group">
					{results}
				</ul>
				<div className="text-center">
					<button className="btn btn-primary btn-big" onClick={this.props.onStartNewTest}>Start New Test</button>
				</div>
			</div>
		);
	}
}
