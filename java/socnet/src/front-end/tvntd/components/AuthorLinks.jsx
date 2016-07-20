/**
 * Written by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _         from 'lodash';
import React     from 'react-mod';
import Reflux    from 'reflux';

import TreeView      from 'vntd-shared/layout/TreeView.jsx';
import AccordionView from 'vntd-shared/layout/AccordionView.jsx';
import AuthorStore   from 'vntd-root/stores/AuthorStore.jsx';
import ArticleStore  from 'vntd-root/stores/ArticleStore.jsx';

let AuthorLinks = React.createClass({
    mixins: [
        Reflux.connect(AuthorStore)
    ],

    data: {
        evenRow: true
    },

    renderTag: function(tag) {
        return (
            <span>{tag.tagName}</span>
        );
    },

    showItem: function(item) {
        $('#tab-panel-all-' + item.authorUuid).trigger('click');
        $('#art-rank-full-' + item.articleUuid).trigger('click');
    },

    renderLink: function(item) {
        let article = ArticleStore.getArticleByUuid(item.articleUuid);
        if (article == null) {
            return null;
        }
        let text = item.artTitle.substring(0, 40);
        this.data.evenRow = !this.data.evenRow;
        return (
            <p><a onClick={this.showItem.bind(this, item)}>{text}</a></p>
        );
    },

    renderElement: function(parent, children, output) {
        if ((children != null) && !_.isEmpty(children)) {
            let sub = [];
            _.forOwn(children, function(item) {
                sub.push({
                    renderFn : this.renderLink,
                    renderArg: item
                });
            }.bind(this));

            let style = this.data.evenRow ? "label label-info" : "label label-primary";
            this.data.evenRow = !this.data.evenRow;
            output.push({
                renderFn : this.renderTag,
                renderArg: parent,
                textStyle: style,
                fontSize : '12',
                defLabel : true,
                children : sub,
                iconOpen : 'fa fa-folder-open',
                iconClose: 'fa fa-folder'
            });
        }
    },

    render: function() {
        let tagMgr = AuthorStore.getAuthorTagMgr(this.props.authorUuid);

        let json = [];
        tagMgr.getTreeViewJson(this.renderElement, json);
        return <AccordionView items={json}/>;
    }
});

export default AuthorLinks;
        /*
            <ModalButton className="btn btn-sm btn-primary" buttonText={item.artTitle} closeCb={clickCb.bind(this, item.authorUuid)}>
                <PostPane data={article}/>
            </ModalButton>
        */
