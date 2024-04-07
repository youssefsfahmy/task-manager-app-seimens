import React from "react";
import dynamic from "next/dynamic";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);
const RichText = (props: {
  onEditorStateChange: (newEditorState: EditorState) => void;
  editorState: EditorState | undefined;
}) => {
  return (
    <div className="border h-full overflow-hidden text-gray-900">
      <Editor
        editorState={props.editorState}
        onEditorStateChange={props.onEditorStateChange}
        wrapperClassName="bg-white h-full text-gray-900"
        editorClassName="h-full px-4 text-gray-900"
        toolbarClassName="text-gray-900"
      />
    </div>
  );
};

export default RichText;
