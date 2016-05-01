'use strict';

import React    from 'react-mod';
import ReactDOM from 'react-dom';

import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';
import ElementHolder from 'vntd-shared/utils/mixins/ElementHolder.jsx';

let SmartEditSummernote = React.createClass({
    mixins: [ScriptLoader, ElementHolder],

    _onClick: function () {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            $(this.props.target).summernote({
                focus: true
            })
        }.bind(this))
    },

    componentWillUnmount: function() {
        $(this.props.target).summernote('destroy');
    },

    render: function() {
        let {children, ...props} = this.props;
        return (
            <button onClick={this._onClick} {...props}>
                {children}
            </button>
        )
    }
});

export default SmartEditSummernote
