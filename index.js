var startTime = +Date.now();

const MAX_PLAYERS = 4;

const express = require('express'),
questions = require('./lib/questions'),
Player = require('./lib/Player');

var app = express()
.use(express.static('public'));

var players = [];

var server = require('http').Server(app);
const io = require('socket.io')(server);

function gameOver() {
	for (var i = 0, l = players.length; i < l; i++) {
		if (players[i].ring === 0) {
			return true;
		}
	}
	return false;
}

io.on('connection', (socket) => {
	socket.on('error', (err) => {
		console.error(err);
	});
	socket.on('player', (name) => {
		for (var p of players) {
			if (p.name == name) {
				console.log("Someone has the same name!");
				return;
			}
		}
		if (players.length < MAX_PLAYERS) {
			for (var p of players) {
				socket.emit('player', p.name);
			}
			socket.player = new Player(socket, name);
			players.push(socket.player);

			if (players.length === MAX_PLAYERS) { //Once there are 4 players, the game may begin
				function loop(player,i) { //While the game is not won, ask the players questions
					player.pickCategory().then((category) => {
						if (!category in questions.categories) {
							player.sendError('No such category!');
						}
						questions.pickQuestion(category).then((q) => {
							player.sendQuestion(q).then(() => {
								player.getAnswer().then((answer) => {
									var correct = false,
										actualAnswer = '';
									if (typeof q.answer === 'string') {
										correct = new RegExp(q.answer, 'i').test(answer);
										actualAnswer = q.answer;
									} else {
										correct = (answer === q.answer);
										actualAnswer = q.choices[q.answer];
									}
									player.sendCorrect(correct, actualAnswer).then(() => {
										if (!gameOver()) {
											if (i == 3) {
												i = -1;
											}
											loop(players[i+1], i+1);
										} else {
											var results = players.map((p) => {
												return {
													name: p.name,
													ring: p.ring
												};
											});
											io.sockets.emit('gameover', results);
										}
									});
								});
							});
						}).catch((err) => {
							player.sendError(err);
						});
					});
				}
				loop(players[0],0);
			}
		}
	});
	socket.on('disconnect', () => {
		if (socket.player) {
			players.splice(players.indexOf(socket.player), 1);
		}
	});
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
	console.log('Setup took: ' + (+Date.now() - startTime) + ' ms.');
	console.log('Ok - HTTP Port ' + port);
});
