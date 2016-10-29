/**
 * Vy Nguyen (2016)
 */
'use strict';

import React          from 'react-mod';
import UserStore      from 'vntd-shared/stores/UserStore.jsx';
import UserFriends    from './UserFriends.jsx';

class UserConnect extends React.Component
{
    render() {
        return (
            <UserFriends owned={true} userList={this.props.userList} tableType="all-user"/>
        );
    }
}

export default UserConnect;
