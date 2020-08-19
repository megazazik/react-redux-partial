import * as React from 'react';
import { render, mount } from 'enzyme';
import tape from 'tape';
import { createStore } from 'redux';
import { spy } from 'sinon';
import { createConnects } from '..';
import './setup';

interface ITestState {
	f1: { value: string };
	f2: string;
	f3: number;
	f4: {
		v1: boolean;
		v2: { value: number; value2: number };
	};
}

const setState = (state: ITestState) => ({
	type: 'setState',
	payload: state,
});

const reducer = (state: ITestState, action: ReturnType<typeof setState>) =>
	action.type === 'setState' ? action.payload : state;

const { Provider: ParentProvider, context: parentContext } = createConnects<
	ITestState
>();

const getStore = () =>
	createStore(reducer, {
		f1: { value: 'f1Value' },
		f2: 'f2string',
		f3: 12,
		f4: {
			v1: true,
			v2: { value: 21, value2: 65 },
		},
	});

tape('Connect. From parent context', (t) => {
	const { Provider, connect } = createConnects<ITestState>();

	const store = getStore();

	const Stub = spy(({ value }: { value: string }) => <span>{value}</span>);

	const Connected = connect((s: ITestState) => ({ value: s.f2 }))(Stub);

	render(
		<ParentProvider store={store}>
			<Provider context={parentContext}>
				<Connected />
			</Provider>
		</ParentProvider>
	);
	t.ok(Stub.calledOnce);
	t.equal(Stub.args[0][0].value, store.getState().f2);

	t.end();
});
