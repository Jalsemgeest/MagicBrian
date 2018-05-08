
export default class Deck {
  constructor(name = '', cards = []) {
    this.name = name;
    this.cards = cards;
  }

  addCard(card) {
    this.cards.push(card);
  }

  removeCard(card) {
    // Remove the card from the array of cards.
  }

  filterCards(filter) {
    return this.cards;
  }
}