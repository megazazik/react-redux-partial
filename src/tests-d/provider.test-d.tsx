import { expectType, expectError } from 'tsd';
import { createStore, AnyAction } from 'redux';
import * as React from 'react';
import { createConnects } from '..';

interface ITestState {
	f1: { value: string };
	f2: string;
	f3: number;
	f4: {
		v1: boolean;
		v2: { value: number; value2: number };
	};
}

const reducer = (state: ITestState, _: AnyAction) => state;

const store = createStore(reducer);

const { Provider, Context } = createConnects<ITestState>();

expectType<JSX.Element>(<Provider store={store} />);

export function parentContextAsKey() {
	const { Provider } = createConnects<{ value: string }>();

	expectType<JSX.Element>(<Provider context={Context} fields="f1" />);
}

export function parentContextAsKeyWithSelect() {
	const { Provider } = createConnects<{ value: number }>();

	expectType<JSX.Element>(
		<Provider context={Context} fields="f4" select={(s) => s.v2} />
	);
}

export function parentContextAsConfig() {
	const { Provider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	expectType<JSX.Element>(
		<Provider context={Context} fields={{ f1: true, f2: true }} />
	);
}

export function parentContextAsConfigWithSelect() {
	const { Provider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	expectType<JSX.Element>(
		<Provider
			context={Context}
			fields={{ f1: true, f2: true }}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
		/>
	);
}

export function parentPartialContext() {
	const { Provider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	expectType<JSX.Element>(<Provider context={Context} />);
}

export function parentContext() {
	const { Provider } = createConnects<ITestState>();

	expectType<JSX.Element>(<Provider context={Context} />);
}

export function parentPartialContextWithSelect() {
	const { Provider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	expectType<JSX.Element>(
		<Provider
			context={Context}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
		/>
	);
}

// Errors

expectError(<Provider store={123} />);

export function wrongTypeOfState() {
	const reducer = () => ({ value1: 'sdfs' });

	const store = createStore(reducer);

	expectError(<Provider store={store} />);
}

export function wrongParentContextAsKey() {
	const { Provider } = createConnects<{ value: string }>();

	expectError(<Provider context={Context} fields="f4" />);
}

export function wrongParentContextAsKeyWithSelect() {
	const { Provider } = createConnects<{ value: number }>();

	expectError(
		<Provider context={Context} fields="f4" select={(s) => s.v1} />
	);
}

export function wrongParentContextAsConfig() {
	const { Provider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	expectError(<Provider context={Context} fields={{ f1: true, f3: true }} />);
}

export function wrongParentContextAsConfigWithSelect() {
	const { Provider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	expectError(
		<Provider
			context={Context}
			fields={{ f1: true, f2: true }}
			select={(s) => ({ f1: s.f1, f2: s.f2 })}
		/>
	);
}

export function wrongParentPartialContext() {
	const { Provider } = createConnects<{
		f1: { value: number };
		f2: string;
	}>();

	expectError(<Provider context={Context} />);
}

export function wrongParentPartialContextWithSelect() {
	const { Provider } = createConnects<{
		f1: number;
		f2: string;
	}>();

	expectError(
		<Provider
			context={Context}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
		/>
	);
}
