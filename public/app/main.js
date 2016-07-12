import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Board from './Board';
import Menu from './Menu'

class Game extends Component {
	constructor(props) {
		super(props);
		this.play = this.play.bind(this);
		this.state = { children: [<Menu key="0" onPlay={this.play} />] };
	}
	play(name) {
		this.setState({children:
			[<Board key="0" name={name} />]
		});
	}
	render() {
		return (
			<div className="game fill">
				{this.state.children}
			</div>
		);
	}
}

ReactDOM.render(<Game />, document.getElementById('europium-app'));
