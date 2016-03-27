/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux   from 'reflux';
import _        from 'lodash';
import Actions  from 'vntd-root/actions/Actions.jsx';

/*
 * Explicit define known fields in User object.
 */
class User {
    constructor(data) {
        this._id          = _.uniqueId('id-user-info-');
        this.userUuid     = data.userUuid;
        this.userName     = data.userName;
        this.userRole     = data.userRole;
        this.userUrl      = data.userUrl;
        this.userImgUrl   = data.userImgUrl;
        this.userStatus   = data.userStatus;
        this.firstName    = data.firstName;
        this.lastName     = data.lastName;
        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.creditIssued = data.creditIssued;
        this.moneyIssued  = data.moneyIssued;
        this.followers    = data.followers;
        this.connections  = data.connections;
        this.follows      = data.follows;
        return this;
    }
}

let UserStore = Reflux.createStore({
    data: {
        userList: [],
        userSelf: {},
        authCode: null,
        authMesg: null,
        authError: null,
        authToken: null,
        authVerifToken: null
    },
    listenables: [Actions],

    /*
     * Public Api to get UserStore data.
     */
    getUserList: function() {
        return this.data.userList;
    },

    getUserByUuid: function(uuid) {
        return _.find(this.data.userList, { userUuid: uuid });
    },

    getAuthToken: function() {
        return this.data.authToken;
    },

    getAuthCode: function() {
        return this.data.authCode;
    },

    isLogin: function() {
        return this.data.authToken != null;
    },

    isUserMe: function(uuid) {
        return this.data.userSelf.userUuid == uuid;
    },

    getSelf: function() {
        console.log(this.data);
        return this.data.userSelf;
    },

    /* Startup actions. */
    onStartupCompleted: function(json) {
        this._changedData(json.userInfo);
    },

    /* Login actions. */
    onLoginCompleted: function(response, status) {
        this._changedData(response.responseJSON);
    },

    onLoginFailed: function(xhdr, text, error) {
        this._changedDataFailure(xhdr, text, error);
    },

    /* Register actions. */
    onRegisterCompleted: function(response, text) {
        this._changedData(response);
    },

    onRegisterFailed: function(xhdr, text, error) {
        this._changedDataFailure(xhdr, text, error);
    },

    onVerifyAccountCompleted: function(response, text) {
        this._changedData(response);
    },

    onVerifyAccountFailed: function(xhdr, text, error) {
        this._changedDataFailure(xhdr, text, error);
    },

    /* Logout actions. */
    onLogoutCompleted: function() {
        console.log("Logout completed");
        _reset();
        localStorage.removeItem("authToken");
    },

    /* Password reset actions. */
    onResetPasswordCompleted: function() {
        this.trigger(this.data);
    },

    onResetPasswordFailed: function() {
        this.trigger(this.data);
    },

    /* Init. action. */
    onInitCompleted: function(json) {
        this._changedData(null);
    },

    /* Preload for server-less test. */
    onPreloadCompleted: function(raw) {
        this._addFromJson(raw.users);
        this._changedData(null);
    },

    _reset: function() {
        this.data.userSelf = {};
        this.data.userList = [];
        this.data.authError = null;
        this.data.authToken = null;
    },

    _changedDataFailure: function(xhdr, text, error) {
        console.log("Post action failed");
        console.log(xhdr);
        this._changedData({
            type: "failure",
            error: xhdr,
            message: text,
            authToken: null,
            authVerifToken: null
        });
    },

    _changedData: function(resp) {
        if (resp != null) {
            this.data.authCode  = resp.type;
            this.data.authMesg  = resp.message;
            this.data.authError = resp.error;
            this.data.authToken = resp.authToken;
            this.data.authVerifToken = resp.authVerifToken;

            if ((resp.userSelf != undefined) && (resp.userSelf != null)) {
                this.data.userSelf = resp.userSelf;
                localStorage.setItem("authToken", resp.authToken);
            }
            if (resp.message == "") {
                this.data.authMesg = resp.error;
            }
        }
        this.trigger(this.data);
    },

    _addFromJson: function(items) {
        _(items).forEach(function(it) {
            if (it.userRole == "self" && _.isEmpty(this.data.userSelf)) {
                this.data.userSelf = new User(it);
            }
            if (!this.data.userList[it.userUuid]) {
                this.data.userList[it.userUuid] = new User(it);
            }
        }.bind(this))
    },

    exports: {
    }
});

export default UserStore
