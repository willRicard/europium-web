import React, { Component, PropTypes } from 'react';

class Player extends Component {
	getPropTypes() {
		return {
			id: PropTypes.string.isRequired,
			name: PropTypes.string.isRequired,
			color: PropTypes.string.isRequired,
			ring: PropTypes.number.isRequired
		};
	}
	constructor(props) {
		super(props);
		this.mounted = false;
	}
	componentDidMount() {
		this.mounted = true;
		var $player = document.getElementById(this.props.id);
		$player.style.backgroundColor = this.props.color;
		var onResize = () => {
			var board = document.querySelector('img').getBoundingClientRect(),
				baseX = Math.round(board.left + (board.width / 2 - 32)),
				baseY = Math.round(board.top + (board.height / 2 - 32)),
				direction = {x: null, y: null},
				id = parseInt(this.props.id);

			direction.x = (id & 1) ? -1 : 1;
			direction.y = (id < 3) ? -1 : 1;

			var x = baseX + this.props.ring * direction.x * 24,
				y = baseY + this.props.ring * direction.y * 24;

			$player.style.transform = 'translate(' + x + 'px,' + y + 'px)';
		};
		window.addEventListener('resize', onResize);
		onResize();
	}
	render() {
		if (this.mounted) {
			var $player = document.getElementById(this.props.id),
				board = document.querySelector('img').getBoundingClientRect(),
				baseX = Math.round(board.left + (board.width / 2 - 32)),
				baseY = Math.round(board.top + (board.height / 2 - 32)),
				direction = {x: null, y: null},
				id = parseInt(this.props.id);

				direction.x = (id & 1) ? -1 : 1;
				direction.y = (id < 3) ? -1 : 1;

				var x = baseX + this.props.ring * direction.x * 24,
					y = baseY + this.props.ring * direction.y * 24;

			this.anim = $player.animate([
				{transform: $player.style.transform},
				{transform: 'translate(' + x + 'px,' + y + 'px)'}
			], {
				duration: 1000,
				easing: 'ease-out'
			});
			this.anim.onfinish = () => {
				$player.style.transform = 'translate(' + x + 'px,' + y + 'px)';
			};
		}
		return (
			<div id={this.props.id} className="player">
				<p>
					{this.props.name}<br/>
					{this.props.ring}
				</p>
			</div>
		);
	}
}

export default Player;
