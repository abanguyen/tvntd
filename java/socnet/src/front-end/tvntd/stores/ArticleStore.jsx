/**
 * Created by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import Reflux    from 'reflux';
import _         from 'lodash';
import Actions   from 'vntd-root/actions/Actions.jsx';
import UserStore from 'vntd-shared/stores/UserStore.jsx';

import {insertSorted, preend} from 'vntd-shared/utils/Enum.jsx';

class Article {
    constructor(data) {
        this._id          = _.uniqueId('id-article-');
        this.author       = UserStore.getUserByUuid(data.authorUuid);
        this.commentList  = data.commentList;
        this.authorUuid   = data.authorUuid;
        this.articleUuid  = data.articleUuid;
        this.articleUrl   = data.articleUrl;
        this.likeCount    = data.likeCount;
        this.rankCount    = data.rankCount;
        this.creditEarned = data.creditEarned;
        this.moneyEarned  = data.moneyEarned;
        this.transactions = data.transactions;
        this.createdDate  = Date.parse(data.createdDate);
        this.content      = data.content;
        this.contentOId   = data.contentOId;
        this.pictureUrl   = data.pictureUrl;
        this.topic        = data.topic;
        return this;
    }
}

let ArticleStore = Reflux.createStore({
    data: {
        articlesByUuid: {},
        articlesByAuthor: {},
        mySavedArticles: {},
        myArticles: null,
        myPostResult: null,

        artUuidByDate: [],
        artUuidByScore: [],

        errorText: "",
        errorResp: null
    },
    listenables: Actions,

    _resetStore: function() {
        this.data.articlesByUuid = {};
        this.data.articlesByAuthor = {};
        this.data.mySavedArticles = {};
        this.data.myArticles = null;
        this.data.myPostResult = null;

        this.data.artUuidByDate = [];
        this.data.artUuidByScore = [];

        this.data.errorText = "";
        this.data.errorResp = null;
    },

    /**
     * Public API for the store.
     */
    getArticleStore: function() {
        return this.data;
    },

    getArticlesByAuthor: function(uuid) {
        let articles = [];
        this.iterAuthorArticles(uuid, function(item) {
            articles.push(item);
        });
        return articles;
    },

    /*
     * Return author's articles sorted to display.
     */
    getSortedArticlesByAuthor: function(uuid) {
        let anchor = this.data.articlesByAuthor[uuid];
        if (anchor === undefined) {
            anchor = this._createArtAnchor(uuid, null);
            this.data.articlesByAuthor[uuid] = anchor;
        }
        if (anchor.requestCount == 0) {
            Actions.refreshArticles(uuid);
        }
        anchor.requestCount++;
        return this.data.articlesByAuthor[uuid].sortedArticles;
    },

    iterAuthorArticles: function(uuid, func, arg) {
        let articles = this.data.articlesByAuthor[uuid];
        if (articles) {
            _.forOwn(articles, function(item, key) {
                if (key !== "sortedArticles") {
                    func(item, arg);
                }
            });
        }
        return null;
    },

    getMyArticles: function() {
        if (this.data.myArticles !== null) {
            return this.data.myArticles.sortedArticles;
        }
        return null;
    },

    getArticleByUuid: function(artUuid) {
        let article = this.data.articlesByUuid[artUuid];
        if (article !== undefined) {
            return article;
        }
        return null;
    },

    sortArticlesByDate: function(articles) {
    },

    sortArticlesByScore: function(articles) {
    },

    debugDump: function(header) {
        console.log(header);
        console.log(this.data);
    },

    /**
     * Event handlers.
     */
    init: function() {
        this._resetStore();
    },

    onPreloadCompleted: function(json) {
        this._addFromJson(json.articles);
        this.trigger(this.data);
    },

    onLogoutCompleted: function() {
        this._resetStore();
        this.trigger(this.data);
    },

    onRefreshArticlesCompleted: function(data) {
        this._addFromJson(data.articles);
        this._addSavedJson(data.pendPosts);
        this.trigger(this.data);
    },

    /**
     * Save/publish user post.
     */
    onPendingPostCompleted: function(post) {
        this.data.myPostResult = post;
    },

    onSaveUserPostFailed: function(err) {
        err.dispatch(this._errorHandler, this._errorHandler, null);
        this.trigger(this.data);
    },

    onSaveUserPostCompleted: function(post) {
        this._addArticle(post, true);
        this.trigger(this.data);
    },

    onPublishUserPostFailed: function(err) {
        err.dispatch(this._errorHandler, this._errorHandler, null);
        this.trigger(this.data);
    },

    onPublishUserPostCompleted: function(post) {
        this._addArticle(post, false);
        this.data.myPostResult = post;
        this.trigger(this.data);
    },

    /**
     * Internal methods.
     */
    _errorHandler: function(error) {
        this.data.errorText = error.getText();
        this.data.errorResp = error.getXHDR();
    },

    _createArtAnchor: function(authorUuid, article) {
        let anchor = new Object;

        this.data.articlesByAuthor[authorUuid] = anchor;
        if (UserStore.isUserMe(authorUuid)) {
            this.data.myArticles = anchor;
        }
        anchor.requestCount = 0;
        anchor.sortedArticles = [];
        if (article !== null) {
            anchor.sortedArticles.push(article);
            anchor[article.articleUuid] = article;
        }
        return anchor;
    },

    _addSortedArticle: function(anchor, article) {
        anchor.sortedArticles.push(article);
        // insertSorted(article, anchor.sortedArticles, this._compareArticles);
    },

    _compareArticles: function(a1, a2) {
        return a2.createdDate - a1.createdDate;
    },

    _addArticle: function(post, saved) {
        let article = new Article(post);

        if (saved === true) {
            this.data.mySavedArticles = preend(article, this.data.mySavedArticles);
            return;
        }
        let anchor = this.data.articlesByAuthor[article.authorUuid];
        if (anchor === undefined) {
            anchor = this._createArtAnchor(article.authorUuid, article);
        }
        if (this.data.articlesByUuid[article.articleUuid] === undefined) {
            anchor[article.articleUuid] = article;
            anchor.sortedArticles = preend(article, anchor.sortedArticles);

            this.data.articlesByUuid[article.articleUuid] = article;
        }
    },

    _removeArticle: function(artUuid) {
    },

    _indexAuthors: function(artList) {
        artList && _.forOwn(artList, function(jsonArt, key) {
            let article = this.data.articlesByUuid[jsonArt.articleUuid];
            if (article === undefined) {
                return;
            }
            if (article.author === undefined) {
                article.author = UserStore.getUserByUuid(article.authorUuid);
            }
            let anchor = this.data.articlesByAuthor[article.authorUuid];
            if (anchor === undefined) {
                anchor = this._createArtAnchor(article.authorUuid, article);

            } else if (anchor[article.articleUuid] === undefined) {
                anchor[article.articleUuid] = article;
                this._addSortedArticle(anchor, article);
            }
        }.bind(this));
    },

    _addFromJson: function(items) {
        items && _.forOwn(items, function(it, key) {
            if (this.data.articlesByUuid[it.articleUuid] === undefined) {
                let article = new Article(it);
                this.data.articlesByUuid[it.articleUuid] = article;
            }
        }.bind(this));

        this._indexAuthors(items);
    },

    _addSavedJson: function(items) {
        items && _.forOwn(items, function(it, key) {
            if (this.data.mySavedArticles[it.articleUuid] === undefined) {
                this.data.mySavedArticles[it.articleUuid] = new Article(it);
            }
        }.bind(this));
    },

    exports: {
    }
});

export default ArticleStore;
