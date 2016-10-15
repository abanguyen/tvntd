/**
 * Copyright by Vy Nguyen (2016)
 * BSD License.
 */
'use strict';

import _                from 'lodash';
import React            from 'react-mod';
import Reflux           from 'reflux';
import {Link}           from 'react-router';
import ReactSpinner     from 'react-spinjs';

import Gallery          from 'vntd-shared/layout/Gallery.jsx';
import ModalHtml        from 'vntd-shared/layout/ModalHtml.jsx';
import UserStore        from 'vntd-shared/stores/UserStore.jsx';
import AboutUsStore     from 'vntd-root/stores/AboutUsStore.jsx';
import NewsFeed         from '../news-feed/NewsFeed.jsx';

let PriceBox = React.createClass({

    render: function() {
        let textList = [];
        _.forOwn(this.props.textList, function(it, idx) {
            textList.push(
                <li key={_.uniqueId("price-list-")} dangerouslySetInnerHTML={{__html: it}}></li>
            );
        });
        return (
            <div className="col-xs-12 col-sm-6 col-md-3">
                <div className="panel panel-success pricing-big">
                    {this.props.headerImg}
                    <div className="panel-heading" dangerouslySetInnerHTML={{__html: this.props.headerText}}></div>
                    <div className="panel-body no-padding text-align-center">
                        <div className="the-price" dangerouslySetInnerHTML={{__html: this.props.headerDetail}}></div>
                        <div className="price-features">
                            <ul className="list-unstyled text-left">
                                {textList}
                            </ul>
                        </div>
                    </div>
                    <div className="panel-footer text-align-center">
                        <ModalHtml className="btn btn-primary btn-block"
                            modalTitle={this.props.modalTitle}
                            buttonText={this.props.footerText} url={this.props.modalUrl}/>
                        <div><i>{this.props.footerDetail}</i></div>
                    </div>
                </div>
            </div>
        );
    }
});

let TeamBio = React.createClass({

    render: function() {
        return (
            <div className="col-xs-12 col-sm-3 col-md-3">
                <div className="team boxed-grey">
                    <div className="inner">
                        <h3>{this.props.name}</h3>
                        <p className="subtitle"><strong>{this.props.title}</strong></p>
                        <div className="avatar">
                            <img src={this.props.avatar} alt="" className="img-responsive"/>
                        </div>
                        <p>{this.props.teamDesc}</p>
                    </div>
                </div>
            </div>
        );
    }
});

let FeatureBox = React.createClass({

    render: function() {
        return (
            <div className="col-sm-3 col-md-3">
                <div className="service-box">
                    <div className="service-icon">
                        <i className={this.props.icon + " fa-3x"}></i>
                    </div>
                    <div className="service-desc">
                        <h5>{this.props.title}</h5>
                        {this.props.children}
                    </div>
                </div> 
            </div>
        );
    }
});

let FeatureSection = React.createClass({

    render: function() {
        return (
            <section className={"home-section text-center " + this.props.format}>
                <div className="heading-about marginbot-50">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-lg-offset-2">
                                <div className="section-heading">
                                    <br/>
                                    <div style={{fontSize: "300%"}}>
                                        <h1><strong>{this.props.title}</strong></h1>
                                    </div>
                                    <br/>
                                    <p style={{fontSize: "140%"}}>{this.props.titleDetail}</p>
                                    <br/>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        {this.props.children}
                    </div>
                </div>
            </section>
        );
    }
});

let TimeLineCenter = React.createClass({

    render: function() {
        let entries = [];
        _.forEach(this.props.timeEvents, function(event) {
            entries.push(
                <article className={"timeline-entry" + event.entryFormat}>
                    <div className="timeline-entry-inner">
                        <time className="timeline-time" datetime={event.datetime}>{event.timeMarker}</time>
                        <div className={"timeline-icon " + event.iconFormat}>
                            <i className={event.icon}></i>
                        </div>
                        <div className="timeline-label">
                            <h2><a href="#">{event.eventTitle}</a><span>{event.eventBrief}</span></h2>
                            {event.eventText}
                        </div>
                    </div>
                </article>
            );
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="timeline-centered">
                        {entries}
                    </div>
                </div>
            </div>
        );
    }
});

let TimeLineDev = React.createClass({

    render: function() {
        let entries = [];
        _.forEach(this.props.timeEvents, function(event) {
            entries.push(
                <li key={_.uniqueId('front-tl-')}>
                    <div className={"smart-timeline-icon " + event.iconFormat}>
                        <i className={event.icon}></i>
                    </div>
                    <div className="smart-timeline-time">
                        <small>{event.timeMarker}</small>
                    </div>
                    <div className="smart-timeline-content">
                        <h2><a href="#">{event.eventTitle}</a></h2>
                        <h3><span>{event.eventBrief}</span></h3>
                        {event.eventText}
                    </div>
                </li>
            );
        });
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="well well-sm">
                            <div className="smart-timeline">
                                <ul className="smart-timeline-list">
                                    {entries}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

let MainPage = React.createClass({

    mixins: [Reflux.connect(AboutUsStore)],

    getInitialState: function() {
        return AboutUsStore.getData();
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(AboutUsStore.getData());
    },

    render: function() {
        if (UserStore.isLogin()) {
            return <NewsFeed/>;
        }

        if (this.state.goals == null) {
            return (<ReactSpinner/>);
        }
        let goalBoxes = [];
        let goals = this.state.goals;
        _.forOwn(goals.panes, function(item) {
            goalBoxes.push(
                <PriceBox key={_.uniqueId('goal-box-')}
                    headerText={item.header}
                    headerImg={null}
                    headerDetail={item.headerHL}
                    textList={item.bodyText}
                    modalUrl={item.modalUrl}
                    modalTitle={item.modalTitle}
                    footerText={item.footer}
                    footerDetail={item.footerHL}/>
            );
        });
        let features = this.state.features;
        let featureBoxes = [];
        _.forOwn(features.features, function(item) {
            let text = [];
            let key = _.uniqueId('feature-box-');

            _.forOwn(item.text, function(it, idx) {
                text.push(<p key={key + idx}>{it}</p>);
            });
            featureBoxes.push(
                <FeatureBox key={key} icon={item.icon} title={item.title}>
                    {text} 
                </FeatureBox>
            );
        });
        let teamBoxes = [];
        _.forOwn(this.state.team.members, function(item) {
            teamBoxes.push(
                <TeamBio key={_.uniqueId('team-bio-')} name={item.name}
                    title={item.title} avatar={item.avatar} teamDesc={item.teamDesc}/>
            );
        });
        let plan = this.state.plan;
        let welcome = this.state.welcome;
        return (
            <div id="content">
                <FeatureSection title={welcome.title} titleDetail={welcome.titleDetail} format="bg-gray">
                </FeatureSection>

                <FeatureSection title={goals.title} titleDetail={goals.titleDetail}>
                    {goalBoxes}
                </FeatureSection>

                <FeatureSection title={features.title} titleDetail={features.titleDetail} format="bg-gray">
                    {featureBoxes}
                </FeatureSection>

                <FeatureSection title={this.state.screen.title} titleDetail={this.state.screen.titleDetail}>
                    <Gallery imageList={this.state.screen.images}/>
                </FeatureSection>

                <FeatureSection title={this.state.team.title} titleDetail={this.state.team.titleDetail} format="bg-gray">
                    {teamBoxes}
                </FeatureSection>

                <FeatureSection title={plan.title} titleDetail={plan.titleDetail}>
                    <TimeLineDev timeEvents={plan.events}/>
                </FeatureSection>

                <section className="home-section text-center">
                    <div className="container">
                        <Link to="/register/form" style={{fontSize: "250%"}} className="btn btn-primary">
                            {this.state.register.text}
                        </Link>
                    </div>
                </section>
            </div>
        );
    }
});

export default MainPage;
