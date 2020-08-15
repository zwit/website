import React from 'react';
import ReactQuill, { Quill } from "react-quill";
import ImageUploader from "quill-image-uploader";

Quill.register("modules/imageUploader", ImageUploader);

const TextEditor = ({ onChangeText, text }) => (
  <>
    <ReactQuill
      theme="snow" 
      value={text} 
      onChange={onChangeText}
      modules={{
        toolbar: [
          [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
          [{ 'align': [] }],
          [{size: []}],
          ['bold', 'italic', 'underline', 'strike', 'blockquote',  { 'color': [] }, { 'background': [] }],
          [{'list': 'ordered'}, {'list': 'bullet'}, 
          {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image', 'video'],
          [{ 'script': 'sub'}, { 'script': 'super' }],
          ['clean'],
          ['code-block']
        ],
        clipboard: {
          // toggle to add extra line breaks when pasting HTML:
          matchVisual: false,
        },
        // imageUploader: {
        //   upload: file => {
        //     return new Promise((resolve, reject) => {
        //       const formData = new FormData();
        //       formData.append("image", file);
    
        //       fetch(
        //         "https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875e56b22",
        //         {
        //           method: "POST",
        //           body: formData
        //         }
        //       )
        //         .then(response => response.json())
        //         .then(result => {
        //           console.log(result);
        //           resolve(result.data.url);
        //         })
        //         .catch(error => {
        //           reject("Upload failed");
        //           console.error("Error:", error);
        //         });
        //     });
        //   }
        // },
      }}
    />
  </>
)

export default TextEditor;
