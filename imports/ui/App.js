import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      search: ""
    };
  }

  componentDidMount() {
    fetch("https://gist.githubusercontent.com/john-guerra/a0b840ba721ed771dd02d94a855cb595/raw/d68dba41f118bebc438a4f7ade9d27078efdfc09/sfBuses.json")
      .then(function(response) {
        return response.json();
      })
      .then(myJson => {
        this.setState({data: myJson});
        console.log(this.state.data);
      });
  }

  render() {
    return (
      <div>
        <h1>Prueba</h1>
      </div>
    );
  }
}

export default App;
