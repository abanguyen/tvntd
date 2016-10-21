/**
 * Modified by Vy Nguyen (2016)
 */
'use strict';

import React      from 'react-mod'
import classnames from 'classnames'

class Notification extends React.Component
{
    render() {
        let item = this.props.item;
        return (
            <span className="padding-10">
                <em className="badge padding-5 no-border-radius bg-color-blueLight pull-left margin-right-5">
                    <i className={classnames(['fa fa-fw fa-2x', item.icon])}/>
                </em>
			    <span>{item.message}<br />
                    <span className="pull-right font-xs text-muted"><i>{item.time}</i></span>
			    </span>
		    </span>
        )
    }
}

export default Notification;
