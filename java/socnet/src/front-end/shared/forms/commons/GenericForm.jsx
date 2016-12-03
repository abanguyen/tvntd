/**
 * Copyright by Vy Nguyen (2016)
 * BSD License
 */
'use strict';

import _           from 'lodash';
import React       from 'react-mod';
import TA          from 'react-typeahead';
import Select      from 'react-select';

/*
 * Form format:
 * formEntry {
 *     legend: "",
 *     entries: [
 *         labelFmt: "",
 *         labelTxt: "",
 *         inputFmt: "",
 *         inpName : "",
 *         inpHolder: ""
 *     ]
 * }
 * Form {
 *     formFmt: "",
 *     hiddenHead: "",
 *     hiddenTail: "",
 *     formEntries: []
 *     buttons: [ {
 *         btnFmt: "",
 *         btnText" "",
 *         onClick: function...
 *     } ]
 * }
 */
class GenericForm extends React.Component
{
    constructor(props) {
        super(props);
    }

    _btnClick(button, event) {
        let dataRefs = {};
        let entries = this.props.form.formEntries;

        event.preventDefault();
        _.forEach(entries, function(section) {
            _.forEach(section.entries, function(item) {
                if (item.typeAhead === true || item.select === true) {
                    dataRefs[item.inpName] = item.taValue;
                } else {
                    dataRefs[item.inpName] = this.refs[item.inpName].value;
                }
            }.bind(this));
        }.bind(this));
        button.onClick(dataRefs, button);
    }

    _onBlur(entry, val) {
        entry.taValue = val.target.value;
    }

    _onSelectChange(entry, val) {
        entry.taValue = val;
    }

    render() {
        let form = this.props.form;
        let formButtons = null;

        if (form.buttons != null) {
            let buttons = form.buttons.map(function(item, idx) {
                return (
                    <button key={_.uniqueId('form-btn-')} type={"button"}
                        className={item.btnFormat} onClick={this._btnClick.bind(this, item)}>
                        {item.btnText}
                    </button>
                );
            }.bind(this));
            formButtons = (
                <div className="row">
                    <div className="col-sm-offset-2 col-sm-10">
                        <div className="btn-group pull-right" role="group">
                            {buttons}
                        </div>
                    </div>
                </div>
            );
        }
        let formEntries = form.formEntries.map(function(item, idx) {
            let entries = item.entries.map(function(entry, index) {
                let label = <label className={entry.labelFmt} for="textinput">{entry.labelTxt}</label>;
                let input = (
                    <input type="text" className="form-control"
                        name={entry.inpName} ref={entry.inpName} placeholder={entry.inpHolder}/>
                );
                if (entry.typeAhead === true) {
                    input = (
                        <TA.Typeahead options={entry.taOptions} maxVisible={6}
                            placeholder={entry.inpHolder} value={entry.inpHolder}
                            customClasses={{input: "form-control input-sm"}}
                            onBlur={this._onBlur.bind(this, entry)}
                            onOptionSelected={this._onSelectChange.bind(this, entry)}/>
                    );
                }
                if (entry.select == true) {
                    input = (
                        <Select options={entry.selectOpt} name={entry.inpName} value={entry.inpHolder}
                            onChange={this._onSelectChange.bind(this, entry)}/>
                    );
                }
                return (
                    <div className="row">
                        <div className="form-group" key={index}>
                            {label}
                            <div className={entry.inputFmt}>
                                {input}
                            </div>
                        </div>
                    </div>
                );
            }.bind(this));

            return (
                <div key={_.uniqueId('form-fields')}>
                    {item.legend != null ? <legend>{item.legend}</legend> : null}
                    <fieldset>
                        {entries}
                    </fieldset>
                </div>
            );
        }.bind(this));

        return (
                <form className={form.formFmt}>
                    {form.hiddenHead}
                    {formEntries}
                    {formButtons}
                </form>
        );
    }
}

export default GenericForm;
