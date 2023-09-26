import * as React from 'react';
import { debounce, DebouncedFunc, DebounceSettings } from 'lodash';

export function serialize(nodes) {
    return nodes;
}

export function deserialize(text) {
    return text;
}

export const useMount = (fn: React.EffectCallback): void => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(fn, []);
};

export const useDebounceCallback = <T extends (...args: any[]) => any>(cb: T, delay = 0, changes: any[], opts?: DebounceSettings): DebouncedFunc<T> => {
    const handler = React.useRef(cb);
    const debounced = React.useRef(
        debounce(
            (...args) => {
                handler.current(...args);
            },
            delay,
            opts
        )
    );

    React.useEffect(() => {
        handler.current = cb;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, changes);

    useMount(() => () => {
        debounced.current.cancel();
    });

    return debounced.current;
};
