import { expectType, expectError } from 'tsd';
import { createStore, AnyAction } from 'redux';
import * as React from 'react';
import { createConnects, OverrideStoreProvider } from '..';

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

export function originContextObject() {
	expectType<JSX.Element>(<OverrideStoreProvider fields={{ f1: true }} />);
}

export function originContextObjectSelect() {
	expectType<JSX.Element>(
		<OverrideStoreProvider fields={{ f1: true }} select={(s) => s.v10} />
	);
}

export function originContextString() {
	expectType<JSX.Element>(<OverrideStoreProvider fields="f1" />);
}

export function originContextStringSelect() {
	expectType<JSX.Element>(
		<OverrideStoreProvider fields="f1" select={(s) => s.v10} />
	);
}

export function contextObject() {
	expectType<JSX.Element>(
		<OverrideStoreProvider context={context} fields={{ f1: true }} />
	);
}

export function contextObjectSelect() {
	expectType<JSX.Element>(
		<OverrideStoreProvider
			context={context}
			fields={{ f1: true }}
			select={(s) => {
				expectType<Pick<ITestState, 'f1'>>(s);
				return s.f1;
			}}
		/>
	);
}

export function contextString() {
	expectType<JSX.Element>(
		<OverrideStoreProvider context={context} fields="f1" />
	);
}

export function contextStringSelect() {
	expectType<JSX.Element>(
		<OverrideStoreProvider
			context={context}
			fields="f1"
			select={(s) => {
				expectType<ITestState['f1']>(s);
				return s.value;
			}}
		/>
	);
}

// Errors

export function originContextWithoutParams() {
	expectError(<OverrideStoreProvider />);
}

export function contextObjectWrongField() {
	expectError(
		<OverrideStoreProvider context={context} fields={{ f10: true }} />
	);
}

export function contextObjectSelectWrongField() {
	expectError(
		<OverrideStoreProvider
			context={context}
			fields={{ f10: true }}
			select={(s) => s}
		/>
	);
}

export function contextStringWrongField() {
	expectError(<OverrideStoreProvider context={context} fields="f99" />);
}

export function contextStringSelectWrongField() {
	expectError(
		<OverrideStoreProvider
			context={context}
			fields="f99"
			select={(s) => s}
		/>
	);
}
