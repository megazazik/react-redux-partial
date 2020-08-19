import React, {
	createContext,
	Context,
	ReactElement,
	PropsWithChildren,
	useMemo,
} from 'react';
import {
	Provider as BaseProvider,
	ReactReduxContextValue,
	createStoreHook,
	createSelectorHook,
	createDispatchHook,
	connect as baseConnect,
	Connect,
	ProviderProps,
	ReactReduxContext,
	useStore,
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
	: never;

type OmitContextProps<P> = Omit<P, 'context' | 'fields' | 'select' | 'store'>;

type ComponentWithPartialStoreProps<S, P = {}> = {
	<TParentState, K extends keyof TParentState>(
		props: PropsWithChildren<
			OmitContextProps<P> & {
				context: Context<
					ReactReduxContextValue<TParentState, AnyAction>
				>;
				fields: K;
				select: (p: TParentState[K]) => S;
			}
		>
	): ReactElement | null;

	<TParentState, K extends keyof TParentState>(
		props: PropsWithChildren<
			OmitContextProps<P> & {
				context: Context<
					ReactReduxContextValue<TParentState, AnyAction>
				>;
				fields: K & TypeGuard<K, TParentState[K], S>;
			}
		>
	): ReactElement | null;

	<TParentState, Keys extends FieldConfig<TParentState>>(
		props: PropsWithChildren<
			OmitContextProps<P> & {
				context: Context<
					ReactReduxContextValue<TParentState, AnyAction>
				>;
				fields: Keys;
				select: (p: PartialState<TParentState, Keys>) => S;
			}
		>
	): ReactElement | null;

	<TParentState, Keys extends FieldConfig<TParentState>>(
		props: PropsWithChildren<
			OmitContextProps<P> & {
				context: Context<
					ReactReduxContextValue<TParentState, AnyAction>
				>;
				fields: Keys &
					TypeGuard<Keys, PartialState<TParentState, Keys>, S>;
			}
		>
	): ReactElement | null;

	/** @todo add an override without fields if it will be necessary */
	// <TParentState>(
	// 	props: PropsWithChildren<
	// 		OmitContextProps<P> & {
	// 			context: Context<
	// 				ReactReduxContextValue<TParentState, AnyAction>
	// 			>;
	// 			select: (s: TParentState) => S;
	// 		}
	// 	>
	// ): ReactElement | null;

	<TParentState extends S>(
		props: PropsWithChildren<
			OmitContextProps<P> & {
				context: Context<
					ReactReduxContextValue<TParentState, AnyAction>
				>;
			}
		>
	): ReactElement | null;

	(
		props: PropsWithChildren<
			OmitContextProps<P> & {
				store: Store<S, any> | PartialStore<S, AnyAction>;
			}
		>
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
	const partialStoreContext = createContext<ReactReduxContextValue<S>>(
		(null as unknown) as ReactReduxContextValue<S>
	);

	/**
	 * Provider
	 *
	 * To set context value with partial store or
	 * to set context value with parent context and store part
	 */
	const Provider = (({
		children,
		store,
		context,
		fields,
		select,
	}: PropsWithChildren<{
		store?: Store<any>;
		context?: Context<any>;
		fields?: string | object;
		select?: (s: any) => any;
	}>) => {
		const innerUseStore = React.useMemo(
			() => createStoreHook(context || createContext<any>(null)),
			[context]
		);

		/** @todo убрать использование хуков из под условий, иначе при смене props, может все сломаться */
		if (store) {
			const storeWithPartial = React.useMemo(
				() => ('getPartial' in store ? store : makePartial(store)),
				[store]
			);

			return (
				<BaseProvider
					context={partialStoreContext}
					store={storeWithPartial}
				>
					{children}
				</BaseProvider>
			);
		}

		if (!context) {
			throw new Error(
				'Neither store nor context has been passed as a parameter to partial store provider'
			);
		}

		const parentStore = innerUseStore();

		if (!parentStore) {
			throw new Error('No store was received via context');
		}

		const parentStoreWithPartial = React.useMemo(() => {
			if (
				((parentStore as unknown) as Partial<PartialStore<any, any>>)
					.getPartial
			) {
				return (parentStore as unknown) as PartialStore<any, any>;
			}

			return makePartial(parentStore);
		}, [parentStore]);

		const partialStore = React.useMemo(() => {
			if (!fields) {
				return parentStoreWithPartial;
			}

			return (parentStoreWithPartial as any).getPartial(fields, {
				select,
			});
		}, [
			parentStoreWithPartial,
			JSON.stringify(fields || null),
			select || null,
		]);

		return (
			<BaseProvider context={partialStoreContext} store={partialStore}>
				{children}
			</BaseProvider>
		);
	}) as Provider<S>;

	/**
	 * HOCs
	 * Connect to partial store
	 *
	 * @todo fix type when the PR will be merged
	 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/46778
	 */
	const connect = ((
		mapStateToProps: any,
		mapDispatchToProps: any,
		mergeProps: any,
		options: any = {}
	) =>
		baseConnect(mapStateToProps, mapDispatchToProps, mergeProps, {
			...options,
			context: partialStoreContext,
		})) as Connect;

	const withProvider: WithPartialStoreProvider<S> = (
		Component: React.ComponentType<any>
	) => ({ store, context, fields, select, ...rest }: any) =>
		store ? (
			<Provider store={store}>
				<Component {...rest} />
			</Provider>
		) : (
			<Provider context={context} fields={fields} select={select}>
				<Component {...rest} />
			</Provider>
		);

	/** Hooks */

	const useDispatch = createDispatchHook(partialStoreContext);
	const useSelector = createSelectorHook(partialStoreContext);
	const useStore = createStoreHook(partialStoreContext);

	return {
		context: partialStoreContext,
		Provider,
		connect,
		withProvider,
		useDispatch,
		useSelector,
		useStore,
	};
}

/**
 * To set original context value with partial store
 */
export const Provider: React.FC<ProviderProps<any>> = ({ store, ...rest }) => {
	const partialStore = React.useMemo(
		() => ('getPartial' in store ? store : makePartial(store)),
		[store]
	);
	return <BaseProvider {...rest} store={partialStore} />;
};

export type OverrideProvider = {
	<S, Keys extends FieldConfig<S>, TInnerState = PartialState<S, Keys>>(
		props: PropsWithChildren<{
			context: Context<ReactReduxContextValue<S, any>>;
			fields: Keys;
			select?: (p: PartialState<S, Keys>) => TInnerState;
		}>
	): ReactElement | null;
	<S, Key extends keyof S, TInnerState = S[Key]>(
		props: PropsWithChildren<{
			context: Context<ReactReduxContextValue<S, any>>;
			fields: Key;
			select?: (p: S[Key]) => TInnerState;
		}>
	): ReactElement | null;
	(
		props: PropsWithChildren<{
			fields: FieldConfig<any> | string;
			select?: (p: any) => any;
		}>
	): ReactElement | null;
};

/**
 * To override origin context value
 */
export const OverrideStoreProvider: OverrideProvider = ({
	children,
	fields,
	select,
	context,
}: any) => {
	const usePartialStore = useMemo(
		() => (context ? createStoreHook(context) : useStore),
		[context || null]
	);

	const store = usePartialStore();

	const withPartialStore = useMemo(
		() => ('getPartial' in store ? store : makePartial(store)),
		[store]
	);

	const partialStore = useMemo(() => {
		return withPartialStore.getPartial(fields, { select });
	}, [withPartialStore, fields, select || null]);

	return <BaseProvider store={partialStore as any}>{children}</BaseProvider>;
};
