import ReactMarkdown from 'react-markdown';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Container from '../Container';

const MarkdownSection = (props) => {
    return (
        <Container data-sb-field-path={props.path}>
            <div data-sb-field-path=".markdown">
                <ReactMarkdown>
                    {props.fields.markdown}
                </ReactMarkdown>
            </div>
            {props.contentfulNativeRichtext && (<div data-sb-field-path="contentfulNativeRichtext" className="mb-4">{documentToReactComponents(props.contentfulNativeRichtext)}</div>)}
          <hr></hr>
          {props.joditCustomRichtext && (<div data-sb-field-path="bodyjoditCustomRichtext" className="mb-4" dangerouslySetInnerHTML={{__html:props.joditCustomRichtext}}></div>)}

        </Container>
    );
};

export default MarkdownSection;
