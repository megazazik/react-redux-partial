import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window: jsWindow } = jsdom;

function copyProps(src: any, target: any) {
	Object.defineProperties(target, {
		...Object.getOwnPropertyDescriptors(src),
		...Object.getOwnPropertyDescriptors(target),
	});
}

global.window = jsWindow as any;
global.document = jsWindow.document;
global.navigator = {
	userAgent: 'node.js',
} as any;
global.requestAnimationFrame = function (callback: any) {
	return setTimeout(callback, 0);
} as any;
global.cancelAnimationFrame = function (id: any) {
	clearTimeout(id);
};
copyProps(window, global);

configure({ adapter: new Adapter() });
