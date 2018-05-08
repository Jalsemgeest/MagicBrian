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

  @computed get email() {
    return localStorage["email"];
  }

  clearUser() {
    localStorage.removeItem("email");
    localStorage.removeItem("auth");
    localStorage.removeItem("refresh");
  }

  @action authenticate() {
    // Attempt to authenticate using saved auth and refresh tokens.
    const email = this.email,
          auth = this.auth,
          refresh = this.refresh;

    return new Promise((resolve, reject) => {
      if (!email || !auth || !refresh) {
        // Send all to server.
        this.clearUser();
        reject();
        return;
      }

      axios.post(`http://localhost:8080/auth`, { email, auth, refresh })
        .then((data) => {
          if (data.data.status === 'VALID_AUTH') {
            // Valid auth.
            localStorage["email"] = data.data.email;
          } else if (data.data.status === 'NEW_AUTH_GENERATED') {
            localStorage["auth"] = data.data.auth;
            localStorage["email"] = data.data.email;
          }
          this.authenticated = true;
          resolve();
        })
        .catch((error) => {
          this.authenticated = false;
          this.clearUser();
          reject(error);
        });
    });
  }

  @action login(userEmail, password) {
    return new Promise((resolve, reject) => {
      this.authenticating = true;
      let self = this;
      try {
        axios.post(`http://localhost:8080/login`, { email: userEmail, password })
          .then((data) => {
            console.log(data);
            self.authenticating = false;
            localStorage["auth"] = data.data.auth;
            localStorage["refresh"] = data.data.refresh;
            localStorage["email"] = userEmail;
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

      const email = this.email,
            auth = this.auth;

      if (!email || !auth) {
        this.clearUser();
        reject();
        return;
      }

      let self = this;
      try {
        axios.post(`http://localhost:8080/logout`, { email, auth })
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

  @action register(userEmail, password, passwordConfirm) {
    return new Promise((resolve, reject) => {
      this.authenticating = true;
      let self = this;
      try {
        axios.post(`http://localhost:8080/register`, { email: userEmail, password })
          .then((data) => {
            console.log(data);
            self.authenticating = false;
            localStorage["auth"] = data.data.auth;
            localStorage["refresh"] = data.data.refresh;
            localStorage["email"] = userEmail;
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
