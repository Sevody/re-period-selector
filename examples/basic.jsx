import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PeriodSelector from '../index';

class Basic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            period: '每周一',
        };
        this.onPeriodSelected = this.onPeriodSelected.bind(this);
    }
    onPeriodSelected(value) {
        this.setState({period: value});
    }
    render() {

        return <PeriodSelector
            labelText="周期"
            periodOptions={['每月', '每周']}
            value={this.state.period}
            onChange={this.onPeriodSelected}
            />
    }
}

ReactDOM.render(<Basic />, document.getElementById('root'));
