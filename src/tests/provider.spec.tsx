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

tape('Provider. Store', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<ITestState>();

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
	t.deepEqual(setContext.args[0][0].getState(), store.getState());

	t.end();
});

tape('Provider. Context', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<ITestState>();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<ParentProvider store={store}>
			<Provider context={parentContext}>
				<Stub />
			</Provider>
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.equal(typeof setContext.args[0][0].getPartial, 'function');
	t.deepEqual(setContext.args[0][0].getState(), store.getState());

	t.end();
});

tape('Provider. Context. Same store after render', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<ITestState>();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	class TestComponent extends React.Component {
		render() {
			return (
				<ParentProvider store={store}>
					<Provider context={parentContext}>
						<Stub />
					</Provider>
				</ParentProvider>
			);
		}
	}

	const wrapper = mount(<TestComponent />);

	wrapper.instance().forceUpdate();

	t.ok(setContext.calledTwice);
	t.deepEqual(setContext.args[1][0], setContext.args[0][0]);

	t.end();
});

// tape('Provider. Context with select', (t) => {
// 	const setContext = spy();

// 	const { Provider, useStore } = createConnects<
// 		Pick<ITestState, 'f1' | 'f2'>
// 	>();

// 	const store = getStore();

// 	const Stub = () => {
// 		const value = useStore();
// 		setContext(value);
// 		return <span />;
// 	};

// 	render(
// 		<ParentProvider store={store}>
// 			<Provider
// 				context={parentContext}
// 				select={(s) => ({ f1: s.f1, f2: s.f2 })}
// 			>
// 				<Stub />
// 			</Provider>
// 		</ParentProvider>
// 	);
// 	t.ok(setContext.calledOnce);
// 	t.equal(setContext.args[0][0].getState(), {
// 		f1: { value: 'f1Value' },
// 		f2: 'f2string',
// 	});

// 	t.end();
// });

tape('Provider. Context with fields', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<
		Pick<ITestState, 'f1' | 'f2'>
	>();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<ParentProvider store={store}>
			<Provider context={parentContext} fields={{ f1: true, f2: true }}>
				<Stub />
			</Provider>
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), {
		f1: { value: 'f1Value' },
		f2: 'f2string',
	});

	t.end();
});

tape('Provider. Context with fields. Same store after render', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<
		Pick<ITestState, 'f1' | 'f2'>
	>();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	class TestComponent extends React.Component {
		render() {
			return (
				<ParentProvider store={store}>
					<Provider
						context={parentContext}
						fields={{ f1: true, f2: true }}
					>
						<Stub />
					</Provider>
				</ParentProvider>
			);
		}
	}

	const wrapper = mount(<TestComponent />);

	wrapper.instance().forceUpdate();

	t.ok(setContext.calledTwice);
	t.deepEqual(setContext.args[1][0], setContext.args[0][0]);

	t.end();
});

tape('Provider. Context with fields as string', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<ITestState['f1']>();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<ParentProvider store={store}>
			<Provider context={parentContext} fields="f1">
				<Stub />
			</Provider>
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), { value: 'f1Value' });

	t.end();
});

tape('Provider. Context with fields and select', (t) => {
	const setContext = spy();

	const { Provider, useStore } = createConnects<ITestState['f4']['v2']>();

	const store = getStore();

	const Stub = () => {
		const value = useStore();
		setContext(value);
		return <span />;
	};

	render(
		<ParentProvider store={store}>
			<Provider context={parentContext} fields="f4" select={(s) => s.v2}>
				<Stub />
			</Provider>
		</ParentProvider>
	);
	t.ok(setContext.calledOnce);
	t.deepEqual(setContext.args[0][0].getState(), { value: 21, value2: 65 });

	t.end();
});

tape(
	'Provider. Context with fields and select. Same store after render',
	(t) => {
		const setContext = spy();

		const { Provider, useStore } = createConnects<ITestState['f4']['v2']>();

		const store = getStore();

		const Stub = () => {
			const value = useStore();
			setContext(value);
			return <span />;
		};

		const select = (s: ITestState['f4']) => s.v2;
		class TestComponent extends React.Component {
			render() {
				return (
					<ParentProvider store={store}>
						<Provider
							context={parentContext}
							fields="f4"
							select={select}
						>
							<Stub />
						</Provider>
					</ParentProvider>
				);
			}
		}

		const wrapper = mount(<TestComponent />);

		wrapper.instance().forceUpdate();

		t.ok(setContext.calledTwice);
		t.deepEqual(setContext.args[1][0], setContext.args[0][0]);

		t.end();
	}
);

/** @todo write test of incorrect params */
// tape('Provider. Context without provider', (t) => {
// 	class ErrorBoundary extends React.Component<{}, { error: boolean }> {
// 		state = { error: false };

// 		static onError = spy();

// 		static getDerivedStateFromError() {
// 			return { error: true };
// 		}

// 		componentDidCatch() {
// 			ErrorBoundary.onError();
// 		}

// 		render() {
// 			if (this.state.error) {
// 				return <h1>Что-то пошло не так.</h1>;
// 			}

// 			return this.props.children;
// 		}
// 	}

// 	const setContext = spy();

// 	const { Provider, useStore } = createConnects<ITestState>();

// 	const Stub = () => {
// 		const value = useStore();
// 		setContext(value);
// 		return <span />;
// 	};

// 	render(
// 		<ErrorBoundary>
// 			<Provider context={null as any}>
// 				<Stub />
// 			</Provider>
// 		</ErrorBoundary>
// 	);

// 	t.end();
// });
