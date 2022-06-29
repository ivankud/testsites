import React/*, { useState }*/, {useEffect, useState} from 'react';
import {Button, textarea} from "react-bootstrap";
import styles from './components.module.css';
import {getElementFromSelector} from "bootstrap/js/src/util";
import { saveAs } from 'file-saver'
import moment from 'moment'
import parse from 'html-react-parser';

function TmpView(props) {
    let [s_Content , setContent]=useState(
            [
                { id:0, position:0, action: 'down', type:'btn',     elem: 'Button', content:'0'},
                { id:1, position:1, action: 'down', type:'btn',     elem: 'Button', content:'1'},
                { id:2, position:2, action: 'down', type:'btn',     elem: 'Button', content:'2'},
                { id:3, position:3, action: 'add', type:'btn-add',  elem: 'Button', content:'3+'},
                { id:4, position:4, action: 'down', type:'btn',     elem: 'Button', content:'4'},
                { id:5, position:5, action: 'null', type:'container', content:[
                        { id:5, position:5, action: 'up', type:'btn', elem: 'Button', content:'↑'},
                        { id:5, position:5, action: 'add', type:'btn-add', elem: 'Button',content:'5+'},
                        { id:5, position:5, action: 'down', type:'btn', elem: 'Button', content:'↓'},
                    ]},
                { id:6, position:6, action: 'down', type:'btn', elem: 'Button', content:'6'},
                { id:7, position:7, action: 'down', type:'btn', elem: 'Button', attr: [], content:'7'},
                { id:8, position:8, action: 'null', type:'label', elem: 'label', attr: [], content:'Такая себе надпись'}
            ]
    );
    const [content, setCont] = useState(<></>)
    useEffect(()=>{
        setCont(render_content(s_Content,setContent))
        }, [s_Content])
    let [s_file,setFile] = useState()
    let [s_filecontent,setFileContent] = useState()
    s_Content.forEach(elem=>{console.log('position: % id: % content %', elem.position, elem.id, elem.content)})

    return (
        <>
            <Button onClick={()=>{
                    let blob = new Blob([JSON.stringify({date: new Date(), contents: s_Content})], { type: 'application/json' })
                    saveAs(blob, 'objects'+moment().format('YYYY-MM-DD_hh-mm-ss')+'.json')
                }
            }>Сохранить файл</Button>
            <Button onClick={()=>{
                var input = document.createElement('input');
                input.type = 'file';
                input.click();
                input.onchange = () => {
                    const selectedFile = input.files[0];
                    var reader = new FileReader();
                    reader.readAsText(selectedFile, "UTF-8");
                    reader.onload = (evt) => {
                        setFileContent(evt.target.result);
                        setContent(JSON.parse(evt.target.result).contents);
                    };
                }
            }
            }>Загрузить файл</Button>
            {content}
            <hr/>
        </>
    );
}

function contentMove(content,id,side, callback){
    let vcontent = content.concat([]);
    let vTargetElem = vcontent.find(elem=>elem.id===id);
    let canmove = !((vTargetElem.position === (vcontent.length-1) && side ==='down') || (vTargetElem.position === 0 && side==='up'));
    let vposition = vTargetElem.position;
    let vOtherElem;
    if(canmove) {
        switch (side) {
            case 'up':
                vOtherElem = vcontent.find(elem => elem.position === (vposition - 1));
                vOtherElem.position=vOtherElem.position+1;
                vTargetElem.position=vTargetElem.position-1;
                vcontent[vOtherElem.position]=vOtherElem;
                vcontent[vTargetElem.position]=vTargetElem;
                callback(vcontent);
                break;
            case 'down':
                vOtherElem = vcontent.find(elem => elem.position === (vposition + 1));
                vOtherElem.position=vOtherElem.position-1;
                vTargetElem.position=vTargetElem.position+1;
                vcontent[vOtherElem.position]=vOtherElem;
                vcontent[vTargetElem.position]=vTargetElem;
                callback(vcontent);
                break;
            case 'add':
                let vncomponent ={ id:vTargetElem.id, position:vTargetElem.position, action: 'down', type:'btn', elem: 'Button', content:'newbtn'}
                let vncontent=vcontent.map(elem=>{
                    if(elem.id >=vTargetElem.id) {elem.id=elem.id+1; elem.position=elem.position+1;}
                    return elem
                })
                vncontent.splice(vncomponent.position,0,vncomponent);
                callback(vncontent);
                break;
        }
    }
}
function render_content(content,setter,parentcontent,parent){
    return content.map(
        (elem,i)=>{
            let component;
            let vid;
            let vcontent;
            switch (elem.type) {
                case 'btn':
                    vid = parent?parent.id:elem.id;
                    vcontent = parentcontent?parentcontent:content;
                    component = create_component(elem,() => {contentMove(vcontent, vid, elem.action, setter)});
                    break;
                case 'btn-add':
                    vid = parent?parent.id:elem.id
                    vcontent = parentcontent?parentcontent:content;
                    component = create_component(elem,() => {contentMove(vcontent.valueOf(), vid.valueOf(), elem.action, setter)});
                    break;
                case 'container':
                    component=render_content(elem.content,setter,content,elem)
                    break;
                case 'label':
                    vid = parent?parent.id:elem.id
                    vcontent = parentcontent?parentcontent:content;
                    component = create_component(elem,() => {contentMove(vcontent.valueOf(), vid.valueOf(), elem.action, setter)});
                    break;
                    break;
                default:
                    component = <div>noType</div>
                    break;
            }
            return <div>{component}</div>
        }
    )
}
function create_component(elem,func){
    let vresult;
    switch (elem.elem){
        case('Button'):
            vresult=<Button onClick={func}>{elem.content}</Button>
            break;
        case('label'):
            vresult=
            <div>
                {/*<label>{elem.content}</label>*/}
                <button type="button" className="btn btn-secondary" data-container="body" data-toggle="popover"
                        data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
                    Popover on top
                </button>
            </div>
            break;
    }
    return vresult;
}
export default TmpView;