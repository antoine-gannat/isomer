export type Listener<T> = (value: T) => void;

type Dispatcher<T> = {
  dispatch: (value: T) => void;
  listen: (callback: Listener<T>) => () => void;
};

export function createDispatcher<T>(): Dispatcher<T> {
  const listeners: Listener<T>[] = [];

  return {
    dispatch: (value: T) => listeners.forEach((listener) => listener(value)),
    listen: (callback: (value: T) => void) => {
      listeners.push(callback);
      return () => {
        const index = listeners.indexOf(callback);
        listeners.splice(index, 1);
      };
    },
  };
}
