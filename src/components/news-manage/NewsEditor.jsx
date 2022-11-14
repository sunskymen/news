import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html'
import { convertToRaw,ContentState ,EditorState } from 'draft-js'
import htmlToDraftjs from 'html-to-draftjs'

export default function NewsEditor(props) {
  useEffect(() => {
    const html = props.content
    if (html === undefined) return
    const contentBlock = htmlToDraftjs(html)
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
      const editState = EditorState.createWithContent(contentState)
      setEditorState(editState)
    }
  },[props.content])
  const [editorState,setEditorState] = useState('')
  
  return (
      <Editor
        editorState={editorState}
        toolbarClassName="toolbarClassName"
        wrapperClassName="wrapperClassName"
        editorClassName="editorClassName"
        onEditorStateChange={(editorState) =>
        setEditorState(editorState)
        }
      onBlur={() => {
        const html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        props.getContent(html)
  }}
      />
  )
}
