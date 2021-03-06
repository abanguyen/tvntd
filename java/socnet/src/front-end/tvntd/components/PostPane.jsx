/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _            from 'lodash';
import React        from 'react-mod';
import TA           from 'react-typeahead';

import Actions      from 'vntd-root/actions/Actions.jsx';
import AuthorStore  from 'vntd-root/stores/AuthorStore.jsx';
import AdminStore   from 'vntd-root/stores/AdminStore.jsx';
import PostItem     from 'vntd-root/components/PostItem.jsx';
import PostComment  from 'vntd-root/components/PostComment.jsx';
import WidgetGrid   from 'vntd-shared/widgets/WidgetGrid.jsx';
import JarvisWidget from 'vntd-shared/widgets/JarvisWidget.jsx';
import ModalConfirm from 'vntd-shared/forms/commons/ModalConfirm.jsx';

import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';

import Panel            from 'vntd-shared/widgets/Panel.jsx'; 
import { toDateString } from 'vntd-shared/utils/Enum.jsx';

class TagPost extends React.Component
{
    constructor(props) {
        super(props);
        let btnId = "chg-tag-" + props.articleUuid;
        this.state = {
            buttonId: btnId
        };
        this._onBlur = this._onBlur.bind(this);
        this._submitUpdate = this._submitUpdate.bind(this);
        this._getSavedInfo = this._getSavedInfo.bind(this);
        this._updateSuccess = this._updateSuccess.bind(this);
        this._createUpdateBtn = this._createUpdateBtn.bind(this);
        this._onOptionSelected = this._onOptionSelected.bind(this);

        StateButtonStore.createButton(btnId, this._createUpdateBtn);
    }

    _onBlur(val) {
        this._onOptionSelected(val.target.value);
    }

    _onOptionSelected(val) {
        let postInfo = this._getSavedInfo();
        postInfo.tagName = val;
    }

    _submitUpdate(btnId) {
        let postInfo = this._getSavedInfo();
        let tagInfo = {
            tagName    : postInfo.tagName,
            favorite   : this.state.favorite,
            userUuid   : this.props.authorUuid,
            title      : this.refs.title.value,
            likeInc    : 0,
            shareInc   : 0,
            articleUuid: this.props.articleUuid,
            cbButtonId : btnId
        };
        if (!_.isEmpty(this.refs.title.value)) {
            postInfo.title = this.refs.title.value;
        }
        StateButtonStore.getButtonState(btnId).setNextState();
        let artRank = AuthorStore.getArticleRank(this.props.authorUuid, this.props.articleUuid);
        AuthorStore.updateAuthorTag(tagInfo, artRank);
    }

    _updateSuccess(btnId, prev, curr) {
    }

    _createUpdateBtn() {
        let artRank = AuthorStore.getArticleRank(this.props.authorUuid, this.props.articleUuid);
        return {
            success: {
                text     : "Update",
                disabled : false,
                nextState: "updating",
                className: "btn btn-primary",
                triggerFn: this._updateSuccess
            },
            failure: {
                text     : "Update Failed",
                disabled : false,
                nextState: "updating",
                className: "btn btn-danger"
            },
            updating: {
                text     : "Updating",
                disabled : true,
                nextState: "success",
                className: "btn btn-default"
            },
            savedInfo: {
                artRank  : artRank,
                tagName  : artRank != null ? artRank.tagName : "My Post",
                title    : this.props.artTitle
            }
        };
    }

    _getSavedInfo() {
        return StateButtonStore.getButtonStateKey(this.state.buttonId, "savedInfo");
    }

    render() {
        let btnId = this.state.buttonId;
        let postInfo = this._getSavedInfo();
        let allTags = AuthorStore.getTagsByAuthorUuid(this.props.authorUuid);

        return (
            <form enclType="form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <TA.Typeahead options={allTags} maxVisible={6}
                            placeholder={postInfo.tagName} value={postInfo.tagName}
                            customClasses={{input: "form-control input-sm"}}
                            onBlur={this._onBlur} onOptionSelected={this._onOptionSelected}/>
                    </div>
                    <StateButton btnId={btnId} onClick={this._submitUpdate.bind(this, btnId)}/>
                </div>
                <div className="row">
                    <div className="col-xs-10 col-sm-10 col-md-10 col-lg-10">
                        <input className="form-control input-lg" ref="title" placeholder={postInfo.title}/>
                    </div>
                </div>
            </form>
        );
    }
};

class PostPane extends React.Component {

    constructor(props) {
        super(props);
        let artRank = AuthorStore.getArticleRank(props.data.authorUuid, props.data.articleUuid);
        if (artRank != null) {
            if (artRank.publishPost == null) {
                artRank.publishPost = false;
            }
            this.state = {
                artRank : artRank,
                favorite: artRank.favorite,
                publish : artRank.publishPost
            }
        } else {
            this.state = {
                artRank : {},
                favorite: false,
                publish : false
            }
        }
        this._deletePost = this._deletePost.bind(this);
        this._cancelDel = this._cancelDel.bind(this);
        this._toggleFavorite = this._toggleFavorite.bind(this);
    }

    _rawMarkup() {
        return { __html: this.props.data.content };
    }

    _deletePost() {
        Actions.deleteUserPost(this.props.data.articleUuid);
        this.refs.modal.closeModal();
        console.log("Delete uuid " + this.props.data.articleUuid);
    }

    _cancelDel() {
        this.refs.modal.closeModal();
    }

    _toggleFavorite() {
        let artRank = this.state.artRank;
        artRank.favorite = !this.state.favorite;
        this.setState({
            favorite: artRank.favorite
        });
    }

    render() {
        let adminItem = null;
        let article = this.props.data;

        if (UserStore.amIAdmin() == true) {
            adminItem = {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: 'Publish Post',
                itemHandler: function(e, pane) {
                    e.preventDefault();
                    AdminStore.addPublicArticle(article.articleUuid);
                }.bind(this)
            };
        }
        let modal = (
            <ModalConfirm ref={"modal"} modalTitle={"Are you sure to delete this post?"}>
                <div className="modal-footer">
                    <button className="btn btn-primary pull-right" onClick={this._deletePost}>Delete</button>
                    <button className="btn btn-default pull-right" onClick={this._cancelDel}>Cancel</button>
                </div>
            </ModalConfirm>
        );
        const ownerPostMenu = {
            iconFmt  : 'btn-xs btn-success',
            titleText: 'Options',
            itemFmt  : 'pull-right js-status-update',
            menuItems: [ {
                itemFmt : 'fa fa-circle txt-color-green',
                itemText: this.state.favorite ? "Not Favorite" : "Mark Favorite",
                itemHandler: function() {
                    this._toggleFavorite();
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-red',
                itemText: 'Delete Post',
                itemHandler: function(e, pane) {
                    e.stopPropagation();
                    this.refs.modal.openModal();
                }.bind(this)
            }, {
                itemFmt : 'fa fa-circle txt-color-blue',
                itemText: 'Tag Post',
                itemHandler: function() {
                }
            } ]
        };
        if (adminItem != null) {
            ownerPostMenu.menuItems.push(adminItem);
        }
        let panelLabel = [ {
            labelIcon: 'label label-success',
            labelText: article.moneyEarned
        }, {
            labelIcon: 'label label-warning',
            labelText: article.creditEarned
        } ];
        if (this.state.favorite == true) {
            panelLabel.push({
                labelIcon: 'label label-info',
                labelText: 'Favorite'
            });
        }
        const panelData = {
            icon   : 'fa fa-book',
            header : toDateString(article.createdDate),
            headerMenus: [ownerPostMenu],
            panelLabel : panelLabel
        };
        const divStyle = {
            margin: "10px 10px 10px 10px",
            fontSize: "130%"
        };
        let tagPost = null;
        if (UserStore.isUserMe(article.authorUuid)) {
            tagPost = (
                <TagPost articleUuid={article.articleUuid} artTitle={article.topic} authorUuid={article.authorUuid}/>
            );
        } else {
            tagPost = <h2>{article.topic ? article.topic : "Post"}</h2>
        }
        return (
            <Panel className="well no-padding" context={panelData}>
                {tagPost}
                {modal}
                <PostItem data={article.pictureUrl}/>
                <div style={divStyle} dangerouslySetInnerHTML={this._rawMarkup()}/>
                <PostComment articleUuid={article.articleUuid}/>
            </Panel>
        )
    }
}

export default PostPane;
