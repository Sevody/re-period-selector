import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import './PeriodSelector.less';

const propTypes = {
    nodeId: PropTypes.string, // 自定义 id
    baseClassName: PropTypes.string, // 自定义 classname
    labelText: PropTypes.string, // 自定义 label
    value: PropTypes.string, // 当前            日期
    periodOptions: PropTypes.array, // 周期
    options: PropTypes.array, // 周期值
    processValue: PropTypes.func, // 值显示的处理函数
    onChange: PropTypes.func.isRequired, // 日期改变后的回调函数
};

const defaultProps = {
    nodeId: `date-selector-${Date.now()}`,
    baseClassName: 'period-selector',
    labelText: '周期',
    value: '每月1号',
    periodOptions: ['每月', '每周'],
    options: [Array(...Array(28)).map((x, i) => `${++i}日`), ['星期一', '星期二', '星期三', '星期四', '星期五']],
    processValue: (value, period, periodOptions) => {
        if (period === 0) {
            return `${periodOptions[period]}${value.substring(0, value.length - 1)}号`;
        }
        return `${periodOptions[period]}${value.substr(-1, 1)}`;
    },
};

class PeriodSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            period: 0,
            value: props.value,
            isOpen: false,
        };
        this.mounted = true;
        this.displayValue = props.value;
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.fireChangeEvent = this.fireChangeEvent.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
    }

    componentDidMount() {
        this.isInitialied = true;
        document.addEventListener('click', this.handleDocumentClick, false);
        document.addEventListener('touchend', this.handleDocumentClick, false);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.value && newProps.value !== this.state.value) {
            this.setState({
                value: newProps.value,
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener('click', this.handleDocumentClick, false);
        document.removeEventListener('touchend', this.handleDocumentClick, false);
    }

    setValue(value) {
        const { processValue, periodOptions } = this.props;
        const { period } = this.state;
        const newState = {
            value: processValue(value, period, periodOptions),
            period,
            isOpen: false,
        };
        this.fireChangeEvent(newState);
        this.setState(newState);
    }

    setPeriod(period) {
        const newState = {
            period,
            value: this.state.value,
            isOpen: true,
        };
        this.fireChangeEvent(newState);
        this.setState(newState);
    }

    handleMouseDown(event) {
        if (event.type === 'mousedown' && event.button !== 0) return;
        event.stopPropagation();
        event.preventDefault();
        this.setState({ isOpen: !this.state.isOpen });
    }

    fireChangeEvent(newState) {
        if (newState.value !== this.state.value && this.props.onChange) {
            this.props.onChange(newState.value);
        }
    }

    buildMenu() {
        const { baseClassName, periodOptions, options } = this.props;
        const { period } = this.state;
        const title = periodOptions.map((item, index) => {
            const state = period === index ? 'active' : '';
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
        const ops = options[period].map((option, key) => (
            <div
              key={key}
              className={`${this.props.baseClassName}-option`}
              onMouseDown={this.setValue.bind(this, option)}
              onClick={this.setValue.bind(this, option)}
            >
                {option}
            </div>
            ));
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
        const menu = this.state.isOpen ? this.buildMenu() : null;
        const periodSelectorClass = `${baseClassName}-root ${this.state.isOpen ? 'is-open' : ''}`;
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
