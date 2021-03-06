'use strict';

import React from 'react-mod';
import {Dropdown, MenuItem} from 'react-bootstrap';

import Chat         from './Chat.jsx';
import ChatActions  from '../actions/ChatActions.jsx';
import JarvisWidget from '../widgets/JarvisWidget.jsx';

class ChatWidget extends React.Component
{
    componentWillMount() {
        ChatActions.init();
    }

    render() {
        return (
            <JarvisWidget editbutton={false} fullscreenbutton={false} color="blueDark">
                <header>
                    <span className="widget-icon"> <i className="fa fa-comments txt-color-white"/> </span>
                    <h2> SmartMessage </h2>

                    <div className="widget-toolbar">
                        <Dropdown id="dropdown-custom-1">
                            <Dropdown.Toggle className="btn-xs btn-success">
                                Status
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="pull-right js-status-update">
                                <MenuItem eventKey="1">
                                    <i className="fa fa-circle txt-color-green"/> Online
                                </MenuItem>
                                <MenuItem eventKey="2"><i className="fa fa-circle txt-color-red"/> Busy</MenuItem>
                                <MenuItem eventKey="3"><i className="fa fa-circle txt-color-orange"/> Away</MenuItem>
                                <MenuItem divider />
                                <MenuItem eventKey="4"><i className="fa fa-power-off"/> Log Off</MenuItem>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </header>
                <div>
                    <Chat className="widget-body widget-hide-overflow no-padding" />
                </div>
            </JarvisWidget>
        )
    }
}

export default ChatWidget;
