import { render, mount } from 'enzyme';
import tape from 'tape';
import { spy } from 'sinon';

import * as React from 'react';
import { createStore } from 'redux';
import { useStore, Provider as OriginProvider } from 'react-redux';
import { makePartial } from 'redux-partial';

import { Provider, OverrideStoreProvider, createConnects } from '..';
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

tape('OriginProvider. Pass origin store', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<Provider store={store}>
			<Stub />
		</Provider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), store.getState());

	t.end();
});

tape('OriginProvider. Pass partial store', (t) => {
	const setContext = spy();

	const store = makePartial(getStore());

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<Provider store={store}>
			<Stub />
		</Provider>
	);
	t.ok(setContext.calledOnce);
	t.equal(setContext.args[0][0], store);

	t.end();
});

tape('OriginProvider. Pass origin store. Same store after rerender', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	class TestComponent extends React.Component {
		render() {
			return (
				<Provider store={store}>
					<Stub />
				</Provider>
			);
		}
	}

	const wrapper = mount(<TestComponent />);

	wrapper.instance().forceUpdate();

	t.ok(setContext.calledTwice);
	t.deepEqual(setContext.args[1][0], setContext.args[0][0]);

	t.end();
});

tape('OverrideProvider. Origin context. Object', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<OriginProvider store={store}>
			<OverrideStoreProvider fields={{ f1: true }}>
				<Stub />
			</OverrideStoreProvider>
		</OriginProvider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), { f1: { value: 'f1Value' } });

	t.end();
});

tape('OverrideProvider. Origin context. Object. Select', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<OriginProvider store={store}>
			<OverrideStoreProvider fields={{ f1: true }} select={(s) => s.f1}>
				<Stub />
			</OverrideStoreProvider>
		</OriginProvider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), { value: 'f1Value' });

	t.end();
});

tape('OverrideProvider. Origin context. String', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<OriginProvider store={store}>
			<OverrideStoreProvider fields="f1">
				<Stub />
			</OverrideStoreProvider>
		</OriginProvider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), { value: 'f1Value' });

	t.end();
});

tape('OverrideProvider. Origin context. String. Select', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<OriginProvider store={store}>
			<OverrideStoreProvider fields="f1" select={(s) => s.value}>
				<Stub />
			</OverrideStoreProvider>
		</OriginProvider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), 'f1Value');

	t.end();
});

tape('OverrideProvider. Partial context. Object', (t) => {
	const setContext = spy();

	const store = getStore();

	const { Provider, context } = createConnects<ITestState>();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<Provider store={store}>
			<OverrideStoreProvider context={context} fields={{ f1: true }}>
				<Stub />
			</OverrideStoreProvider>
		</Provider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), { f1: { value: 'f1Value' } });

	t.end();
});

tape('OverrideProvider. Partial context. Object. Select', (t) => {
	const setContext = spy();

	const store = getStore();

	const { Provider, context } = createConnects<ITestState>();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<Provider store={store}>
			<OverrideStoreProvider
				context={context}
				fields={{ f1: true }}
				select={(s) => s.f1}
			>
				<Stub />
			</OverrideStoreProvider>
		</Provider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), { value: 'f1Value' });

	t.end();
});

tape('OverrideProvider. Partial context. String', (t) => {
	const setContext = spy();

	const store = getStore();

	const { Provider, context } = createConnects<ITestState>();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<Provider store={store}>
			<OverrideStoreProvider context={context} fields="f1">
				<Stub />
			</OverrideStoreProvider>
		</Provider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), { value: 'f1Value' });

	t.end();
});

tape('OverrideProvider. Partial context. String. Select', (t) => {
	const setContext = spy();

	const store = getStore();

	const { Provider, context } = createConnects<ITestState>();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<Provider store={store}>
			<OverrideStoreProvider
				context={context}
				fields="f1"
				select={(s) => s.value}
			>
				<Stub />
			</OverrideStoreProvider>
		</Provider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), 'f1Value');

	t.end();
});

tape('OverrideProvider. Same store after rerender', (t) => {
	const setContext = spy();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	class TestComponent extends React.Component {
		render() {
			return (
				<Provider store={store}>
					<OverrideStoreProvider fields="f1">
						<Stub />
					</OverrideStoreProvider>
				</Provider>
			);
		}
	}

	const wrapper = mount(<TestComponent />);

	wrapper.instance().forceUpdate();

	t.ok(setContext.calledTwice);
	t.deepEqual(setContext.args[1][0], setContext.args[0][0]);

	t.end();
});
