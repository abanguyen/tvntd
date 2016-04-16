/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React               from 'react-mod';
import Reflux              from 'reflux';

import JarvisWidget        from 'vntd-shared/widgets/JarvisWidget.jsx';
import MarkdownEditor      from 'vntd-shared/forms/editors/MarkdownEditor.jsx';
import UserStore           from 'vntd-shared/stores/UserStore.jsx';
import TabPanelStore       from 'vntd-shared/stores/TabPanelStore.jsx';
import TabPanel            from 'vntd-shared/layout/TabPanel.jsx';
import PostArticles        from 'vntd-root/components/PostArticles.jsx';
import ProfileCover        from 'vntd-root/components/ProfileCover.jsx';
import UserAvatar          from './UserAvatar.jsx';

let UserHome = React.createClass({
    mixins: [Reflux.connect(UserStore)],

    userTab: {
        init    : false,
        reactId : 'user-home',
        tabItems: [ {
            domId  : 'published-articles',
            tabText: 'Published Articles',
            panelContent: null
        }, {
            domId  : 'saved-articles',
            tabText: 'Saved Articles',
            panelContent: null
        }, {
            domId  : 'block-chain',
            tabText: 'My Block-Chains',
            panelContent: null
        } ]
    },

    render: function() {
        let self = UserStore.getSelf();
        if (self == null) {
            return null;
        }
        let imgList = [
            "/rs/img/demo/s1.jpg",
            "/rs/img/demo/s2.jpg",
            "/rs/img/demo/s3.jpg"
        ];
        if (this.userTab.init != true) {
            this.userTab.init = true;
            this.userTab.tabItems[0].panelContent = <PostArticles uuid={[self.userUuid]}/>;
            this.userTab.tabItems[1].panelContent = <PostArticles uuid={[self.userUuid]}/>;
            TabPanelStore.setTabPanel(this.userTab.reactId, this.userTab);
        }
        return (
            <div id="user-home">
                <ProfileCover data={{imageId: self._id, imageList: imgList}}/>
                <UserAvatar data={{doFileDrop: false}}/>
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-10">
                        <JarvisWidget id="my-post" color="purple">
                            <header><span className="widget-icon"> <i className="fa fa-pencil"/>  </span>
                                <h2>Publish Post</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <MarkdownEditor className="custom-scroll" style={{height:280}}/>
                                    <button className="btn btn-primary margin-top-10 pull-right">Post</button>
                                    <button className="btn btn-primary margin-top-10 pull-right">Save</button>
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
                <div className="row">
                    <article className="col-sm-12 col-md-12 col-lg-10">
                        <TabPanel tabId={this.userTab.reactId}/>
                    </article>
                </div>
            </div>
        )
    }
});

export default UserHome;
