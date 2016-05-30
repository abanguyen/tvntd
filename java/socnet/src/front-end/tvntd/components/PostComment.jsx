/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _        from 'lodash';
import React    from 'react-mod';
import Reflux   from 'reflux';

import UserStore       from 'vntd-shared/stores/UserStore.jsx';
import UserIcon        from 'vntd-root/components/UserIcon.jsx';
import CommentStore    from 'vntd-root/stores/CommentStore.jsx';
import {safeStringify} from 'vntd-shared/utils/Enum.jsx'; 

let CommentBox = React.createClass({
    _submitContent: function(e) {
        e.preventDefault();
        let data = {
            comment: safeStringify(this.refs.comment),
            articleUuid: this.props.articleUuid,
            like: false,
            share: false
        };
        console.log("Submit comment");
        console.log(data);
    },

    _submitSelect: function(e) {
        e.preventDefault();
    },

    _toggleComment: function(e) {
        e.preventDefault();
        let show = !this.state.commentShow;
        let boxId = "#comment-" + this.props.articleUuid;

        this.setState({commentShow: show});
        if (show === true) {
            $(boxId).show();
        } else {
            $(boxId).hide();
        }
    },

    getInitialState: function() {
        return {
            submiting: false,
            submitLike : false,
            submitShare: false,
            commentShow: false
        }
    },

    render: function() {
        return (
            <div className="row no-margin no-padding">
                <hr/>
                <div className="btn-group inline">
                    <button onClick={this._submitSelect} disabled={this.state.submitLike} className="text-danger">
                        <i className="fa fa-thumbs-up"></i> Like
                    </button>
                    <button onClick={this._toggleComment} className="text-info">
                        <i className="fa fa-comment"></i> {"Comments (" + this.props.cmtCount + ")"}
                    </button>
                    <button onClick={this._submitSelect} disabled={this.state.submitShare} className="text-info">
                        <i className="fa fa-share"></i> Share
                    </button>
                    <button onClick={this._submitSelect} disabled={this.state.submitShare} className="text-info">
                        <i className="fa fa-book"></i> Save
                    </button>
                    <button onClick={this._submitSelect} disabled={this.state.submitShare} className="text-info">
                        <i className="fa fa-money"></i> Micropay
                    </button>
                </div>
                <br/>
                <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                    <div className="row">
                        <div className="col-sm-11">
                            <textarea ref="comment" className="form-control input-sm" placeholder="Place your comments here..."/>
                        </div>
                        <div className="col-sm-1">
                            <button className="btn btn-danger pull-right btn-block btn-sm"
                                onClick={this._submitComment} disabled={this.state.submiting}
                                type="button">Send</button>
                        </div>
                    </div>
                </form>                                                                                  
                <br/>
            </div>
        );
    }
});

let CommentItem = React.createClass({

    _submitLike: function(e) {
        e.preventDefault();
    },

    _makeFavorite: function(e) {
        e.preventDefault();
    },

    getInitialState: function() {
        return {
            submitedLike: true
        }
    },

    render: function() {
        let user = this.props.user;
        if (user == null) {
            return null;
        }
        return (
            <li className="message">
                <UserIcon className="username" userUuid={user.userUuid} width="40" height="40"/>
                <span className="message-text">
                    <a href-void className="username">  {user.lastName + ' ' + user.firstName}
                        <small className="text-muted pull-right ultra-light">{this.props.data.moment}</small>
                    </a>
                    {this.props.data.comment}
                </span>
                <ul className="list-inline">
                    <li>
                        <button onClick={this._submitLike} disabled={this.state.submitedLike} className="text-info">
                            <i className="fa fa-thumbs-up"></i> Like
                        </button>
                    </li>
                    <li>
                        <button onClick={this._makeFavorite} className="text-warning">
                            <i className="fa fa-bookmark"></i> Mark Favorite
                        </button>
                    </li>
                    <li>
                        <span className="text-danger">
                            <i className="fa fa-thumbs-up"></i> {this.props.data.likes} Likes
                        </span>
                    </li>
                </ul>
            </li>
        )
    }
});

let PostComment = React.createClass({
    mixins: [Reflux.connect(CommentStore)],

    render: function() {
        let favCmnts = [];
        _.forOwn(this.props.favorites, function(item, idx) {
            favCmnts.push(<CommentItem key={_.uniqueId('comment-')}
                            user={UserStore.getUserByUuid(item.userUuid)} data={item}/>
            );
        });
        let norCmnts = [];
        _.forOwn(this.props.comments, function(item, idx) {
            norCmnts.push(<CommentItem key={_.uniqueId('comment-')}
                            user={UserStore.getUserByUuid(item.userUuid)} data={item}/>);
        });
        let favColumn = null;
        if (this.props.favorites) {
            favColumn = (
                <div className="col-sm-12 col-md-6 col-lg-6 chat-body">
                    <ul>{favCmnts}</ul>
                </div>
            );
        }
        let norColumn = null;
        if (favColumn == null) {
            norColumn = (
                <div className="col-sm-12 col-md-12 col-lg-12 chat-body">
                    {norCmnts}
                </div>
            );
        } else {
            norColumn = (
                <div className="col-sm-12 col-md-6 col-lg-6 chat-body">
                    {norCmnts}
                </div>
            );
        }
        let cmtCount = favCmnts.length + norCmnts.length;
        return (
            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12">
                    <CommentBox articleUuid={this.props.articleUuid} cmtCount={cmtCount}/>
                </div>
                <div id={"comment-" + this.props.articleUuid}
                    style={{display: "none"}} className="col-sm-12 col-md-12 col-lg-12">
                    <div className="row no-margin no-padding">
                        {favColumn}
                        {norColumn}
                    </div>
                </div>
            </div>
        );
    }
});

export default PostComment;
