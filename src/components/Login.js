import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

@inject("store")
@observer
export default class Login extends Component {

	constructor(props) {
		super(props);
		this.store = this.props.store;
		this.state = {
			registration: false,
			username: '',
			email: '',
			password: '',
			passwordConfirm: '',
		};
	}

	submit(e) {
		console.log('Event?');
		if (!this.state.registration) {
			// Logging in.
			console.log('Logging in.');
			console.log(this.state);
			if (!this.state.password.length || !this.state.username) {
				alert("You must provide an username and password to login.");
				return;
			}
			this.store.appState.login(this.state.username, this.state.password)
				.then(() => {
					console.log('Success');
					this.props.history.push('/');
				})
				.catch(() => {
					this.props.history.push('/login');
				});
		} else {
			if (this.state.password !== this.state.passwordConfirm) {
				alert("Password and Password Confirm need to be the same.");
				return;
			}
			// Registration.
			console.log('Registering.');
			console.log(this.state);
			this.store.appState.register(this.state.username, this.state.email, this.state.password)
				.then(() => {
					console.log('Success');
					this.props.history.push('/');
				})
				.catch(() => {
					this.props.history.push('/login');
				});
		}
		e.preventDefault();
	}

	toggleRegistration(e) {
		e.preventDefault();
		this.setState({ registration: !this.state.registration });
	}

	changeUsername(e) {
		e.preventDefault();
		this.setState({ username: e.target.value });
	}

	changeEmail(e) {
		e.preventDefault();
		this.setState({ email: e.target.value });
	}

	passwordChange(e) {
		e.preventDefault();
		this.setState({ password: e.target.value });
	}

	passwordConfirmChange(e) {
		e.preventDefault();
		this.setState({ passwordConfirm: e.target.value });
	}

	render() {
		return (
			<div className="page login">
				<form onSubmit={this.submit.bind(this)}>
					<input placeholder="username"
								 onChange={this.changeUsername.bind(this)}
								 type="text"
								 value={this.state.username} type="text"/>
					{ !!this.state.registration && <input placeholder="muldrotha@magicbrian.com"
																								value={this.state.email}
																								onChange={this.changeEmail.bind(this)}
																								value={this.state.email}
																								type="email" /> }
					<input placeholder="password"
								 value={this.state.password}
								 onChange={this.passwordChange.bind(this)}
								 type="password" />
					{ !!this.state.registration && <input placeholder="password confirm"
																							  value={this.state.password}
																							  onChange={this.passwordConfirmChange.bind(this)}
																							  value={this.state.passwordConfirm}
																							  type="password" />
					}
					<button type="submit">
						{ !this.state.registration ? "Login" : "Register" }
					</button>
				</form>
				<a onClick={this.toggleRegistration.bind(this)}>
				{ this.state.registration ? "Login" : "Register" }
				</a>
				{this.props.store.authenticated &&
					!this.props.store.authenticating &&
					<Redirect to="/" />}
			</div>
		);
	}
}
