import d3 from 'd3';
import BaseChart from './base-chart';

class VolumeChart extends BaseChart {
    setMinMaxValues() {
        const values = Object.values(this.data);
        this.minVal = 0;
        this.maxVal = d3.max(values);
        if (this.maxVal == 0) this.maxVal = 10;
	}
}

export default VolumeChart;