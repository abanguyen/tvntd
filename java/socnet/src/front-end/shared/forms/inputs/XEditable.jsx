'use strict';

import React from 'react-mod';
import _     from 'lodash';

import {findDOMNode} from 'react-dom';
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx';

let Timepicker = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function() {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            this.xEditable()
        }.bind(this))
    },

    componentDidUpdate: function() {
        this.xEditable()
    },

    xEditable: function() {
        let element = $(findDOMNode(this));
        let props = this.props;

        var options = _.extend(props, {});

        // $log.log(initOptions);
        element.editable('destroy');
        element.editable(options);

        element.on('save', function(e, params) {
            if(_.isFunction(this.props.onChange)) {
                this.props.onChange(params.newValue)
            }
        }.bind(this));
    },
    render: function() {
        let {children, ...props} = this.props;
        let id = props.id || _.uniqueId('x-editable');

        return (
            <a href="#" onClick={this._onClick} {...props} id={id}>
                {children}
            </a>
        )
    },

    _onClick: function(e){
        e.preventDefault();
        if (_.isFunction(this.props.onClick)) {
            this.props.onClick();
        }
    }
});

export default Timepicker
