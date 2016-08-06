class Player {
    constructor(socket, name) {
        this.socket = socket;
        this.name = name;
        this.ring = 8;

        socket.broadcast.emit('player', this.name);
        socket.emit('player', this.name);

        socket.on('disconnect', () => {
            socket.broadcast.emit('player disconnected', this.name);
        });
    }
    pickCategory() {
        var socket = this.socket;
        return new Promise((resolve) => {
            socket.emit('pick');
           	socket.on('pick', (category) => {
				socket.removeAllListeners('pick');
                resolve(category);
            });
        });
    }
    getAnswer() {
        var socket = this.socket;
        return new Promise((resolve) => {
            socket.on('answer', (answer) => {
                socket.removeAllListeners('answer');
                resolve(answer);
            });
        });
    }
	sendError(err) {
		this.socket.emit('europium error', err);
	}
    sendQuestion(q) {
		return new Promise((resolve) => {
			//Strip the 'answer' property away: preventing treachery
			var question = {
				title: q.title,
				choices: q.choices || false
			};
	        this.socket.emit('question', question);
			resolve();
		});
    }
    sendCorrect(correct) {
        var ring = this.ring, socket = this.socket;
        if (correct && ring > 0) {
            //Move one ring towards the center
            ring--;
        } else if (ring < 8) {
            ring++;
        }
        this.ring = ring;
		return new Promise((resolve) => {
			socket = this.socket;
			socket.broadcast.emit('answer', {name: this.name, correct: correct});
			socket.emit('answer', {name: this.name, correct: correct});

			resolve();
		});
    }
}

module.exports = Player;
