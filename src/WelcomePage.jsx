import React, { Component } from 'react';
import Alert from './Alert'

export default class WelcomeScreen extends Component {
	render() {
		var operationButtons = this.props.allOperations.map( (op) => 
			<CButton onClick={this.props.onClickOperation.bind(this)} key={op} value={op} activeElements={this.props.operations}/>
		)
		var digitButtons = this.props.allDigits.map( (op) => 
			<CButton onClick={this.props.onClickDigit.bind(this)} key={op} value={op} activeElements={this.props.numbers}/>
		)
		return (
			<div className="welcome">
				<div className="color-section">
					<div className="container">
						<p className="intro-description">
							This Game will help you to learn and test your arithmetic skills
						</p>
					</div>
				</div>
				<h2>Choose operations you want to learn and test</h2>
					<div className="btn-group">
						{operationButtons}
					</div>
					<h2>Choose Numbers Set</h2>
					<p>At least one term/factor will be used from selected number(s)</p>
					<div className="btn-group digit-group">
						{digitButtons}
					</div>
				<div className="container">
					<hr/>
					<Alert className="alert alert-warning" messages={this.props.errors}/>			
					<button 
						className="btn btn-primary btn-big" 
						onClick={this.props.onClickStart.bind(this)}
					>
						Start Test
					</button>
				</div>
			</div>
		);
	}
}

class CButton extends Component{
	render(){
		var className=this.props.activeElements.indexOf(this.props.value)>=0 ? ' active': ''
		return(
			<button 
				type="button" 
				className={"btn btn-choose btn-primary"+className}
				onClick={this.props.onClick.bind(this)}
				value={this.props.value}
			>
				{this.props.value}
			</button>
		)
	}
}

