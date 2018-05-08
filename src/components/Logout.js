import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

@inject("store")
@observer
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  componentDidMount() {
    this.store.appState.logout()
      .then(() => {
        this.props.history.push('/');
      })
      .catch(() => {
        this.props.history.push('/');
      });
  }

  render() {
    return (
      <div className="page login">
        <p>Logging out...</p>
      </div>
    );
  }
}
