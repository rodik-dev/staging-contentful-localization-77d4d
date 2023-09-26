import * as React from 'react';
import  * as ReactDom from 'react-dom';
import type * as StackbitTypes from '@stackbit/types';
import { ContentfulRichText } from '@stackbit/typewriter';
import { deserialize, serialize, useDebounceCallback, useMount } from './utils';
import * as ContentfulRichTextTypes from '@contentful/rich-text-types';

const initialContextWindow = window as unknown as StackbitTypes.CustomControlWindow;
initialContextWindow.stackbit = initialContextWindow.stackbit || {};

const RichTextExample = () => {
    const [externalValue, setExternalValue] = React.useState<ContentfulRichTextTypes.Document>();
    const [value, setValue] = React.useState([]);
    const containerRef = React.useRef<HTMLDivElement>();
    const optionsRef = React.useRef<StackbitTypes.OnUpdateOptions>();

    useMount(() => {
        initialContextWindow.stackbit.onUpdate = (options: StackbitTypes.OnUpdateOptions) => {
            optionsRef.current = options;
            console.log('Got Options', options);
            const fieldVal = (options.documentField as StackbitTypes.DocumentRichTextFieldNonLocalized).value;
            if (externalValue != fieldVal) {
                setExternalValue(fieldVal);
            }
            if (options.init) {
                options.setDesiredControlSize({ height: 400 });
            }
        };
    });

    React.useEffect(() => {
        optionsRef?.current?.setDesiredControlSize({ height: containerRef.current.offsetHeight });
    }, [value]);

    React.useEffect(() => {
        if (externalValue && externalValue !== serialize(value)) {
            setValue(deserialize(externalValue));
            // editor.children = deserialize(externalValue);
        }
    }, [externalValue]);


    const changeValue = useDebounceCallback(
        () => {
            console.log('firing updateDoc', value);
            optionsRef.current.updateDocument({
                operations: [
                    {
                        opType: 'set',
                        fieldPath: optionsRef.current.fieldPath,
                        field: {
                            type: 'string',
                            value: serialize(value)
                        }
                    }
                ]
            });
        },
        400,
        [value]
    );

    const onChange = (value) => {
        console.log('onchange?');
        const fieldVal = (optionsRef.current.documentField as StackbitTypes.DocumentStringLikeFieldNonLocalized).value;
        if (serialize(value) !== fieldVal) {
            setValue(value);
            changeValue();
        }
        optionsRef?.current?.setDesiredControlSize({ height: containerRef.current.offsetHeight });
    };

    const onLoaded = () => {
        optionsRef?.current?.setDesiredControlSize({ height: containerRef.current.offsetHeight });
    }

    if (!optionsRef.current) {
        return null;
    }

    return (
        <div ref={containerRef}>
            <ContentfulRichText
              initialValue={externalValue}
              onChange={onChange}
              onLoaded={onLoaded}
              contentfulAccessToken={process.env.CONTENTFUL_MANAGEMENT_TOKEN}
              contentfulSpaceId={optionsRef.current?.srcProjectId}
              contentfulEnvironment={`master`}
              entryId={optionsRef.current?.srcDocumentId}
              entryFieldName={optionsRef.current?.fieldModel.name}
            />
        </div>
    );
};

const App = () => {
    return <RichTextExample />;
};

ReactDom.render(<App />, document.getElementById('richtext')!);