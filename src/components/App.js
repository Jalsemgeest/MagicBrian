import React, { Component } from "react";
import { Route, Link, withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import LazyRoute from "lazy-route";
import DevTools from "mobx-react-devtools";

import TopBar from "./TopBar";

@withRouter
@inject("store")
@observer
export default class App extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store;
	}
	componentDidMount() {
		this.authenticate();
	}
	authenticate(e) {
		if (e) e.preventDefault();
		this.store.appState.authenticate();
	}
	render() {
		const {
			authenticated,
			authenticating,
			timeToRefresh,
			refreshToken,
		} = this.store.appState;
		return (
			<div className="wrapper">
				{/*<DevTools />*/}
				<TopBar />

				<Route
					exact
					path="/"
					render={props => (
						<LazyRoute {...props} component={import("./Home")} />
					)}
				/>
				<Route
					exact
					path="/decks"
					render={props => (
						<LazyRoute {...props} component={import("./DecksPage")} />
					)}
				/>
				<Route
					exact
					path="/deck/:username/:id"
					render={props => (
						<LazyRoute {...props} component={import("./DeckPage")} />
					)}
				/>
				<Route
					exact
					path="/login"
					render={props => (
						<LazyRoute {...props} component={import("./Login")} />
					)}
				/>
				<Route
					exact
					path="/logout"
					render={props => (
						<LazyRoute {...props} component={import("./Logout")} />
					)}
				/>
				<Route
					exact
					path="/edit/:deckname"
					render={props => (
						<LazyRoute {...props} component={import("./EditDeck")} />
					)}
				/>
				<footer>
					<a href="https://twitter.com/alsemgeester" target="_blank">
						Created and maintained by @alsemgeester
					</a>
				</footer>
			</div>
		);
	}
}
