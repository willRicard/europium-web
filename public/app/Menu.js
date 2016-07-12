import React, { Component } from 'react';

class Menu extends Component {
	getPropTypes() {
		return {
			onPlay: PropTypes.func.isRequired
		};
	}
	constructor(props) {
		super(props);
		this.state = { name: '' };
		this.handleNameChange = this.handleNameChange.bind(this);
		this.play = this.play.bind(this);
	}
	handleNameChange(e) {
		this.setState({name: e.target.value});
	}
	play(e) {
		e.preventDefault();
		this.props.onPlay(this.state.name);
	}
    render() {
        return (
			<div className="row">
				<div className="col-sm-1 col-md-2 col-lg-3"></div>
            	<form onSubmit={this.play} className="menu col-sm-10 col-md-8 col-lg-6">
					<picture>
						<source media="(min-width: 367px)" srcSet="img/logo-337.jpg"/>
						<source media="(min-width: 630px)" srcSet="img/logo-600.jpg"/>
						<img src="img/logo-285.jpg"/>
					</picture>
					<hr/>
					<p>Enter your (team) name:</p>
					<div className="input-group">
						<input className="form-control" type="text" onChange={this.handleNameChange}/>
						<span className="input-group-btn">
							<input type="submit" value="Play" className="btn btn-primary" />
						</span>
					</div>
				</form>
				<div className="col-sm-1 col-md-2 col-lg-3"></div>
			</div>
        );
    }
}

export default Menu;
