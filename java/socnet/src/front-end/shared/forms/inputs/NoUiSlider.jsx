'use strict';

import React         from 'react-mod'
import {findDOMNode} from 'react-dom'
import ScriptLoader  from 'vntd-shared/utils/mixins/ScriptLoader.jsx'

let NoUiSlider = React.createClass({
    mixins: [ScriptLoader],

    componentDidMount: function () {
        this.loadScript('/rs/client/vendor.ui.js').then(function() {
            let element = $(findDOMNode(this));
            let props = this.props;
            element.addClass('noUiSlider');

            var options = {
                range: {
                    min: props.rangeMin ? parseInt(props.rangeMin) : 0,
                    max: props.rangeMax ? parseInt(props.rangeMax) : 1000
                },
                start: props.start
            };

            if (props.step) {
                options.step = parseInt(props.step);
            }
            if (props.connect) {
                options.connect = props.connect == 'true' ? true : props.connect;
            }
            element.noUiSlider(options);

            if (props.update) element.on('slide', function() {
                $(props.update).text(JSON.stringify(element.val()));
            });

        }.bind(this))
    },
    render: function() {
        return (
            <div {...this.props}/>
        )
    }
});

export default NoUiSlider
