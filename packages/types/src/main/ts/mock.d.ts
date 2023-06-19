// Extracted as-is from the Jest sources
// https://github.com/jestjs/jest/blob/6460335f88cee3dcb9d29c49d55ab02b9d83f994/packages/jest-mock/src/index.ts#L875

export type MockMetadataType =
  | 'object'
  | 'array'
  | 'regexp'
  | 'function'
  | 'constant'
  | 'collection'
  | 'null'
  | 'undefined';

// TODO remove re-export in Jest 30
export type MockFunctionMetadataType = MockMetadataType;

export type MockMetadata<T, MetadataType = MockMetadataType> = {
  ref?: number;
  members?: Record<string, MockMetadata<T>>;
  mockImpl?: T;
  name?: string;
  refID?: number;
  type?: MetadataType;
  value?: T;
  length?: number;
};

// TODO remove re-export in Jest 30
export type MockFunctionMetadata<
  T = unknown,
  MetadataType = MockMetadataType,
> = MockMetadata<T, MetadataType>;

export type ClassLike = { new(...args: any): any };
export type FunctionLike = (...args: any) => any;

export type ConstructorLikeKeys<T> = keyof {
  [K in keyof T as Required<T>[K] extends ClassLike ? K : never]: T[K];
};

export type MethodLikeKeys<T> = keyof {
  [K in keyof T as Required<T>[K] extends FunctionLike ? K : never]: T[K];
};

export type PropertyLikeKeys<T> = Exclude<
  keyof T,
  ConstructorLikeKeys<T> | MethodLikeKeys<T>
>;

export type MockedClass<T extends ClassLike> = MockInstance<
  (...args: ConstructorParameters<T>) => Mocked<InstanceType<T>>
> &
  MockedObject<T>;

export type MockedFunction<T extends FunctionLike> = MockInstance<T> &
  MockedObject<T>;

type MockedFunctionShallow<T extends FunctionLike> = MockInstance<T> & T;

export type MockedObject<T extends object> = {
  [K in keyof T]: T[K] extends ClassLike
    ? MockedClass<T[K]>
    : T[K] extends FunctionLike
      ? MockedFunction<T[K]>
      : T[K] extends object
        ? MockedObject<T[K]>
        : T[K];
} & T;

type MockedObjectShallow<T extends object> = {
  [K in keyof T]: T[K] extends ClassLike
    ? MockedClass<T[K]>
    : T[K] extends FunctionLike
      ? MockedFunctionShallow<T[K]>
      : T[K];
} & T;

export type Mocked<T> = T extends ClassLike
  ? MockedClass<T>
  : T extends FunctionLike
    ? MockedFunction<T>
    : T extends object
      ? MockedObject<T>
      : T;

export type MockedShallow<T> = T extends ClassLike
  ? MockedClass<T>
  : T extends FunctionLike
    ? MockedFunctionShallow<T>
    : T extends object
      ? MockedObjectShallow<T>
      : T;

export type UnknownFunction = (...args: Array<unknown>) => unknown;
export type UnknownClass = { new(...args: Array<unknown>): unknown };

export type SpiedClass<T extends ClassLike = UnknownClass> = MockInstance<
  (...args: ConstructorParameters<T>) => InstanceType<T>
>;

export type SpiedFunction<T extends FunctionLike = UnknownFunction> =
  MockInstance<(...args: Parameters<T>) => ReturnType<T>>;

export type SpiedGetter<T> = MockInstance<() => T>;

export type SpiedSetter<T> = MockInstance<(arg: T) => void>;

export type Spied<T extends ClassLike | FunctionLike> = T extends ClassLike
  ? SpiedClass<T>
  : T extends FunctionLike
    ? SpiedFunction<T>
    : never;

// TODO in Jest 30 remove `SpyInstance` in favour of `Spied`
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SpyInstance<T extends FunctionLike = UnknownFunction>
  extends MockInstance<T> {
}

/**
 * All what the internal typings need is to be sure that we have any-function.
 * `FunctionLike` type ensures that and helps to constrain the type as well.
 * The default of `UnknownFunction` makes sure that `any`s do not leak to the
 * user side. For instance, calling `fn()` without implementation will return
 * a mock of `(...args: Array<unknown>) => unknown` type. If implementation
 * is provided, its typings are inferred correctly.
 */
export interface Mock<T extends FunctionLike = UnknownFunction>
  extends Function,
    MockInstance<T> {
  new(...args: Parameters<T>): ReturnType<T>;

  (...args: Parameters<T>): ReturnType<T>;
}

type ResolveType<T extends FunctionLike> = ReturnType<T> extends PromiseLike<
    infer U
  >
  ? U
  : never;

type RejectType<T extends FunctionLike> = ReturnType<T> extends PromiseLike<any>
  ? unknown
  : never;

export interface MockInstance<T extends FunctionLike = UnknownFunction> {
  _isMockFunction: true;
  _protoImpl: Function;

  getMockImplementation(): T | undefined;

  getMockName(): string;

  mock: MockFunctionState<T>;

  mockClear(): this;

  mockReset(): this;

  mockRestore(): void;

  mockImplementation(fn: T): this;

  mockImplementationOnce(fn: T): this;

  withImplementation(fn: T, callback: () => Promise<unknown>): Promise<void>;

  withImplementation(fn: T, callback: () => void): void;

  mockName(name: string): this;

  mockReturnThis(): this;

  mockReturnValue(value: ReturnType<T>): this;

  mockReturnValueOnce(value: ReturnType<T>): this;

  mockResolvedValue(value: ResolveType<T>): this;

  mockResolvedValueOnce(value: ResolveType<T>): this;

  mockRejectedValue(value: RejectType<T>): this;

  mockRejectedValueOnce(value: RejectType<T>): this;
}

export interface Replaced<T = unknown> {
  /**
   * Restore property to its original value known at the time of mocking.
   */
  restore(): void;

  /**
   * Change the value of the property.
   */
  replaceValue(value: T): this;
}

type ReplacedPropertyRestorer<T extends object, K extends keyof T> = {
  (): void;
  object: T;
  property: K;
  replaced: Replaced<T[K]>;
};

type MockFunctionResultIncomplete = {
  type: 'incomplete';
  /**
   * Result of a single call to a mock function that has not yet completed.
   * This occurs if you test the result from within the mock function itself,
   * or from within a function that was called by the mock.
   */
  value: undefined;
};
type MockFunctionResultReturn<T extends FunctionLike = UnknownFunction> = {
  type: 'return';
  /**
   * Result of a single call to a mock function that returned.
   */
  value: ReturnType<T>;
};
type MockFunctionResultThrow = {
  type: 'throw';
  /**
   * Result of a single call to a mock function that threw.
   */
  value: unknown;
};

type MockFunctionResult<T extends FunctionLike = UnknownFunction> =
  | MockFunctionResultIncomplete
  | MockFunctionResultReturn<T>
  | MockFunctionResultThrow;

type MockFunctionState<T extends FunctionLike = UnknownFunction> = {
  /**
   * List of the call arguments of all calls that have been made to the mock.
   */
  calls: Array<Parameters<T>>;
  /**
   * List of all the object instances that have been instantiated from the mock.
   */
  instances: Array<ReturnType<T>>;
  /**
   * List of all the function contexts that have been applied to calls to the mock.
   */
  contexts: Array<ThisParameterType<T>>;
  /**
   * List of the call order indexes of the mock. Jest is indexing the order of
   * invocations of all mocks in a test file. The index is starting with `1`.
   */
  invocationCallOrder: Array<number>;
  /**
   * List of the call arguments of the last call that was made to the mock.
   * If the function was not called, it will return `undefined`.
   */
  lastCall?: Parameters<T>;
  /**
   * List of the results of all calls that have been made to the mock.
   */
  results: Array<MockFunctionResult<T>>;
};

type MockFunctionConfig = {
  mockImpl: Function | undefined;
  mockName: string;
  specificMockImpls: Array<Function>;
};

type SpyState = { reset?: () => void; restore: () => void };

export type SpyOn = {
  <
    T extends object,
    K extends PropertyLikeKeys<T>,
    V extends Required<T>[K],
    A extends 'get' | 'set',
  >(
    object: T,
    methodKey: K,
    accessType: A,
  ): A extends 'get'
    ? SpiedGetter<V>
    : A extends 'set'
      ? SpiedSetter<V>
      : never;

  <
    T extends object,
    K extends ConstructorLikeKeys<T> | MethodLikeKeys<T>,
    V extends Required<T>[K],
  >(
    object: T,
    methodKey: K,
  ): V extends ClassLike | FunctionLike ? Spied<V> : never;

  <T extends object>(
    object: T,
    methodKey: keyof T,
    accessType?: 'get' | 'set',
  ): MockInstance
}
