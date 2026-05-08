import { useEffect, useState } from "react";

type Store<T> = { all: () => T; subscribe: (fn: () => void) => () => void };

export function useStore<T>(store: Store<T>): T {
  const [value, setValue] = useState<T>(() => store.all());
  useEffect(() => {
    const update = () => setValue(store.all());
    update();
    return store.subscribe(update);
  }, [store]);
  return value;
}
