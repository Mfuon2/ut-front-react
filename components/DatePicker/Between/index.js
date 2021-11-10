import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import {DatePicker as DatePickerDialog} from '@material-ui/pickers';
import style from '../style.css';
import Text from '../../Text';

const noop = () => {};

export default class DatePickerBetween extends Component {
    constructor(props) {
        super(props);
        this.from = this.props.defaultValue.from;
        this.to = this.props.defaultValue.to;
        this.handleAccept = this.handleAccept.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getContextStyles = this.getContextStyles.bind(this);
        this.state = { fromDialogWindow: false, toDialogWindow: false, startDate: this.from || new Date(), endDate: this.to || new Date()};
    }

    handleOpen(ref) {
        return () => {
            this.setState({[`${ref}DialogWindow`]: true});
        };
    }

    handleClose(ref) {
        return () => {
            this.setState({[`${ref}DialogWindow`]: false});
        };
    }

    formatDate(date) {
        if (!date || isNaN(date.valueOf())) {
            return '';
        }

        const { locale, dateFormat, transformDate } = this.props;
        if (transformDate) {
            return transformDate(date, dateFormat, locale);
        }

        return date.toISOString();
    }

    handleAccept(ref) {
        const {defaultValue} = this.props;

        const currentDate = new Date(defaultValue);
        return (date) => {
            if ((currentDate && currentDate[ref] === date) || (!date && (!currentDate || !currentDate[ref]))) {
                return;
            }

            if (date && !isNaN(date.valueOf())) {
                if (ref === 'from') {
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    date.setMilliseconds(0);
                } else if (ref === 'to') {
                    date.setHours(23);
                    date.setMinutes(59);
                    date.setSeconds(59);
                    date.setMilliseconds(999);
                }
            }
            this.props.onChange({
                key: ref,
                value: date
            });
        };
    }

    handleKeyPress(ref) {
        return () => {
            this.handleAccept(ref)(undefined);
        };
    }

    getContextStyles(className) {
        if (this.context.implementationStyle[className]) {
            return this.context.implementationStyle[className];
        }
        return null;
    }

    render() {
        const boxStylesFrom = [style.dp];
        const boxStylesTo = [style.dp];
        const boxGroupStyles = [style.dpBoxGroupWrap];
        const verticalClass = [];

        if (!this.props.labelFrom) {
            boxStylesFrom.push(style.dpNoLabel);
        }
        if (!this.props.labelTo) {
            boxStylesTo.push(style.dpNoLabel);
        }
        if (!this.props.masterLabel) {
            boxGroupStyles.push(style.dpNoMasterLabel);
        }
        if (this.getContextStyles('dpBoxGroupWrap')) {
            boxGroupStyles.push(this.getContextStyles('dpBoxGroupWrap'));
        }
        if (this.props.withVerticalClass) {
            verticalClass.push(style.verticalWrapper);
        }
        if (this.props.withVerticalClass && this.getContextStyles('dpBoxGroupWrapVertical')) {
            verticalClass.push(this.getContextStyles('dpBoxGroupWrapVertical'));
        }

        const fromDate = this.from
            ? new Date(this.state.startDate)
            : new Date();
        const toDate = this.to
            ? new Date(this.state.endDate)
            : new Date();

        return (
            <div className={classnames(style.dpBoxWrap, this.getContextStyles('dpBoxWrap'), verticalClass)}>
                {this.props.masterLabel ? (<span className={classnames(style.masterLabel, this.getContextStyles('masteLabelStyle'))}>{this.props.masterLabel}</span>) : ''}
                <div className={classnames.apply(undefined, boxGroupStyles)}>
                    <div className={classnames(style.dpWrap, style.dpHalf, this.context.implementationStyle.dpWrap)}>
                        {this.props.labelFrom ? (<span className={style.label}><Text>{this.props.labelFrom}</Text></span>) : ''}
                        <div className={classnames.apply(undefined, boxStylesFrom)}>
                            <input value={this.from ? this.formatDate(fromDate) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('from')} />
                            <button onClick={this.handleOpen('from')} />
                        </div>
                    </div>
                    <div className={classnames(style.dpWrap, style.dpHalf, this.context.implementationStyle.dpWrap, style.last)}>
                        {this.props.labelTo ? (<span className={style.label}><Text>{this.props.labelTo}</Text></span>) : ''}
                        <div className={classnames.apply(undefined, boxStylesTo)}>
                            <input value={this.to ? this.formatDate(toDate) : ''} type='text' onChange={noop} onKeyUp={this.handleKeyPress('to')} />
                            <button onClick={this.handleOpen('to')} />
                        </div>
                    </div>
                </div>
                <DatePickerDialog
                    cancelLabel={this.props.cancelLabel}
                    okLabel={this.props.okLabel}
                    container={this.props.container}
                    initialFocusedDate={fromDate}
                    mode={this.props.mode}
                    onAccept={this.handleAccept('from')}
                    onChange={(date) => { this.setState({startDate: date}); }}
                    variant='dialog'
                    ref='fromDialogWindow'
                    TextFieldComponent={() => null}
                    onOpen={this.handleOpen('from')}
                    onClose={this.handleClose('from')}
                    open={this.state.fromDialogWindow}
                    maxDate={this.state.endDate || this.props.maxDate}
                />
                <DatePickerDialog
                    cancelLabel={this.props.cancelLabel}
                    okLabel={this.props.okLabel}
                    container={this.props.container}
                    initialFocusedDate={toDate}
                    mode={this.props.mode}
                    onAccept={this.handleAccept('to')}
                    onChange={(date) => { this.setState({endDate: date}); }}
                    variant='dialog'
                    ref='toDialogWindow'
                    TextFieldComponent={() => null}
                    onOpen={this.handleOpen('to')}
                    onClose={this.handleClose('to')}
                    open={this.state.toDialogWindow}
                    maxDate={this.props.maxDate}
                    minDate={this.state.startDate || undefined}
                />
            </div>
        );
    }
}

DatePickerBetween.defaultProps = {
    mode: 'landscape',
    container: 'dialog',
    withVerticalClass: false,
    dateFormat: 'yyyy-MM-dd'
};
DatePickerBetween.propTypes = {
    defaultValue: PropTypes.shape({
        from: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
        to: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string])
    }),
    maxDate: PropTypes.object,
    locale: PropTypes.string,
    okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    cancelLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    container: PropTypes.oneOf(['dialog', 'inline']),
    mode: PropTypes.oneOf(['landscape', 'portrait']),
    withVerticalClass: PropTypes.bool,
    masterLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelTo: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    dateFormat: PropTypes.string,
    transformDate: PropTypes.func,
    onChange: PropTypes.func.isRequired
};

DatePickerBetween.contextTypes = {
    implementationStyle: PropTypes.object
};
