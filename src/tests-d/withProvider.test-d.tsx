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

const { context } = createConnects<ITestState>();

const StubComponent = (props: { text: string }) => <span>{props.text}</span>;

export function passStore() {
	const { withProvider } = createConnects<ITestState>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(<Component store={store} text="text" />);
}

export function parentContextAsKey() {
	const { withProvider } = createConnects<{ value: string }>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(
		<Component context={context} fields="f1" text="sdf" />
	);
}

export function parentContextAsKeyWithSelect() {
	const { withProvider } = createConnects<{
		value: number;
		value2: number;
	}>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={context}
			fields="f4"
			text="sdf"
			select={(s) => s.v2}
		/>
	);
}

export function parentContextAsConfig() {
	const { withProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={context}
			fields={{ f1: true, f2: true }}
			text="sdf"
		/>
	);
}

export function parentContextAsConfigWithSelect() {
	const { withProvider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(
		<Component
			context={context}
			fields={{ f1: true, f2: true }}
			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
			text="sdf"
		/>
	);
}

export function parentPartialContext() {
	const { withProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(<Component context={context} text="fsdf" />);
}

export function parentContext() {
	const { withProvider } = createConnects<ITestState>();

	const Component = withProvider(StubComponent);

	expectType<JSX.Element>(<Component context={context} text="fsdf" />);
}

// export function parentPartialContextWithSelect() {
// 	const { withPartialStoreProvider } = createConnects<{
// 		f1: string;
// 		f2: string;
// 	}>();

// 	const Component = withPartialStoreProvider(StubComponent);

// 	expectType<JSX.Element>(
// 		<Component
// 			context={context}
// 			select={(s) => ({ f1: s.f1.value, f2: s.f2 })}
// 			text="fsdf"
// 		/>
// 	);
// }

// Errors

export function passWrongStore() {
	const { withProvider } = createConnects<ITestState>();

	const Component = withProvider((props: { text: string }) => (
		<span>{props.text}</span>
	));

	expectError(<Component store={123} text="text" />);
}

export function passWrongProps() {
	const { withProvider } = createConnects<ITestState>();

	const Component = withProvider((props: { text: string }) => (
		<span>{props.text}</span>
	));

	expectError(<Component store={store} />);
}

export function wrongTypeOfState() {
	const reducer = () => ({ value1: 'sdfs' });

	const store = createStore(reducer);

	const { withProvider } = createConnects<ITestState>();

	const Component = withProvider((props: { text: string }) => (
		<span>{props.text}</span>
	));

	expectError(<Component store={store} text="text" />);
}

export function wrongParentContextAsKey() {
	const { withProvider } = createConnects<{ value: string }>();

	const Component = withProvider(StubComponent);

	expectError(<Component context={context} fields="f1" />);

	expectError(<Component context={context} fields="f2" text="sdf" />);
	expectError(<Component context={context} fields="f3" text="sdf" />);
}

export function wrongParentContextAsKeyWithSelect() {
	const { withProvider } = createConnects<{ value: number }>();

	const Component = withProvider(StubComponent);

	expectError(
		<Component context={context} fields="f4" select={(s) => s.v1} text="" />
	);
	expectError(
		<Component
			context={context}
			fields="f4"
			select={(s: ITestState['f4']) => s.v2}
		/>
	);
}

export function wrongParentContextAsConfig() {
	const { withProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectError(
		<Component context={context} fields={{ f1: true, f3: true }} text="" />
	);
	expectError(
		<Component context={context} fields={{ f1: true, f2: true }} />
	);
}

export function wrongParentContextAsConfigWithSelect() {
	const { withProvider } = createConnects<{
		f1: string;
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectError(
		<Component
			context={context}
			fields={{ f1: true, f2: true }}
			select={(s) => ({ f1: s.f1, f2: s.f2 })}
			text=""
		/>
	);
	expectError(
		<Component
			context={context}
			fields={{ f1: true, f2: true }}
			select={(s: Pick<ITestState, 'f1' | 'f2'>) => ({
				f1: s.f1.value,
				f2: s.f2,
			})}
		/>
	);
}

export function wrongParentPartialContext() {
	const { withProvider } = createConnects<{
		f1: { value: number };
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectError(<Component context={context} text="" />);
}

export function wrongParentPartialContextWithoutProp() {
	const { withProvider } = createConnects<{
		f1: { value: string };
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectError(<Component context={context} />);
}

export function wrongParentPartialContextWithSelect() {
	const { withProvider } = createConnects<{
		f1: number;
		f2: string;
	}>();

	const Component = withProvider(StubComponent);

	expectError(
		<Component
			context={context}
			select={(s: ITestState) => ({ f1: s.f1.value, f2: s.f2 })}
			text=""
		/>
	);

	expectError(
		<Component
			context={context}
			select={(s: ITestState) => ({ f1: Number(s.f1.value), f2: s.f2 })}
			text={123}
		/>
	);
}
