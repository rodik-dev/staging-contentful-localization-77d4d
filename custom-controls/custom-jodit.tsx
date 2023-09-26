import * as React from 'react';
import  * as ReactDom from 'react-dom';
import type * as StackbitTypes from '@stackbit/types';
import JoditEditor from 'jodit-react';
import { deserialize, serialize, useDebounceCallback, useMount } from './utils';

const initialContextWindow = window as unknown as StackbitTypes.CustomControlWindow;
initialContextWindow.stackbit = initialContextWindow.stackbit || {};

const RichTextExample = () => {
    const editor = React.useRef(null);
    const config = {
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: 'Start typing...'
    };
    const [externalValue, setExternalValue] = React.useState('');
    const [forceValue, setForceValue] = React.useState('');
    const containerRef = React.useRef<HTMLDivElement>();
    const optionsRef = React.useRef<StackbitTypes.OnUpdateOptions>();

    useMount(() => {
        initialContextWindow.stackbit.onUpdate = (options: StackbitTypes.OnUpdateOptions) => {
            optionsRef.current = options;
            console.log('Got Options', options);
            const fieldVal = (options?.documentField as StackbitTypes.DocumentJsonFieldNonLocalized ?? {}).value;
            if (externalValue != fieldVal) {
                setExternalValue(fieldVal);
            }
            if (options.init) {
                options.setDesiredControlSize({ height: 400 });
            }
        };
    });

    React.useEffect(() => {
        setForceValue(deserialize(externalValue));
        optionsRef?.current?.setDesiredControlSize({ height: containerRef.current.offsetHeight });
    }, [externalValue]);


    const changeValue = useDebounceCallback(
        (chvalue) => {
            optionsRef.current.updateDocument({
                operations: [
                    {
                        opType: 'set',
                        fieldPath: optionsRef.current.fieldPath,
                        field: {
                            type: 'string',
                            value: serialize(chvalue)
                        }
                    }
                ]
            });
        },
        400,
        []
    );

    const onChange = (value) => {
        const fieldVal = (optionsRef.current?.documentField as StackbitTypes.DocumentStringLikeFieldNonLocalized ?? {}).value;
        if (serialize(value) !== fieldVal) {
            changeValue(value);
        }
        optionsRef?.current?.setDesiredControlSize({ height: containerRef.current.offsetHeight });
    };

    if (!optionsRef.current) {
        return null;
    }

    return (
        <div ref={containerRef}>
            <JoditEditor
              ref={editor}
              value={forceValue}
              config={config}
              onChange={onChange}
            />
        </div>
    );
};

const App = () => {
    return <RichTextExample />;
};

ReactDom.render(<App />, document.getElementById('richtext')!);