import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

import TopNav from "./TopNav";
import Button from "./ui/Button";
import ActiveLink from "./ui/ActiveLink";

@withRouter
@inject("store")
@observer
export default class TopBar extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store.appState;
	}

	authenticate(e) {
		if (e) e.preventDefault();
		console.log("CLICKED BUTTON");
		this.store.authenticate();
	}

	render() {
		const { authenticated, email } = this.store;

		return (
			<div className="topbar">
				<TopNav location={this.props.location} />
				{
					!authenticated ?
							<ActiveLink to="/Login">Login</ActiveLink> :
							<div>
								<p>{email}</p>
								<ActiveLink to="/logout">Logout</ActiveLink>
							</div>
				}
			</div>
		);
	}
}
