import React, { Component } from 'react';
import io from 'socket.io-client'

import Player from './Player';
import Notify from './Notify';
import Modal from './Modal';

const MAX_PLAYERS = 4;
const PLAYER_COLORS = [ 'orange', 'purple', 'green', 'brown' ];

class Board extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ring: 8,
			players: [],
		 	question: null,
			results: null,
			showModal: false,
			notifyEvent: 'bg-primary',
			notifyMessage: 'Notications will display here'
		};

		var socket = this.socket = io();
		socket.on('error', (err) => {
			console.error(err);
			this.setState({notifyEvent: 'bg-danger', notifyMessage: 'There was a problem with the server! Please reload the page.'});
		});
		socket.on('europium error', (err) => {
			console.error(err);
			this.setState({notifyEvent: 'bg-danger', notifyMessage: err});
		});
		socket.on('player', (name) => {
			var players = this.state.players,
			player_id = players.length+1,
			ring = 8;

			players.push(<Player id={player_id.toString()} key={player_id} name={name} color={ PLAYER_COLORS[player_id-1] } ring={ring}/>);
			this.setState({
				players: players,
				notifyEvent: 'bg-success',
				notifyMessage: name + ' joined the game!'
			});
		});
		socket.on('pick', () => {
			this.setState({showModal: true});
		});
		socket.on('question', (q) => {
			this.setState({showModal: true, question: q});
		});
		socket.on('answer', (data) => {
			var name = data.name,
				correct = data.correct,
				actualAnswer = data.actual,
				players = this.state.players,
				player;
			for (var i = 0, l = players.length; i < l; i++) {
				if (players[i].props.name === data.name) {
					player = players[i];
					console.log(player);
					break;
				}
			}
			if (player) {
				var ring = player.props.ring;
				if (correct && ring > 0) {
					ring--;
				} else if (ring < 8) {
					ring++;
				}

				var nMessage = name + ' was ' + ((correct) ? 'right' : 'wrong') + '! The answer was: ' + actualAnswer.replace(/(\(|\)|\?)/g, "") + ".";

				var props = player.props,
				player_id = props.id;
				player = <Player ring={ring} id={player_id} key={player_id} name={props.name} color={props.color}/>
				players[i] = player;
				this.setState({
					players: players,
					notifyEvent: 'bg-primary',
					notifyMessage: nMessage
				});
			}
		});
		socket.on('gameover', (results) => {
			var winner, minRing = Infinity;
			for (var i = 0, l = results.length; i  < l; i++) {
				var ring = results[i].ring;
				if (ring < minRing) {
					minRing = ring;
					winner = results[i];
				}
			}
			this.setState({
				results: results,
				showModal: true,
				notifyEvent: 'bg-success',
				notifyMessage: winner.name + ' won the game!'
			});
		});

		socket.emit('player', props.name);

		this.onPick = this.onPick.bind(this);
		this.onAnswer = this.onAnswer.bind(this);
	}
	/**
	* @param {String} category - The category chosen by the player
	*/
	onPick(category) {
		this.socket.emit('pick', category);
		this.setState({showModal: false});
	}
	/**
	* @param {String} answer - The answer chosen by the player
	*/
	onAnswer(answer) {
		var a;
		if (this.state.question.choices) {
			a = this.state.question.choices.indexOf(answer);
		} else {
			a = answer;
		}
		this.socket.emit('answer', a);
		this.setState({question: null, showModal: false});
	}
	render() {
		return (
			<div className="board fill">
				<div className="row">
					<Notify className="col-xs-12" event={this.state.notifyEvent} message={this.state.notifyMessage}/>
				</div>
				<picture className="fill">
					<source media="(min-width: 100px)" srcSet="img/board.jpg"/>
					<source media="(min-width: 988px)" srcSet="img/board.jpg"/>
					<img src="img/board.jpg"
						draggable="false"
						sizes="33vw"
						srcSet="img/board.jpg"/>
				</picture>
				{this.state.players}
				<Modal onPick={this.onPick} onAnswer={this.onAnswer} isOpen={this.state.showModal} question={this.state.question} results={this.state.results}/>
			</div>
		);
	}
}

export default Board;
