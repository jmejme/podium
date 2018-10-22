import React, { Component } from 'react';
import '../../../App.css';




class Login extends Component {

	constructor(props) {
		super()
		this.state = {
			username: ""
		}
		this.signIn = this.signIn.bind(this);
	}


	signIn() {

		// Get form data
		const id = this.refs.username.value;
		const pw = this.refs.password.value;

		// Validate username and passsword

		// Sign the user in
		this.props.signIn(id, pw);

	}


	render() {

		return (
			<div ref="login" className="lobby-box">
				<div className="login-box card">
					<img
						className="lobby-image"
						src="./images/logo.png"
						alt=""
					/>
					<input
						ref="username"
						className="signin-box"
						placeholder="@Username..."
					/>
					<input
						ref="password"
						className="signin-box password-box"
						placeholder="Password..."
						type="password"
					/>
					<button
						className="def-button green-button signin-button"
						onClick={this.signIn.bind(this)}>
						sign-in
					</button>
					<div className="lobby-or">
						<p className="lobby-or-text">OR</p>
					</div>
					<button
						className="def-button red-button lobbymode-button"
						onClick={this.props.setLobbyMode.bind(this, "register")}>
						<span className="fa fa-magic"></span> sign-up
					</button>
				</div>
			</div>
		);
	}

}

export default Login;