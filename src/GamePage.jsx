import React, { Component } from 'react';

export default class GamePage extends Component {
	handleClickChoice(e){
		e.target.blur();  //remove focus from button
		this.props.onClickChoice(e);
	}
	render() {
		var choices = null;
		if(!this.props.question.answer){
			choices = this.props.question.choices.map( (choice, index) =>
				<button 
					className="btn btn-lg btn-warning" 
					key={index} 
					value={choice}
					onClick={this.handleClickChoice.bind(this)}
				>
					{choice}
				</button>
			);
		}
		return (
			<div className="container game">
				<div className="row">
					<div className="col-sm-8">
						<h2>
							Question <strong>#{this.props.questionNo} </strong> 
							of {this.props.countQuestions} <span className="hidden-xs">in total</span>
						</h2>
						<div>
							<span className="label label-primary">
								{this.props.question.expression}
							</span>
						</div>
						<div className="choices">
							{choices}
						</div>
					</div>
				</div>	
			</div>
		);
	}
}
