/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import React        from 'react-mod';
import Reflux       from 'reflux';
import {Link}       from 'react-router';

import UiValidate   from 'vntd-shared/forms/validation/UiValidate.jsx';
import LoadHtml     from 'vntd-shared/utils/LoadHtml.jsx';
import Actions      from 'vntd-root/actions/Actions.jsx';
import UserStore    from 'vntd-shared/stores/UserStore.jsx';
import History      from 'vntd-shared/utils/History.jsx';
import {htmlCodes}  from 'vntd-root/config/constants.js';

import {LoginAbout, LoginSocial} from './Login.jsx';

let RegisterHeader = React.createClass({
    render: function() {
        return (
<header id="header" className="animated fadeInDown">
    <div id="logo-group">
        <span id="logo"> <img src="/rs/img/logo/flag.png" alt="Viet Nam"/> </span>
    </div>
    <span id="extr-page-header-space">
        <span className="hidden-mobile hiddex-xs">Already registered?</span>{htmlCodes.spaceNoBreak}
        <Link to="/login" className="btn btn-danger">Sign In</Link>
    </span>
</header>
        );
    }
});

let RegisterForm = React.createClass({
    mixins: [
        Reflux.connect(UserStore)
    ],

    componentWillMount: function() {
        if (UserStore.isLogin()) {
            History.pushState(null, "/public/vietnam");
        }
    },

    componentDidMount: function() {
        this.listenTo(UserStore, this._registerResult);
        if (UserStore.getAuthCode() == "register-done") {
            $('#id-register-info').show();
        }
    },

    render: function() {
        return (
<div>
    <div className="well no-padding">
        <UiValidate>
        <form onSubmit={this._submitRegister} id="smart-form-register" className="smart-form client-form">
            <header>Register to open your account</header>
            <fieldset>
                <section>
                    <div className="form-group alert alert-danger" id="id-register-error" style={{display:"none"}}>
                        <a className="close" data-dismiss="alert" aria-label="close">x</a>
                        <div id="id-register-error-text"></div>
                    </div>
                    <div className="form-group alert alert-info" id="id-register-info" style={{display:"none"}}>
                        <a className="close" data-dismiss="alert" aria-label="close">x</a>
                        Success, sign in to your <Link to="/login" className="btn btn-info">account</Link>
                    </div>
                </section>
            </fieldset>
            <fieldset>
                <section>
                    <label className="input"> <i className="icon-append fa fa-envelope"/>
                        <input type="email" name="email" ref="email" placeholder="Email address"
                            onFocus={this._onFocus}
                            data-smart-validate-input="" data-required="" data-email=""
                            data-message-required="Please enter your email address"
                            data-message-email="Account is your email address"/>
                        <b className="tooltip tooltip-bottom-right">Needed to verify your account</b>
                    </label>
                </section>

                <section>
                    <label className="input"> <i className="icon-append fa fa-lock"/>
                        <input type="password" name="password" ref="password0" placeholder="Password" id="password"
                            onFocus={this._onFocus}
                            data-smart-validate-input="" data-required=""
                            data-minlength="3" data-maxnlength="20"
                            data-message="You need a password"/>
                        <b className="tooltip tooltip-bottom-right">Don't forget your password</b>
                    </label>
                </section>

                <section>
                    <label className="input"> <i className="icon-append fa fa-lock"/>
                        <input type="password" name="passwordConfirm" ref="password1" placeholder="Confirm password"
                            onFocus={this._onFocus}
                            data-smart-validate-input="" data-required=""
                            data-minlength="3" data-maxnlength="20"
                            data-message="Password verification failed"/> 
                        <b className="tooltip tooltip-bottom-right">Don't forget your password</b>
                    </label>
                </section>
            </fieldset>
            <fieldset>
                <div className="row">
                    <section className="col col-6">
                        <label className="input">
                            <input type="text" name="firstname" ref="firstName" placeholder="First name"
                                onFocus={this._onFocus}/>
                        </label>
                    </section>
                    <section className="col col-6">
                        <label className="input">
                            <input type="text" name="lastname" ref="lastName" placeholder="Last name"
                                onFocus={this._onFocus}/>
                        </label>
                    </section>
                </div>

                <div className="row">
                    <section className="col col-6">
                        <label className="select">
                            <select name="gender" ref="gender" defaultValue={"0"}>
                                <option value="0" disabled={true}>Gender</option>
                                <option value="1">Male</option>
                                <option value="2">Female</option>
                                <option value="3">Prefer not to answer</option>
                            </select> <i/>
                        </label>
                    </section>
                    <section className="col col-6">
                    </section>
                </div>

                <section>
                    <label className="checkbox">
                        <input type="checkbox" name="terms" ref="terms" id="terms"/>
                        <i/>I agree with the
                        <a href="#" data-toggle="modal" data-target="#id-reg-modal"> Terms and Conditions </a>
                    </label>
                </section>
            </fieldset>
            <footer>
                <button type="submit" className="btn btn-primary">Register</button>
            </footer>

            <div className="message">
                <i className="fa fa-check"/>
                <p>
                    Thank you for your registration!
                </p>
            </div>
        </form>
        </UiValidate>
    </div>
    <p className="note text-center">Welcome to ...</p>
    <h5 className="text-center">- Or sign in using -</h5>
    <LoginSocial/>
</div>
        );
    },

    _registerResult: function(data) {
        let form = $('#smart-form-register');
        form.find('input').prop('disabled', false);

        if (data.authCode == "register-done") {
            $('#id-register-info').show();
        } else if (data.authCode == "register-verify") {
            Actions.verifyAccount({
                type: data.authCode,
                authVerifToken: data.authVerifToken
            });
        } else if ((data.authCode == "failure") ||
                   (data.authCode == "register-user-exists")) {
            $('#id-register-error-text').empty().html(data.authMesg);
            $('#id-register-error').show();
        } else {
            /* XXX: report error here. */
            console.log("unknown error: " + data.authCode);
            console.log(data);
        }
    },

    _onFocus: function() {
        $('#id-register-error').hide();
    },

    _submitRegister: function(event) {
        event.preventDefault();
        let data = {
            email    : this.refs.email.getDOMNode().value,
            password0: this.refs.password0.getDOMNode().value,
            password1: this.refs.password1.getDOMNode().value,
            firstName: this.refs.firstName.getDOMNode().value,
            lastName : this.refs.lastName.getDOMNode().value,
            gender   : this.refs.gender.getDOMNode().value,
            checkTerms: this.refs.terms.getDOMNode().value
        };
        let form = $('#smart-form-register');
        form.find('input').prop('disabled', true);
        $('#id-register-error').hide();
        $('#id-register-info').hide();
        Actions.register(data);
    }
});

let RegisterTos = React.createClass({
    render: function() {
        return (
<div className="modal fade"
    id="id-reg-modal" tabIndex="-1" role="dialog" aria-labelledby="id-reg-modal-label" aria-hidden="true">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                    &times;
                </button>
                <h4 className="modal-title" id="id-reg-modal-label">Terms & Conditions</h4>
            </div>
            <div className="modal-body custom-scroll terms-body">
                <LoadHtml url="/public/terms-and-conditions" />
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" className="btn btn-primary" id="i-agree">
                    <i className="fa fa-check"/> I Agree
                </button>
            </div>
        </div>
    </div>
</div>
        );
    }
});

let Register = React.createClass({
    render: function() {
        return (
<div id="extr-page" >
    <RegisterHeader/>
    <div id="main" role="main" className="animated fadeInDown">
        <div id="content" className="container">
            <div className="row">
                <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
                    <LoginAbout />
                </div>
                <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5">
                    <RegisterForm />
                </div>
            </div>
        </div>
        <RegisterTos/>
    </div>
</div>
        )
    }
});

export default Register
export { RegisterForm }
