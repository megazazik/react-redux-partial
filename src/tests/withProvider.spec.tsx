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

tape('withProvider. Store', (t) => {
	const setContext = spy();

	const { withProvider, useStore } = createConnects<ITestState>();

	const store = getStore();

	const Stub = withProvider(() => {
		const value = useStore();
		setContext(value);
		return <span />;
	});

	render(<Stub store={store} />);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), store.getState());

	t.end();
});

tape('withProvider. Context', (t) => {
	const setContext = spy();

	const { withProvider, useStore } = createConnects<ITestState>();

	const store = getStore();

	const Stub = withProvider(() => {
		const value = useStore();
		setContext(value);
		return <span />;
	});

	render(
		<ParentProvider store={store}>
			<Stub context={parentContext} />
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), store.getState());

	t.end();
});

tape('withProvider. Context with fields', (t) => {
	const setContext = spy();

	const { withProvider, useStore } = createConnects<
		Pick<ITestState, 'f1' | 'f2'>
	>();

	const store = getStore();

	const Stub = withProvider(({ v }: { v: string }) => {
		const value = useStore();
		setContext(value);
		return <span>{v}</span>;
	});

	render(
		<ParentProvider store={store}>
			<Stub
				context={parentContext}
				fields={{ f1: true, f2: true }}
				v="sdf"
			/>
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), {
		f1: { value: 'f1Value' },
		f2: 'f2string',
	});

	t.end();
});

tape('withProvider. Context with fields as string', (t) => {
	const setContext = spy();

	const { withProvider, useStore } = createConnects<ITestState['f1']>();

	const store = getStore();

	const Stub = withProvider(() => {
		const value = useStore();
		setContext(value);
		return <span />;
	});

	render(
		<ParentProvider store={store}>
			<Stub context={parentContext} fields="f1" />
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), { value: 'f1Value' });

	t.end();
});

tape('withProvider. Context with fields and select', (t) => {
	const setContext = spy();

	const { withProvider, useStore } = createConnects<ITestState['f4']['v2']>();

	const store = getStore();

	const Stub = withProvider(() => {
		const value = useStore();
		setContext(value);
		return <span />;
	});

	render(
		<ParentProvider store={store}>
			<Stub context={parentContext} fields="f4" select={(s) => s.v2} />
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), { value: 21, value2: 65 });

	t.end();
});
