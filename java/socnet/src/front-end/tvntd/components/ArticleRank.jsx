/**
 * Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import React  from 'react-mod';
import Reflux from 'reflux';

import StateButtonStore from 'vntd-shared/stores/StateButtonStore.jsx';
import StateButton      from 'vntd-shared/utils/StateButton.jsx';

import Actions      from 'vntd-root/actions/Actions.jsx';
import PostPane     from 'vntd-root/components/PostPane.jsx';
import LikeStat     from 'vntd-root/components/LikeStat.jsx';
import ArticleStore from 'vntd-root/stores/ArticleStore.jsx';

let ArticleRank = React.createClass({
    mixins: [
        Reflux.connect(ArticleStore),
    ],

    _getArticleResult: function() {
    },

    componentDidMount: function() {
        this.listenTo(ArticleStore, this._getArticleResult);
    },

    handleClick: function() {
        _toggleFullArticle();
    },

    _toggleFullArticle: function() {
        let btnId = "art-rank-btn-" + this.props.articleUuid;
        let btnState = StateButtonStore.getButtonState(btnId);
        let article = btnState.article;
        if (article == null) {
            article = ArticleStore.getArticleByUuid(this.props.articleUuid);
        } else {
            Actions.getOneArticle(this.props.articleUuid);
        }
        let curFullArt = btnState.fullArticle;
        let btnText = (curFullArt == false) ? "Hide article..." : "Read more...";

        StateButtonStore.changeButton(btnId, false, btnText, {
            "article"    : article,
            "fullArticle": !curFullArt
        });
    },

    render: function() {
        let artPane = null;
        let rank = this.props.rank;
        let btnId = "art-rank-btn-" + this.props.articleUuid;
        let btnState = StateButtonStore.saveButtonState(btnId, function() {
            return StateButtonStore.makeSimpleBtn("Read more...", false, {
                "article"    : null,
                "fullArticle": false,
                "readBtnId"  : btnId
            });
        });
        let readBtn = null;
        if (this.props.noBtn == null) {
            readBtn = (
                <StateButton btnId={btnId} className="btn btn-success" onClick={this._toggleFullArticle}/>
            );
        }
        if (btnState.article != null && btnState.fullArticle === true) {
            artPane = (
                <div className="row">
                    <PostPane data={btnState.article} artRank={rank}/>
                </div>
            );
        }
        let likeStat = {
            dateString: "1/1/1970",
            commentCount: 0,
            likesCount  : 0,
            sharesCount : 0
        }
        return (
            <div>
                <div className="well padding-10">
                    <div className="row padding-10">
                        <div className="col-xs-4 col-sm-4 col-md-4">
                            <h3>{rank.artTitle}</h3>
                            <br/>
                            <LikeStat data={likeStat}/>
                        </div>
                        <div className="col-xs-7 col-sm-7 col-md-7">
                            <p>{rank.contentBrief}</p>
                            {readBtn}
                        </div>
                    </div>
                </div>
                {artPane}
            </div>
        )
    },

    statics: {
        render: function(rank, refName, expanded) {
            return <ArticleRank rank={rank} articleUuid={rank.articleUuid}/>
        },

        renderNoButton: function(rank, relName, expanded) {
            return <ArticleRank rank={rank} articleUuid={rank.articleUuid} noBtn={true}/>
        }

    }
});

export default ArticleRank;
