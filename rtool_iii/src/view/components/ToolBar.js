import React/*, { useState }*/ from 'react';
import {
    textarea }
    from 'react-bootstrap';
function ToolBar(props) {
    let model = props.model;
    let content ;
    if(model) {
        content = JSON.stringify(model);
        content = content.replace(/({)/g, '$1\n');
        content = content.replace(/(\:)(\[)/g, '$1\n$2');
        content = content.replace(/(\[)(\")/g, '$1\n$2');
        content = content.replace(/(\")(\])/g, '$1\n$2');
        content = content.replace(/([\,]{1})/g, '$1\n');
    }
    else
        content = '';
    console.log('1:',model);
    /*defaultValue={'Текст файла модели'}*/
    return (
        <div>
            <textarea id='idmodeltextarea'
                      style={{width:'100%', height:"500px", resize: "none"}}
                      value={content}
            />
        </div>
    );
}

export default ToolBar;