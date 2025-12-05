import type { StateCreator, StoreMutatorIdentifier } from "zustand";

type Logger = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, Mps, Mcs>,
  name?: string
) => StateCreator<T, Mps, Mcs>;

type LoggerImpl = <T>(
  f: StateCreator<T, [], []>,
  name?: string
) => StateCreator<T, [], []>;

const loggerImpl: LoggerImpl = (f, name) => (set, get, store) => {
  const loggedSet: typeof set = (partial, replace) => {
    if (replace === true) {
      set(partial as Parameters<typeof set>[0], true);
    } else {
      set(partial, false);
    }
    if (import.meta.env.DEV) {
      console.log(`[${name || "Store"}] State updated:`, get());
    }
  };

  return f(loggedSet, get, store);
};

export const logger = loggerImpl as Logger;
