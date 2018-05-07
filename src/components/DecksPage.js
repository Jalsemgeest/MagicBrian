import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Match, Link } from "react-router-dom";

import Protected from "./Protected";
import DataWrapper from "./DataWrapper";

@Protected   // Setting protected means that the user won't be able to go to this page if the states are not set correctly.
// @DataWrapper // Because we have this, it applies the componentDidMount of the DataWrapper class.
@observer
export default class DecksPage extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store;
	}
	render() {
		const { items } = this.store.appState;
		return (
			<div className="page posts">
				<h1>Decks</h1>
				<p className="subheader">
					Decks associated with your account.
				</p>
				<hr />
				<ul>
					{items && items.length
						? items.slice(6, 12).map(post => {
								return (
									<li key={post.id}>
										<Link
											to={`${this.props.match.path}/${post.id}`}
										>
											<h1>{post.title}</h1>
										</Link>
										<p>{post.body.substring(0, 120)}</p>
									</li>
								);
							})
						: "Loading..."}
				</ul>
			</div>
		);
	}
}
