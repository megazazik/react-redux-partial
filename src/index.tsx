import React, {
	createContext,
	Context,
	FunctionComponent,
	ReactElement,
	Key,
} from 'react';
import {
	Provider as BaseProvider,
	ReactReduxContextValue,
	createStoreHook,
	createSelectorHook,
	createDispatchHook,
	connect,
	Connect,
} from 'react-redux';
import { Store, AnyAction } from 'redux';
import {
	makePartial,
	PartialStore,
	FieldConfig,
	PartialState,
} from 'redux-partial';

export type TypeGuard<K, Current, Expected> = Current extends Expected
	? K
	: Current;

type OmitContextProps<P> = Omit<P, 'context' | 'fields' | 'select' | 'store'>;

type ComponentWithPartialStoreProps<S, P = {}> = {
	<TParentState, K extends keyof TParentState>(
		props: OmitContextProps<P> & {
			context: Context<ReactReduxContextValue<TParentState, AnyAction>>;
			fields: K;
			select: (p: TParentState[K]) => S;
		}
	): ReactElement | null;

	<TParentState, K extends keyof TParentState>(
		props: OmitContextProps<P> & {
			context: Context<ReactReduxContextValue<TParentState, AnyAction>>;
			fields: K & TypeGuard<K, TParentState[K], S>;
		}
	): ReactElement | null;

	<TParentState, Keys extends FieldConfig<TParentState>>(
		props: OmitContextProps<P> & {
			context: Context<ReactReduxContextValue<TParentState, AnyAction>>;
			fields: Keys;
			select: (p: PartialState<TParentState, Keys>) => S;
		}
	): ReactElement | null;

	<TParentState, Keys extends FieldConfig<TParentState>>(
		props: OmitContextProps<P> & {
			context: Context<ReactReduxContextValue<TParentState, AnyAction>>;
			fields: Keys & TypeGuard<Keys, PartialState<TParentState, Keys>, S>;
		}
	): ReactElement | null;

	<TParentState>(
		props: OmitContextProps<P> & {
			context: Context<ReactReduxContextValue<TParentState, AnyAction>>;
			select: (s: TParentState) => S;
		}
	): ReactElement | null;

	<TParentState extends S>(
		props: OmitContextProps<P> & {
			context: Context<ReactReduxContextValue<TParentState, AnyAction>>;
		}
	): ReactElement | null;

	(
		props: OmitContextProps<P> & {
			store: Store<S> | PartialStore<S, AnyAction>;
		}
	): ReactElement | null;
};

export type Provider<S> = ComponentWithPartialStoreProps<S>;

export type WrappedWithPatrialStore<S, P> = ComponentWithPartialStoreProps<
	S,
	P
>;

/** @todo add forward ref */
export type WithPartialStoreProvider<S> = <P>(
	Component: React.ComponentType<P>
) => WrappedWithPatrialStore<S, P>;

export function createConnects<S>() {
	const Context = createContext<ReactReduxContextValue<S>>(
		(null as unknown) as ReactReduxContextValue<S>
	);

	/** Providers */

	/**
	 * To set context value with partial store or
	 * to set context value with parent context and store part
	 */

	/** @todo реализовать */
	const Provider: Provider<S> = () => (null as unknown) as ReactElement;

	/** HOCs */

	/**
	 * Connect to partial store
	 *
	 * Set context value if it is passed
	 *
	 * const connect = connnect (from react-redux)
	 *
	 * @todo fix type when the PR will be merged
	 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/46778
	 */

	// const connect = baseConnnect; // from react-redux

	/** @todo реализовать */
	const withPartialStoreProvider: WithPartialStoreProvider<S> = () => () =>
		null as any;

	/** Hooks */

	const useDispatch = createDispatchHook(Context);
	const useSelector = createSelectorHook(Context);
	const useStore = createStoreHook(Context);

	return {
		Context,
		Provider,
		connect,
		withPartialStoreProvider,
		useDispatch,
		useSelector,
		useStore,
	};
}

/**
 * To override origin context value
 */
/** @todo реализовать */
export const Provider: typeof BaseProvider = BaseProvider;

/**
 * To set original context value with partial store
 */
/** @todo реализовать */
export const OverrideStoreProvider: (props: {
	context?: Context<ReactReduxContextValue<any, AnyAction>>;
	fields?: FieldConfig<any> | string;
	select?: (p: any) => any;
}) => ReactElement | null = (props) => <span />;
