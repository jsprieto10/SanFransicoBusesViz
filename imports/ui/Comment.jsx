import react from "react";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import { Comments } from "../api/comments.js";


class Comment extends Component{

      deleteThisComment() {
        if (Meteor.user()._id === this.props.comment.owner)
        Comments.remove(this.props.comment._id);
      }

    render(){

        return(
            <li>
        <button className="delete" onClick={this.deleteThisComment.bind(this)}>
          &times;
        </button>
 
        <span className="text">
          <strong>{this.props.comment.username}</strong>: {this.props.comment.text}
        </span>
      </li>
        );
        }
}

export default Comment;