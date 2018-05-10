import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

export default function NotWhenLoggedIn(Children) {
  @inject("store")
  @observer
  class UnuthenticatedComponent extends Component {
    constructor(props) {
      super(props);
      this.store = this.props.store.appState;
    }

    render() {
      const { authenticated, authenticating } = this.store;
      return (
        <div className="authComponent">
          {!authenticated || !authenticating
            ? <Children {...this.props} />
            : <Redirect
                    to={{
                      pathname: "/",
                      state: { from: this.props.location }
                    }}
                  />
                }
        </div>
      );
    }
  }
  return UnuthenticatedComponent;
}
