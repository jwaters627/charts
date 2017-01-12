import {format} from 'd3';

const oneDecPercent = format('.1%');
const defaultPercent = v => oneDecPercent(v).replace('100.0', '100');

export {defaultPercent}
