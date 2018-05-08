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
			if (!this.state.password.length || !this.state.email) {
				alert("You must provide an email and password to login.");
				return;
			}
			this.store.appState.login(this.state.email, this.state.password)
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
			this.store.appState.register(this.state.email, this.state.password)
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

	emailChange(e) {
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
					<input placeholder="muldrotha@notyouraddress.com"
								 onChange={this.emailChange.bind(this)}
								 type="email"
								 value={this.state.email} type="text"/>
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
