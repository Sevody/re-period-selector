import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import '../css/periodSelector.less';

const propTypes = {
    nodeId: PropTypes.string, // 自定义 id
    baseClassName: PropTypes.string, // 自定义 classname
    labelText: PropTypes.string, // 自定义 label
    value: PropTypes.string, // 当前            日期
    periodOptions: PropTypes.array, // 周期
    processValue: PropTypes.func, // 值显示的处理函数
    onChange: PropTypes.func.isRequired, // 日期改变后的回调函数
};

const defaultProps = {
    nodeId: `date-selector-${Date.now()}`,
    baseClassName: 'period-selector',
    labelText: '周期',
    value: '每月1号',
    periodOptions: ['每月', '每周'],
    options: [Array.apply(null, Array(28)).map((x, i) => `${++i}日`), ['星期一', '星期二', '星期三', '星期四', '星期五']],
    processValue: (value, period, periodOptions) => {
        if (period === 0) {
            return `${periodOptions[period]}${value.substring(0, value.length-1)}号`;
        } else {
            return `${periodOptions[period]}${value.substr(-1, 1)}`;
        }
    },
};

class PeriodSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            period: 0,
            value: props.value,
            isOpen: false,
        }
        this.mounted = true;
        this.displayValue = props.value;
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.fireChangeEvent = this.fireChangeEvent.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.value && newProps.value !== this.state.value) {
            this.setState({
                value: newProps.value,
            });
        }
    }

    componentDidMount() {
        this.isInitialied = true;
        document.addEventListener('click', this.handleDocumentClick, false);
        document.addEventListener('touchend', this.handleDocumentClick, false);
    }

    componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener('click', this.handleDocumentClick, false);
        document.removeEventListener('touchend', this.handleDocumentClick, false);
    }

    handleMouseDown(event) {
        if (event.type === 'mousedown' && event.button !== 0) return;
        event.stopPropagation();
        event.preventDefault();
        this.setState({ isOpen: !this.state.isOpen });
    }

    setValue(value) {
        const { processValue, periodOptions } = this.props;
        const { period } = this.state;
        let newState = {
            value: processValue(value, period, periodOptions),
            period: period,
            isOpen: false,
        };
        this.fireChangeEvent(newState);
        this.setState(newState);
    }

    setPeriod(period) {
        let newState = {
            period,
            value: this.state.value,
            isOpen: true,
        };
        this.fireChangeEvent(newState);
        this.setState(newState);
    }

    fireChangeEvent(newState) {
        if (newState.value !== this.state.value && this.props.onChange) {
            this.props.onChange(newState.value);
        };
    }

    buildMenu() {
        let { baseClassName, periodOptions, options } = this.props;
        let { period } = this.state;
        let title = periodOptions.map((item, index) => {
            let state = period == index ? 'active' : '';
            return (
                <div
                    key={index}
                    className={`${baseClassName}-period ${state}`}
                    onMouseDown={this.setPeriod.bind(this, index)}
                    onClick={this.setPeriod.bind(this, index)}
                >
                    {item}
                </div>
            );
        });
        let ops = options[period].map((option, key) => {
            return (
                <div
                    key={key}
                    className={`${this.props.baseClassName}-option`}
                    onMouseDown={this.setValue.bind(this, option)}
                    onClick={this.setValue.bind(this, option)}
                >
                    {option}
                </div>
            );
        });
        return (
            <div className={`${baseClassName}-menu`}>
                <div className={`${baseClassName}-title`}>
                    {title}
                </div>
                <div className={`${baseClassName}-options`}>
                    {ops}
                </div>
            </div>
        );
    }

    handleDocumentClick(event) {
        if (this.mounted) {
            if (!ReactDOM.findDOMNode(this).contains(event.target)) {
                this.setState({ isOpen: false });
            }
        }
    }

    render() {
        const { baseClassName, labelText, nodeId } = this.props;
        let menu = this.state.isOpen ? this.buildMenu() : null;
        let periodSelectorClass = `${baseClassName}-root ${this.state.isOpen ? 'is-open' : ''}`;
        return (
            <div className={periodSelectorClass}>
                <div className={`${baseClassName}-bar`} id={nodeId} onMouseDown={this.handleMouseDown} onTouchEnd={this.handleMouseDown}>
                    <span className={`${baseClassName}-label`}>{labelText}</span>
                    <span className={`${baseClassName}-value`}>{this.state.value}</span>
                    <span className={`${baseClassName}-arrow`} />
                </div>
                {menu}
            </div>
        );
    }
}

PeriodSelector.propTypes = propTypes;
PeriodSelector.defaultProps = defaultProps;

export default PeriodSelector;
