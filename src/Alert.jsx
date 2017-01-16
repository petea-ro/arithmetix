import React, { Component } from 'react';

export default class Alert extends Component {
	render() {
		if(this.props.messages && this.props.messages.length>0){
			var alert =  this.props.messages.map( (message, index) =>
				<div key={index}>{message}</div>
			)
			return (
				<div className={this.props.className}>
					{alert}
				</div>
			);	
		}
		return (null); //return empty string
	}
}
