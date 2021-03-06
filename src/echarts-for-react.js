import echarts from 'echarts';
import React from 'react';

import elementResizeEvent from 'element-resize-event';

const ReactEcharts = React.createClass({
    propTypes: {
        option: React.PropTypes.object.isRequired,
        height: React.PropTypes.number.isRequired,
        theme: React.PropTypes.string,
        onChartReady: React.PropTypes.func,
        showLoading: React.PropTypes.bool,
        onEvents: React.PropTypes.object
    },
    // first add
    componentDidMount() {
        let echartObj = this.renderEchartDom();
        let onEvents = this.props.onEvents || [];

        for (let eventName in onEvents) {
            // ignore the event config which not satisfy
            if (typeof eventName === 'string' && typeof onEvents[eventName] === 'function') {
                // binding event
                echartObj.on(eventName, function(param) {onEvents[eventName](param, echartObj);});
            }
        }
        // on chart ready
        if (typeof this.props.onChartReady === 'function') this.props.onChartReady(echartObj);

        // on resize
        elementResizeEvent(this.refs.echartsDom, function() {
            echartObj.resize();
        });
    },
    // update
    componentDidUpdate() {
        this.renderEchartDom()
    },
    // remove
    componentWillUnmount() {
        echarts.dispose(this.refs.chart)
    },
    // render the dom
    renderEchartDom() {
        // init the echart object
        let echartObj = echarts.getInstanceByDom(this.refs.echartsDom) || echarts.init(this.refs.echartsDom, this.props.theme);
        // set the echart option
        echartObj.setOption(this.props.option);

        // set loading mask
        if (this.props.showLoading) echartObj.showLoading();
        else echartObj.hideLoading();

        return echartObj;
    },

    render() {
        let { height } = this.props
        // for render
        return (
            <div ref='echartsDom'
                style={{height}} />
        );
    }
});
export default ReactEcharts;