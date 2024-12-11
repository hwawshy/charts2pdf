import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {mergeRegister} from '@lexical/utils';
import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';

const LowPriority = 1;

function Divider() {
    return <div className="w-[1px] my-0 mx-1 bg-[#eee]" />;
}

export default function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikethrough, setIsStrikethrough] = useState(false);

    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            // Update text format
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({editorState}) => {
                editorState.read(() => {
                    $updateToolbar();
                });
            }),
            editor.registerCommand(
                SELECTION_CHANGE_COMMAND,
                (_payload, _newEditor) => {
                    $updateToolbar();
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_UNDO_COMMAND,
                (payload) => {
                    setCanUndo(payload);
                    return false;
                },
                LowPriority,
            ),
            editor.registerCommand(
                CAN_REDO_COMMAND,
                (payload) => {
                    setCanRedo(payload);
                    return false;
                },
                LowPriority,
            ),
        );
    }, [editor, $updateToolbar]);

    return (
        <div className="flex mb-[1px] bg-white p-1 rounded-t-[10px] align-middle mb-" ref={toolbarRef}>
            <button
                disabled={!canUndo}
                onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined);
                }}
                className={"btn-toolbar mr-0.5 disabled:cursor-not-allowed " + (canUndo ? "hover:bg-[#eee]" : "")}
                aria-label="Undo">
                <i className={"format-toolbar bg-[url('icons/editor/arrow-counterclockwise.svg')] " + (!canUndo ? "opacity-20" : "")} />
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className={"btn-toolbar disabled:cursor-not-allowed " + (canRedo ? "hover:bg-[#eee]" : "")}
                aria-label="Redo">
                <i className={"format-toolbar bg-[url('icons/editor/arrow-clockwise.svg')] " + (!canRedo ? "opacity-20" : "")} />
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isBold ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Bold">
                <i className={"format-toolbar bg-[url('icons/editor/type-bold.svg')] " + (isBold ? "opacity-100" : "")} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isItalic ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Italics">
                <i className={"format-toolbar bg-[url('icons/editor/type-italic.svg')] " + (isItalic ? "opacity-100" : "")} />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isUnderline ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Underline">
                <i className={"format-toolbar bg-[url('icons/editor/type-underline.svg')] " + (isUnderline ? "opacity-100" : "") } />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isStrikethrough ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Strikethrough">
                <i className={"format-toolbar bg-[url('icons/editor/type-strikethrough.svg')] " + (isStrikethrough ? "opacity-100" : "")} />
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                className="btn-toolbar mr-0.5 hover:bg-[#eee]"
                aria-label="Left Align">
                <i className="format-toolbar bg-[url('icons/editor/text-left.svg')]" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                className="btn-toolbar mr-0.5 hover:bg-[#eee]"
                aria-label="Center Align">
                <i className="format-toolbar bg-[url('icons/editor/text-center.svg')]" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                className="btn-toolbar mr-0.5 hover:bg-[#eee]"
                aria-label="Right Align">
                <i className="format-toolbar bg-[url('icons/editor/text-right.svg')]" />
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                className="btn-toolbar hover:bg-[#eee]"
                aria-label="Justify Align">
                <i className="format-toolbar bg-[url('icons/editor/justify.svg')]" />
            </button>{' '}
        </div>
    );
}
