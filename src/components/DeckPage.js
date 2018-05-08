import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

import DataWrapper from "./DataWrapper";
import Protected from "./Protected";

// @DataWrapper // Because we have this, it applies the componentDidMount of the DataWrapper class.
@Protected   // Setting protected means that the user won't be able to go to this page if the states are not set correctly.
@observer
export default class DeckPage extends Component {
	constructor(props) {
		super(props);
		this.store = this.props.store;
		this.state = {
			searchValue: '',
		};
	}

	onChange(e) {
		e.preventDefault();

		this.setState({ searchValue: e.target.value }, () => {
      if (this.state.searchValue.length >= 3) {
        // Perform an autocomplete query.
        console.log(this.store);
        this.store.appState.fetchCards({ name: this.state.searchValue });
      }
    });
	}

	render() {
		const { item, cards } = this.store.appState;

		return (
			<div className="page post">
				<Link to="/decks">← Back to Decks</Link>
				{!!item &&
					<input onChange={this.onChange.bind(this)} value={this.state.searchValue} placeholder="Kumena" />
				}
				<div className="card_list">
					{
						!!cards && cards.length && cards.map((card) => <p key={card.name}>{card.name}</p>)
					}
				</div>
			</div>
		);
	}
}
