/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React            from 'react-mod';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import NavigationStore  from 'vntd-shared/stores/NavigationStore.jsx';
import AboutUsStore     from 'vntd-root/stores/AboutUsStore.jsx';
import ArticleStore     from 'vntd-root/stores/ArticleStore.jsx';
import AuthorStore      from 'vntd-root/stores/AuthorStore.jsx';
import CommentStore     from 'vntd-root/stores/CommentStore.jsx';
import RenderStore      from 'vntd-root/stores/RenderStore.jsx';

let Debug = React.createClass({

    debugUserStore: function() {
        UserStore.dumpData("User Store Content");
    },

    debugNavStore: function() {
        NavigationStore.dumpData("NavStore Content");
    },

    debugAboutUsStore: function() {
        AboutUsStore.dumpData("About Us Content");
    },

    debugArticleStore: function() {
        ArticleStore.dumpData("Article Store Content");
    },

    debugAuthorStore: function() {
        AuthorStore.dumpData("Author Store Content");
    },

    debugCommentStore: function() {
        CommentStore.dumpData("Comment Store Content");
    },

    debugRenderStore: function() {
        RenderStore.dumpData("Render Store Content");
    },

    render: function() {
        return (
            <div className="row">
                <div className="col-md-6">
                    <a onClick={this.debugUserStore}>Debug User Store</a>
                    <br/>
                    <a onClick={this.debugAboutUsStore}>Debug About Us Store</a>
                    <br/>
                    <a onClick={this.debugArticleStore}>Debug Article Store</a>
                    <br/>
                    <a onClick={this.debugAuthorStore}>Debug Author Store</a>
                    <br/>
                    <a onClick={this.debugCommentStore}>Debug Comment Store</a>
                    <br/>
                </div>
                <div className="col-md-6">
                    <a onClick={this.debugNavStore}>Debug Nav Store</a>
                    <br/>
                    <a onClick={this.debugRenderStore}>Debug Render Store</a>
                </div>
                <br/>
                <hr/>
            </div>
        );
    }
});

export default Debug;
