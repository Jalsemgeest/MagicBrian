import { observable, action, computed } from "mobx";
import axios from "axios";

export default class AppState {
  @observable authenticated;
  @observable authenticating;
  @observable items;
  @observable item;
  @observable cards;
  @observable currentDeck;
  @observable decks;

  constructor() {
    this.authenticated = false;
    this.authenticating = false;
    this.items = [];
    this.item = {};
    this.currentDeck = {};
    this.cards = [];
    this.decks = [];
  }

  async fetchData(pathname, id) {
    let { data } = await axios.get(
      `http://localhost:8080${pathname}`
    );
    console.log(data);
    data.length > 0 ? this.setData(data) : this.setSingle(data);
  }

  async fetchCards({ name }) {
    let { data } = await axios.post(`http://localhost:8080/cards`, { name: name });
    console.log(data);
    data.length > 0 ? this.setCards(data) : null;
  }

  @action setData(data) {
    this.items = data;
  }

  @action setSingle(data) {
    this.item = data;
  }

  @action clearItems() {
    this.items = [];
    this.item = {};
  }

  @action setCards(data) {
    this.cards = data;
  }

  @action addDeck(data) {
    this.decks.push(data);
  }

  @action clearCards() {
    this.cards = [];
  }

  @action clearDecks() {
    this.decks = [];
  }

  @computed get auth() {
    // Return the auth if it exists.
    return localStorage["auth"];
  }

  @computed get refresh() {
    // Return the refresh token if it exists.
    return localStorage["refresh"];
  }

  @computed get username() {
    return localStorage["username"];
  }

  clearUser() {
    localStorage.removeItem("username");
    localStorage.removeItem("auth");
    localStorage.removeItem("refresh");
  }

  @action authenticate() {
    // Attempt to authenticate using saved auth and refresh tokens.
    const username = this.username,
          auth = this.auth,
          refresh = this.refresh;

    this.authenticating = true;

    return new Promise((resolve, reject) => {
      if (!username || !auth || !refresh) {
        // Send all to server.
        this.clearUser();
        reject();
        return;
      }

      axios.post(`http://localhost:8080/auth`, { username, auth, refresh })
        .then((data) => {
          if (data.data.status === 'VALID_AUTH') {
            // Valid auth.
            localStorage["username"] = data.data.username;
          } else if (data.data.status === 'NEW_AUTH_GENERATED') {
            localStorage["auth"] = data.data.auth;
            localStorage["username"] = data.data.username;
          }
          this.authenticated = true;
          this.authenticating = false;
          resolve();
        })
        .catch((error) => {
          this.authenticated = false;
          this.authenticating = false;
          this.clearUser();
          reject(error);
        });
    });
  }

  @action login(username, password) {
    return new Promise((resolve, reject) => {
      this.authenticating = true;
      let self = this;
      try {
        axios.post(`http://localhost:8080/login`, { username: username, password })
          .then((data) => {
            console.log(data);
            self.authenticating = false;
            localStorage["auth"] = data.data.auth;
            localStorage["refresh"] = data.data.refresh;
            localStorage["username"] = username;
            self.authenticated = true;
            resolve();
          })
          .catch((error) => {
            self.authenticating = false;
            switch(error.status) {
              case 409:
                alert('The user already exists.');
                reject();
                return;
              case 500:
                alert(error.message);
                reject();
                return;
            }
          });
      } catch(err) {
        console.log(err);
        reject(err);
      }
    });
  }

  @action logout() {
    return new Promise((resolve, reject) => {
      if (!this.authenticated) {
        this.clearUser();
        reject();
        return;
      }

      const username = this.username,
            auth = this.auth;

      if (!username || !auth) {
        this.clearUser();
        reject();
        return;
      }

      let self = this;
      try {
        axios.post(`http://localhost:8080/logout`, { username, auth })
          .then((data) => {
            console.log(data);
            self.authenticating = false;
            this.authenticated = false;
            this.clearUser();
            resolve();
          })
          .catch((error) => {
            console.log(error.message);
            self.authenticating = false;
            self.authenticated = false;
            this.clearUser();
            reject();
          });
      } catch(err) {
        console.log(err);
        reject(err);
      }
    });
  }

  @action register(username, userEmail, password) {
    return new Promise((resolve, reject) => {
      this.authenticating = true;
      let self = this;
      try {
        axios.post(`http://localhost:8080/register`, { username, email: userEmail, password })
          .then((data) => {
            console.log(data);
            self.authenticating = false;
            localStorage["auth"] = data.data.auth;
            localStorage["refresh"] = data.data.refresh;
            localStorage["username"] = username;
            self.authenticated = true;
            resolve();
          })
          .catch((error) => {
            self.authenticating = false;
            switch(error.status) {
              case 409:
                alert('The user already exists.');
                reject();
                return;
              case 500:
                alert('Error creating user.');
                reject();
                return;
            }
          });
      } catch(err) {
        console.log(err);
        reject(err);
      }
    });
  }
}
