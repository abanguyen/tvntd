
'use strict';

import React         from 'react';
import _             from 'lodash';
import classnames    from 'classnames';
import HtmlRender    from 'vntd-shared/utils/HtmlRender.jsx';
import ArticleRank   from 'vntd-root/components/ArticleRank.jsx';

let TreeViewItem = React.createClass({

    _handleExpand: function(e, data) {
        e.stopPropagation();
        let item = this.props.item
        if (item.children && item.children.length) {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    },

    getInitialState: function() {
        return {
            expanded: this.props.item.expanded != null ? this.props.item.expanded : false
        }
    },

    _handleDrag: function(entry, event) {
        console.log("Handle drag child");
        console.log(entry);
    },

    _handleDrop: function(entry, event) {
        console.log("Handle drop child");
        console.log(entry);
    },

    _handleDragOver: function(event) {
        event.preventDefault();
    },

    render: function () {
        let item = this.props.item;

        let subClassName = classnames({
            'smart-treeview-group': true,
            hidden: !this.state.expanded
        });
        let itemCnt  = null;
        let children = null;
        if (item.children && item.children.length) {
            children = <TreeView className={subClassName} items={item.children} role="group"/>;
            itemCnt  = <span className="badge">{item.children.length}</span>;
        }
        let className = classnames({
            parent_li: item.children && item.children.length
        });
        let output = null;
        let fmtLabel = null;

        if (item.renderFn == null) {
            if (item.defLabel == null) {
                output = <HtmlRender html={item.content}/>;
            } else {
                fmtLabel = item.content;
            }
        } else {
            output = item.renderFn(item.renderArg, "content");
            if (item.defLabel != null) {
                fmtLabel = output;
            }
        }
        if (fmtLabel != null) {
            output = (
                <span className="label label-primary" style={{fontSize: '14'}}>
                    {this.state.expanded ? <i className={item.iconOpen}></i> : <i className={item.iconClose}></i>}
                    {fmtLabel}
                    {itemCnt}
                </span>
            );
        }
        return (
            <li className={className} onClick={this._handleExpand}>
                {output}
                {children}
            </li>
        )
    }
});

let TreeView = React.createClass({

    _handleDrag: function(entry, event) {
        console.log("Handle drag");
        console.log(entry);
    },

    _handleDrop: function(entry, event) {
        console.log("Handle drop");
        console.log(entry);
    },

    _handleDragOver: function(event) {
        event.preventDefault();
    },

    render: function () {
        let items = this.props.items;
        _.forOwn(items, function(it) {
            it.expanded = true;
        });
        let views = items.map(function(it) {
            return (
                <TreeViewItem item={it} key={_.uniqueId('tree-item-')} parent={this}/>
            )
        }.bind(this));

        return (
            <ul role={this.props.role ? this.props.role : "tree"} className={this.props.className}>
                {views}
            </ul>
        )
    }
});

export default TreeView
