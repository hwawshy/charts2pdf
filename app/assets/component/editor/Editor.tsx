import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {
    $isTextNode,
    DOMConversionMap,
    // DOMExportOutput,
    // DOMExportOutputMap,
    // Klass,
    // LexicalEditor,
    // LexicalNode,
    ParagraphNode,
    TextNode,
} from 'lexical';

import ExampleTheme from '../common/ExampleTheme.ts';
import ToolbarPlugin from './plugins/ToolbarPlugin.tsx';
import {parseAllowedColor, parseAllowedFontSize} from './styleConfig.ts';
import SubmitPlugin from "./plugins/SubmitPlugin.tsx";
import {useDisclosure} from "@mantine/hooks";
import {useState} from "react";
import {SuccessModal} from "../ResultModal.tsx";
import ChartPlugin from "./plugins/chart/ChartPlugin.tsx";
import {ChartNode} from "./plugins/chart/ChartNode.tsx";
//import TreeViewPlugin from "./plugins/TreeViewPlugin.tsx";

const placeholder = 'Enter some rich text...';

// const removeStylesExportDOM = (
//     editor: LexicalEditor,
//     target: LexicalNode,
// ): DOMExportOutput => {
//     const output = target.exportDOM(editor);
//     if (output && output.element instanceof HTMLElement) {
//         // Remove all inline styles and classes if the element is an HTMLElement
//         // Children are checked as well since TextNode can be nested
//         // in i, b, and strong tags.
//         for (const el of [
//             output.element,
//             ...output.element.querySelectorAll('[style],[class],[dir="ltr"]'),
//         ]) {
//             el.removeAttribute('class');
//             el.removeAttribute('style');
//             if (el.getAttribute('dir') === 'ltr') {
//                 el.removeAttribute('dir');
//             }
//         }
//     }
//     return output;
// };

// const exportMap: DOMExportOutputMap = new Map<
//     Klass<LexicalNode>,
//     (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
// >([
//     [ParagraphNode, removeStylesExportDOM],
//     [TextNode, removeStylesExportDOM],
// ]);

const getExtraStyles = (element: HTMLElement): string => {
    // Parse styles from pasted input, but only if they match exactly the
    // sort of styles that would be produced by exportDOM
    let extraStyles = '';
    const fontSize = parseAllowedFontSize(element.style.fontSize);
    const backgroundColor = parseAllowedColor(element.style.backgroundColor);
    const color = parseAllowedColor(element.style.color);
    if (fontSize !== '' && fontSize !== '15px') {
        extraStyles += `font-size: ${fontSize};`;
    }
    if (backgroundColor !== '' && backgroundColor !== 'rgb(255, 255, 255)') {
        extraStyles += `background-color: ${backgroundColor};`;
    }
    if (color !== '' && color !== 'rgb(0, 0, 0)') {
        extraStyles += `color: ${color};`;
    }
    return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
    const importMap: DOMConversionMap = {};

    // Wrap all TextNode importers with a function that also imports
    // the custom styles implemented by the playground
    for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
        importMap[tag] = (importNode) => {
            const importer = fn(importNode);
            if (!importer) {
                return null;
            }
            return {
                ...importer,
                conversion: (element) => {
                    const output = importer.conversion(element);
                    if (
                        output === null ||
                        output.forChild === undefined ||
                        output.after !== undefined ||
                        output.node !== null
                    ) {
                        return output;
                    }
                    const extraStyles = getExtraStyles(element);
                    if (extraStyles) {
                        const {forChild} = output;
                        return {
                            ...output,
                            forChild: (child, parent) => {
                                const textNode = forChild(child, parent);
                                if ($isTextNode(textNode)) {
                                    textNode.setStyle(textNode.getStyle() + extraStyles);
                                }
                                return textNode;
                            },
                        };
                    }
                    return output;
                },
            };
        };
    }

    return importMap;
};

const editorConfig = {
    html: {
        //export: exportMap,
        import: constructImportMap(),
    },
    namespace: 'React.js Demo',
    nodes: [ParagraphNode, TextNode, ChartNode],
    onError(error: Error) {
        throw error;
    },
    theme: ExampleTheme,
};

export function Editor() {
    const [opened, {open, close}] = useDisclosure(false);
    const [pdfData, setPdfData] = useState<string | null>(null);

    return (
        <>
            <LexicalComposer initialConfig={editorConfig}>
                <div
                    className="mx-auto my-5 rounded-sm rounded-t-xl max-w-[210mm] relative font-[400] leading-5 text-left text-black">
                    <ToolbarPlugin/>
                    <div className="bg-white relative rounded-b-xl">
                        <RichTextPlugin
                            contentEditable={
                                <ContentEditable
                                    className="min-h-[150px] relative text-[15px] leading-5 resize-none caret-gray-600 outline-0 px-2.5 py-4 mb-2.5"
                                    aria-placeholder={placeholder}
                                    placeholder={
                                        <div
                                            className="absolute text-neutral-400 overflow-hidden text-ellipsis top-[15px] left-[10px] text-[15px] select-none inline-block pointer-events-none">{placeholder}</div>
                                    }
                                />
                            }
                            ErrorBoundary={LexicalErrorBoundary}
                        />
                        <ChartPlugin />
                        <HistoryPlugin/>
                        <AutoFocusPlugin/>
                        <SubmitPlugin openModal={open} setPdfData={setPdfData} />
                    </div>
                </div>
            </LexicalComposer>
            <SuccessModal opened={opened} close={close} pdfData={pdfData} />
        </>

    );
}
