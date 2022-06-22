import React/*, { useState }*/ from 'react';
import {
    textarea }
    from 'react-bootstrap';
function ToolBar(props) {
    let model = props.model;
    console.log('1:',model);
    /*defaultValue={'Текст файла модели'}*/
    return (
        <div>
            <textarea id='idmodeltextarea'
                      style={{width:'100%', height:"500px", resize: "none"}}
                      value={()=>{
                          model?JSON.stringify(model):''
                        }
                      }
            >
                {/*Введите модель*/}
            </textarea>
        </div>
    );
}

export default ToolBar;