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
import ArrowClockwise from '../../../icons/editor/arrow-clockwise.svg';
import ArrowCounterclockwise from '../../../icons/editor/arrow-counterclockwise.svg';
import TypeBold from '../../../icons/editor/type-bold.svg';
import TypeItalic from '../../../icons/editor/type-italic.svg';
import TypeStrikethrough from '../../../icons/editor/type-strikethrough.svg';
import TypeUnderline from '../../../icons/editor/type-underline.svg';
import Justify from '../../../icons/editor/justify.svg';
import TextCenter from '../../../icons/editor/text-center.svg';
import TextLeft from '../../../icons/editor/text-left.svg';
import TextRight from '../../../icons/editor/text-right.svg';

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
                <i className={"opacity-60 " + (!canUndo ? "!opacity-20" : "")}>
                    <ArrowCounterclockwise className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                disabled={!canRedo}
                onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined);
                }}
                className={"btn-toolbar disabled:cursor-not-allowed " + (canRedo ? "hover:bg-[#eee]" : "")}
                aria-label="Redo">
                <i className={"opacity-60 " + (!canRedo ? "!opacity-20" : "")}>
                    <ArrowClockwise className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isBold ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Bold">
                <i className={"opacity-60 " + (isBold ? "!opacity-100" : "")}>
                    <TypeBold className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isItalic ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Italics">
                <i className={"opacity-60 " + (isItalic ? "!opacity-100" : "")}>
                    <TypeItalic className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isUnderline ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Underline">
                <i className={"opacity-60 " + (isUnderline ? "!opacity-100" : "") }>
                    <TypeUnderline className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
                }}
                className={'btn-toolbar mr-0.5 hover:bg-[#eee] ' + (isStrikethrough ? 'bg-[#dfe8fa4d]' : '')}
                aria-label="Format Strikethrough">
                <i className={"opacity-60 " + (isStrikethrough ? "!opacity-100" : "")}>
                    <TypeStrikethrough className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <Divider />
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
                }}
                className="btn-toolbar mr-0.5 hover:bg-[#eee]"
                aria-label="Left Align">
                <i className="opacity-60">
                    <TextLeft className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
                }}
                className="btn-toolbar mr-0.5 hover:bg-[#eee]"
                aria-label="Center Align">
                <i className="opacity-60">
                    <TextCenter className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
                }}
                className="btn-toolbar mr-0.5 hover:bg-[#eee]"
                aria-label="Right Align">
                <i className="opacity-60">
                    <TextRight className={"w-[18px] h-[18px]"} />
                </i>
            </button>
            <button
                onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
                }}
                className="btn-toolbar hover:bg-[#eee]"
                aria-label="Justify Align">
                <i className="opacity-60">
                    <Justify className={"w-[18px] h-[18px]"} />
                </i>
            </button>{' '}
        </div>
    );
}
