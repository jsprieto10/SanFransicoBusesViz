import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import DataBuses from "./DataBuses";
import { Comments } from "../api/comments.js";
import Comment from "./Comment";
import AccountsUIWrapper from './AccountsUIWrapper.js';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Comments.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username || Meteor.user().profile.name  // current time
    });

    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = "";
  }

  componentDidMount() {
    fetch(
      "http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni"
    )
      .then(function(response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({ data: myJson });
      });
  }

  renderComments() {
    return this.props.comments.map(comment => (
      <Comment key={comment._id} comment={comment} />
    ));
  }

  render() {
    return (
      <div>
        <div className="wrapper">
        <br/>
        <br/  >
        <h1>San Francisco Buses Data Viz</h1>
        </div>
        <center>
        <DataBuses buses={this.state.data} />
        </center>
        <br />
        <div className="wrapper">
        <AccountsUIWrapper />
        <br/>
        </div>
        <div className="container">
          <h1>Give us your opinion</h1>
          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add a new comment"
              />
            </form> : <a>Log in, if you want to comment</a>
          }
          <ul>
          {this.renderComments()}
          </ul>
        </div>
        <br/>
        <br/>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    comments: Comments.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
})(App);
