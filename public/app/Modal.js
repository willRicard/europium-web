import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Leaderboard from './Leaderboard';

class Modal extends Component {
    getPropTypes() {
        return {
            onPick: PropTypes.function.isRequired,
            onAnswer: PropTypes.function.isRequired,
            isOpen: PropTypes.boolean,
            question: PropTypes.object,
            results: PropTypes.array
        };
    }
    constructor(props) {
        super(props);
        this.state = {
			categories: {
            	'Europe':                                {color: '#f3540d'},
	            'Great Scientists':                      {color: '#ff0000'},
	            'Real Scientist Jobs':                   {color: '#0070c0'},
	            'Periodic Elements':                     {color: '#7030a0'},
	            'Physical and Chemical Quantities':      {color: '#996633'},
	            'Scientific Objects':                    {color: '#00b050'}
        	},
			answer: ''
		};
        this.handlePick = this.handlePick.bind(this);
		this.handleChange = this.handleChange.bind(this);
        this.handleAnswer = this.handleAnswer.bind(this);
    }
    handlePick(e) {
        this.props.onPick(e.target.innerText);
    }
	handleChange(e) {
		this.setState({answer: e.target.value});
	}
    handleAnswer(e) {
		if (this.props.question.choices) {
	        this.props.onAnswer(e.target.innerText);
		} else { //Prevent page reload because of the form submit
			e.preventDefault();
			this.props.onAnswer(this.state.answer);
		}
    }
    render() {
		var child;
        if (this.props.isOpen) {
            if (this.props.results) {
                child = <Leaderboard results={this.props.results} />;
            } else if (!this.props.question) {//No question supplied: pick a category
                var categories = [];
                for (var name in this.state.categories) {
                    var c = this.state.categories[name];
                    categories.push(
                        <a className="category" onClick={this.handlePick} key={name} style={{color: c.color}}>{name}</a>
                    );
                }
			    child = (
                    <div>
		                <span id="your-turn">It&apos;s your turn!</span><br/>
		                <span id="please-pick">Please pick a category</span>
		                <hr/>
                        {categories}
                    </div>
			    );
            } else {//Ask the supplied question

				//Two modes: 4 choices or a textbox

				if (this.props.question.choices) {
	                var choices = this.props.question.choices.map((choice,index) => {
						return <a className="answer" onClick={this.handleAnswer} key={index}>{choice}</a>;
	                });
	                child = (
	                    <div>
	                        <p>{this.props.question.title}</p>
	                        <hr/>
	                        <p>{choices}</p>
	                    </div>
                	);
				} else {
					child = (
						<form onSubmit={this.handleAnswer}>
							<p>{this.props.question.title}</p>
							<hr/>
                            <div className="input-group">
							    <input type="text" onChange={this.handleChange} className="form-control"/>
                                <span className="input-group-btn">
                                    <input type="submit" value="OK" className="btn btn-primary"/>
                                </span>
                            </div>
						</form>
					);
				}
            }
            return (
                <ReactCSSTransitionGroup transitionName="europium-modal"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                    <div className="europium-modal">
                        {child}
                    </div>
                </ReactCSSTransitionGroup>
            );
		} else {
            return (
                <ReactCSSTransitionGroup transitionName="europium-modal"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={500}>
                </ReactCSSTransitionGroup>
            );
        }
    }
}

export default Modal;
