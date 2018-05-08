import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Link } from "react-router-dom";

import DataWrapper from "./DataWrapper";
import Protected from "./Protected";

import Deck from '../models/deck';

@DataWrapper // Because we have this, it applies the componentDidMount of the DataWrapper class.
@Protected   // Setting protected means that the user won't be able to go to this page if the states are not set correctly.
@observer
export default class EditDeck extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
    this.state = {
      searchValue: '',
      goodCards: [],
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

  cardClick(card) {
    this.setState({ searchValue: card.name });
  }

  addCard() {
    // How to generate a new deck we are interested in.
    this.state.goodCards.push(this.state.searchValue);
    
    this.setState({ searchValue: '' });
  }

  render() {
    const { item, cards } = this.store.appState;
    const { goodCards } = this.state;
    console.log(item);

    return (
      <div className="page post">
        <Link to="/decks">← Back to Decks</Link>
        {!!item &&
          <input onChange={this.onChange.bind(this)} value={this.state.searchValue} placeholder="Kumena" />
        }
        {!!item &&
          <button onClick={this.addCard.bind(this)}>Add Card</button>
        }
        <div className="card_list">
          {
            !!cards && cards.length && cards.map((card) => <p key={card.name} onClick={() => this.cardClick(card)}>{card.name}</p>)
          }
        </div>

        <p>Deck</p>
        {
          goodCards && goodCards.length && goodCards.map((name) => <p key={name}>{name}</p>)
        }
      </div>
    );
  }
}
