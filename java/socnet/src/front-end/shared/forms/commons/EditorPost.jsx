/**
 * Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import ArticleStore    from 'vntd-root/stores/ArticleStore.jsx';
import Actions         from 'vntd-root/actions/Actions.jsx';
import Select2         from 'vntd-shared/forms/inputs/Select2.jsx';
import Editor          from 'vntd-shared/forms/editors/Editor.jsx';
import JarvisWidget    from 'vntd-shared/widgets/JarvisWidget.jsx';
import {safeStringify} from 'vntd-shared/utils/Enum.jsx';

let EditorPost = React.createClass({

    mixins: [Reflux.connect(ArticleStore)],

    _getData: function() {
        return {
            topic: safeStringify(this.refs.topic.value),
            tags: safeStringify(this.refs.tags.value),
            content: safeStringify(this.state.content),
            fileUpload: safeStringify(this.refs.fileUpload.value)
        }
    },

    _savePost: function(e) {
        e.preventDefault();
        this.setState({
            status: 'saving...'
        });
        console.log(this.state);
        Actions.saveUserPost(this._getData());
    },

    _publishPost: function(e) {
        e.preventDefault();
        this.setState({
            status: 'publishing...'
        });
        Actions.publishUserPost(this._getData());
        this.setState({
            status: 'published'
        });
    },

    _onPublishResult: function() {
        if (this.state.errorResp !== null) {
            let status = (this.state.status == "saving...") ? 'save failed' : 'publish failed';
            this.setState({
                status: status
            });
        }
    },

    _handleContentChange: function(e) {
        this.setState({
            content: e.target.value,
            status: 'draft'
        });
    },

    getInitialState: function() {
        return {
            content: '',
            status: 'empty',
            errorText: "",
            errorResp: null
        }
    },

    componentDidMount: function() {
        this.listenTo(ArticleStore, this._onPublishResult);
    },

    render: function() {
        let editorStyle = {
            overflow: 'auto',
            display: 'inline-block',
            minHeight: 200
        };
        let form = (
            <form encType="multipart/form-data" acceptCharset="utf-8" className="form-horizontal">
                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Topic</strong></label>
                            <div className="col-md-10">
                                <input ref="topic" className="form-control" placeholder="Topic" type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1"><strong>Link Chain</strong></label>
                            <div className="col-md-10">
                                <input ref="tags" className="form-control" placeholder="My Posts" type="text"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-info-bar no-padding">
                    <div className="row">
                        <div className="form-group">
                            <label className="control-label col-md-1">
                                <OverlayTrigger
                                    placement="bottom"
                                    overlay={
                                        <Tooltip id="attach-pic-tooltip">Attach pictures</Tooltip>
                                    }>
                                    <a href-void className="show-next" onClick={this._addAttachments}>
                                        <i className="fa fa-paperclip fa-lg"/>
                                    </a>
                                </OverlayTrigger>
                            </label>
                            <div className="col-md-10">
                                <input ref="fileUpload" className="form-control fileinput" type="file" multiple="multiple"/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="inbox-message no-padding">
                    <Editor id="main-post"
                        style={editorStyle}
                        content={this.state.content}
                        onChange={this._handleContentChange}
                    />
                </div>
        
                <div className="inbox-compose-footer">
                    <button onClick={this._savePost}
                        className="btn btn-danger margin=top-10 pull-right" type="button">Save</button>

                    <button onClick={this._publishPost}
                        className="btn btn-info  margin=top-10 pull-right" type="button">Publish</button>
                </div>
            </form>
        );
        return (
            <div className="row">
                <article className="col-sm-12 col-md-12 col-lg-12">
                    <JarvisWidget id="my-post" color="purple">
                        <header>
                            <span className="widget-icon"> <i className="fa fa-pencil"/></span>
                            <h2>Publish Post <span className="label txt-color-white">{this.state.status}</span></h2>
                        </header>
                        <div className="widget-body">
                            {form}
                        </div>
                    </JarvisWidget>
                </article>
            </div>
        )
    }
});

export default EditorPost
