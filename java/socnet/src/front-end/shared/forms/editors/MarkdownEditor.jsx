'use strict';

import React         from 'react-mod';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';
import {findDOMNode} from 'react-dom';

const MarkdownEditor = React.createClass({
    componentDidMount: function() {
        ScriptLoader.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(findDOMNode(this)).markdown()
        }.bind(this))
    },

    render: function() {
        return (
            <textarea defaultValue={this.props.value} className={this.props.className} style={this.props.style}/>
        )
    }
});

export default MarkdownEditor
