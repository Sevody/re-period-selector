# re-period-selector

a react compoent for period 

## Usage
```javascript
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
```

## API

| props         | type                   | description   |
| ------------- | ---------------------- | ------------- |
| nodeId        | React.PropTypes.string | 自定义 id        |
| baseClassName | React.PropTypes.string | 自定义 classname |
| labelText     | React.PropTypes.string | 自定义 label     |
| value         | React.PropTypes.string | 当前显示的日期       |
| periodOptions | React.PropTypes.array  | 可选择的周期        |
| options       | React.PropTypes.array  | 自定义周期值        |
| processValue  | React.PropTypes.func   | 值显示的处理函数      |
| onChange      | React.PropTypes.func.isRequired   | 日期改变后的回调函数    |

## LICENSE

MIT
