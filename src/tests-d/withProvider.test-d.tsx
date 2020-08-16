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

const { Context } = createConnects<ITestState>();

const StubComponent = (props: { text: string }) => <span>{props.text}</span>;

export function passStore() {
	const { withPartialStoreProvider } = createConnects<ITestState>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(<Component store={store} text="text" />);
}

export function parentContextAsKey() {
	const { withPartialStoreProvider } = createConnects<{ value: string }>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(
		<Component context={Context} fields="f1" text="sdf" />
	);
}

export function parentContextAsKeyWithSelect() {
	const { withPartialStoreProvider } = createConnects<{
		value: number;
		value2: number;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={Context}
			fields="f4"
			text="sdf"
			select={(s) => s.v2}
		/>
	);
}

export function parentContextAsConfig() {
	const { withPartialStoreProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={Context}
			fields={{ f1: true, f2: true }}
			text="sdf"
		/>
	);
}

export function parentContextAsConfigWithSelect() {
	const { withPartialStoreProvider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={Context}
			fields={{ f1: true, f2: true }}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
			text="sdf"
		/>
	);
}

export function parentPartialContext() {
	const { withPartialStoreProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(<Component context={Context} text="fsdf" />);
}

export function parentContext() {
	const { withPartialStoreProvider } = createConnects<ITestState>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(<Component context={Context} text="fsdf" />);
}

export function parentPartialContextWithSelect() {
	const { withPartialStoreProvider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={Context}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
			text="fsdf"
		/>
	);
}

// Errors

export function passWrongStore() {
	const { withPartialStoreProvider } = createConnects<ITestState>();

	const Component = withPartialStoreProvider((props: { text: string }) => (
		<span>{props.text}</span>
	));

	expectError(<Component store={123} text="text" />);
}

export function passWrongProps() {
	const { withPartialStoreProvider } = createConnects<ITestState>();

	const Component = withPartialStoreProvider((props: { text: string }) => (
		<span>{props.text}</span>
	));

	expectError(<Component store={store} />);
}

export function wrongTypeOfState() {
	const reducer = () => ({ value1: 'sdfs' });

	const store = createStore(reducer);

	const { withPartialStoreProvider } = createConnects<ITestState>();

	const Component = withPartialStoreProvider((props: { text: string }) => (
		<span>{props.text}</span>
	));

	expectError(<Component store={store} text="text" />);
}

export function wrongParentContextAsKey() {
	const { withPartialStoreProvider } = createConnects<{ value: string }>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(<Component context={Context} fields="f1" />);

	/** @todo разобраться, почему нет ошибки */
	// expectError(<Component context={Context} fields="f2" text="sdf" />);
	expectError(<Component context={Context} fields="f3" text="sdf" />);
}

export function wrongParentContextAsKeyWithSelect() {
	const { withPartialStoreProvider } = createConnects<{ value: number }>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(
		<Component context={Context} fields="f4" select={(s) => s.v1} text="" />
	);
	expectError(
		<Component
			context={Context}
			fields="f4"
			select={(s: ITestState['f4']) => s.v2}
		/>
	);
}

export function wrongParentContextAsConfig() {
	const { withPartialStoreProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(
		<Component context={Context} fields={{ f1: true, f3: true }} text="" />
	);
	expectError(
		<Component context={Context} fields={{ f1: true, f2: true }} />
	);
}

export function wrongParentContextAsConfigWithSelect() {
	const { withPartialStoreProvider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(
		<Component
			context={Context}
			fields={{ f1: true, f2: true }}
			select={(s) => ({ f1: s.f1, f2: s.f2 })}
			text=""
		/>
	);
	expectError(
		<Component
			context={Context}
			fields={{ f1: true, f2: true }}
			select={(s: Pick<ITestState, 'f1' | 'f2'>) => ({
				f1: s.f1.value,
				f2: s.f2,
			})}
		/>
	);
}

export function wrongParentPartialContext() {
	const { withPartialStoreProvider } = createConnects<{
		f1: { value: number };
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(<Component context={Context} text="" />);
}

export function wrongParentPartialContextWithoutProp() {
	const { withPartialStoreProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(<Component context={Context} />);
}

export function wrongParentPartialContextWithSelect() {
	const { withPartialStoreProvider } = createConnects<{
		f1: number;
		f2: string;
	}>();

	const Component = withPartialStoreProvider(StubComponent);

	expectError(
		<Component
			context={Context}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
			text=""
		/>
	);

	expectError(
		<Component
			context={Context}
			select={(s: ITestState) => ({ f1: Number(s.f1.value), f2: s.f2 })}
			text={123}
		/>
	);
}
