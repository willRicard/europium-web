import React, { Component, PropTypes } from 'react';
import * as WebAnimations from 'web-animations-js';

const DURATION	= 500;		//ms
const TIMEOUT	= 10000;	//ms
const HEIGHT	= 32;		//pixels

class Notify extends Component {
	getPropTypes() {
		return {
			event: PropTypes.string.isRequired,
			message: PropTypes.string.isRequired
		};
	}
	constructor(props) {
		super(props);
		this.mounted = false;
		this.open = false;
		this.previousMessage = "";
		this.tid = 0;
	}
	componentDidMount() {
		document.querySelector('.notify').style.transform = 'translateY(-' + (HEIGHT) + ''
		this.mounted = true;
	}
	render() {
		if (this.previousMessage !== this.props.message && this.open) {
			clearTimeout(this.tid);
		}
		if (this.mounted) {
			this.previousMessage = this.props.message;

			var $notify = document.querySelector('.notify'),
				anim;
			if (!this.open) {
				//Enter only if dismissed
				this.open = true;
				$notify.style.display = 'block';
				anim = $notify.animate([
					{transform: 'translateY(-' + HEIGHT + 'px)'},
					{transform: 'translateY(0)'}
				], {
					duration: DURATION,
					fill: 'forwards'
				});
				anim.onfinish = () => {
					$notify.style.transform = 'translateY(' + (-HEIGHT) + 'px)';
				};
			}

			//Leave
			this.tid = setTimeout(() => {
				anim = $notify.animate([
					{transform: 'translateY(0)'},
					{transform: 'translateY(-' + HEIGHT + 'px)'}
				], {
					duration: DURATION,
					fill: 'forwards'
				});
				anim.onfinish = () => {
					$notify.style.transform = 'translateY(-' + HEIGHT + 'px)';
					$notify.style.display = 'none';
					this.open = false;
				};
			}, TIMEOUT);
		}
		return (
			<div className={"notify " + this.props.event}>
				{this.props.message}
			</div>
		);
	}
}

export default Notify;
