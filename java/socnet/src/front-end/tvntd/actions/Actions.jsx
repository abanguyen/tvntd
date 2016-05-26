/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux           from 'reflux';
import ErrorDispatch    from 'vntd-shared/actions/ErrorDispatch.jsx';

const Actions = Reflux.createActions({

    clickMenuItem:   {children: ['completed']},

    // User actions
    logout:          {children: ['completed', 'failed']},
    initialData:     {children: ['completed', 'failed']},
    startup:         {children: ['completed', 'failed']},
    getAuthors:      {children: ['completed', 'failed']},
    refreshArticles: {children: ['completed', 'failed']},
    refreshNotify:   {children: ['completed', 'failed']},
    login:           {children: ['completed', 'failed', 'always']},
    register:        {children: ['completed', 'failed', 'always']},
    verifyAccount:   {children: ['completed', 'failed']},
    resetPassword:   {children: ['completed', 'failed', 'always']},

    changeUsers:     {children: ['completed', 'failed']},
    saveUserPost:    {children: ['completed', 'failed']},
    deleteUserPost:  {children: ['completed', 'failed']},
    publishUserPost: {children: ['completed', 'failed']},

    pendingPost:     {children: ['completed']},
    uploadAvataDone: {children: ['completed']},

    // Preload json for testing.
    preload:         {children: ['completed', 'failed']}
});

function postRestCall(formData, url, json, cbObj) {
    let type = undefined;
    let data = formData;
    let content = undefined;

    if (json === true) {
        type = "JSON";
        data = JSON.stringify(formData);
        content = "application/json; charset=utf-8";
    }
    $.ajax({
        type: "POST",
        url : url,
        data: data,
        dataType: type,
        contentType: content,
        beforeSend: function(xhdr) {
            let token  = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhdr.setRequestHeader(header, token);
        }
    }).done(function(resp, text, error) {
        cbObj.completed(resp, text);

    }).fail(function(resp, text, error) {
        cbObj.failed(new ErrorDispatch(resp, text, error));

    }).always(function(resp, text, error) {
        if (cbObj.always != null) {
            cbObj.always(resp, text, error);
        }
    });
};

function uploadFiles(url, progId, formData, complete, failure) {
    $.ajax({
        type: "POST",
        url: url,
        data: formData,
        cache: false,
        xhr: function() {
            var req = $.ajaxSettings.xhr();
            if (req.upload) {
                req.upload.addEventListener('progress', progress, false);
            }
            return req;
        },
        beforeSend: function(xhdr) {
            let token  = $("meta[name='_csrf']").attr("content");
            let header = $("meta[name='_csrf_header']").attr("content");
            xhdr.setRequestHeader(header, token);
        }
    }).done(function(resp, text, error) {
        complete(resp, text);

    }).fail(function(resp, text, error) {
        failure(new ErrorDispatch(resp, text, error));
    });

    function progress(e) {
        if (e.lengthComputable) {
            $('#' + progId).attr({value: e.loaded, max: e.total});
        }
    }
};

/**
 * UI click actions.
 */
Actions.clickMenuItem.listen(function(item) {
    this.completed(item);
});

/**
 * User menu actions.
 */
Actions.startup.listen(function(url) {
    $.getJSON(url).then(this.completed, this.failed);
});

Actions.refreshNotify.listen(function() {
    $.getJSON("/api/user-notification").then(this.completed, this.failed);
});

Actions.getAuthors.listen(function(data, url) {
    if (url) {
        $.getJSON(url).then(this.completed, this.failed);
    } else {
        this.completed(data);
    }
});

/**
 * Posts and comments.
 */
Actions.refreshArticles.listen(function(authorUuid) {
    $.getJSON("/user/get-posts/" + authorUuid).then(this.completed, this.failed);
});

Actions.uploadAvataDone.listen(function(data) {
    this.completed(data);
});

/**
 * User actions.
 */
Actions.login.listen(function(loginData, formData) {
    postRestCall(formData, "/login", false, this);
});

Actions.logout.listen(function() {
    this.completed();
    document.location.href = "/login/logout";
});

Actions.register.listen(function(regData) {
    postRestCall(regData, "/register", true, this);
});

Actions.verifyAccount.listen(function(regData) {
    postRestCall(regData, "/register/verify", true, this);
});

Actions.resetPassword.listen(function(resetData) {
    postRestCall(resetData, "/", true, this);
});

Actions.preload.listen(function() {
    let data = {
        articles: require('json!../mock-json/article.json'),
        authors : require('json!../mock-json/author.json'),
        users   : require('json!../mock-json/user.json')
    };
    this.completed(data);
});

/**
 * User activities.
 */
Actions.changeUsers.listen(function(data) {
    postRestCall(data, "/api/user-connections", true, this);
});

Actions.saveUserPost.listen(function(data) {
    postRestCall(data, "/user/save-post", true, this);
    Actions.pendingPost(data);
});

Actions.deleteUserPost.listen(function(data) {
    postRestCall(data, "/user/delete-post", true, this);
});

Actions.publishUserPost.listen(function(data) {
    postRestCall(data, "/user/publish-post", true, this);
    Actions.pendingPost(data);
});

Actions.pendingPost.listen(function(data) {
    this.completed(data);
});

export default Actions;
