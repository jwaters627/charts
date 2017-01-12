import Polyglot from 'node-polyglot';
import lang from './en.js';
const polyglot = new Polyglot({phrases: lang});
export default function trans(id, vars) {
  return polyglot.t(id, vars);
}
