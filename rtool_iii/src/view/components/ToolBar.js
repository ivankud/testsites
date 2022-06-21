import React/*, { useState }*/ from 'react';
import {
    textarea }
    from 'react-bootstrap';
function ToolBar() {
    return (
        <div>
            <textarea id='idmodeltextarea' style={{width:'100%', height:"500px", resize: "none"}} defaultValue={'Текст файла модели'}>
                {/*Введите модель*/}
            </textarea>
        </div>
    );
}

export default ToolBar;