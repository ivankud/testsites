import React/*, { useState }*/, {useState} from 'react';
import {Button, textarea} from "react-bootstrap";
import styles from './components.module.css';
function TmpView(props) {
    let [s_Content , setContent]=useState(
            [
                { id:0, position:0, content:<Button onClick={()=>{contentMove(s_Content,0,'down',setContent)}}>0</Button>},
                { id:1, position:7, content:<Button onClick={()=>{contentMove(s_Content,1,'down',setContent)}}>1</Button>},
                { id:2, position:2, content:<Button onClick={()=>{contentMove(s_Content,2,'down',setContent)}}>2</Button>},
                { id:3, position:3, content:<Button onClick={()=>{contentMove(s_Content,3,'down',setContent)}}>3</Button>},
                { id:4, position:4, content:<Button onClick={()=>{contentMove(s_Content,4,'down',setContent)}}>4</Button>},
                { id:5, position:5, content:<Button onClick={()=>{contentMove(s_Content,5,'down',setContent)}}>5</Button>},
                { id:6, position:6, content:<Button onClick={()=>{contentMove(s_Content,6,'down',setContent)}}>6</Button>},
                { id:7, position:2, content:<Button onClick={()=>{contentMove(s_Content,6,'down',setContent)}}>7</Button>},
            ]
    );
    console.log('1',s_Content.sort((a,b)=>a.position>b.position))
    let render_content = s_Content.map(
        (elem,index)=>{
            elem.key=index;
            return <div>{elem.content}</div>})
    return (
        <>
            {/*{s_Content}*/}
            {render_content}
            {/*{s_Content.map((item)=>item)}*/}
            <hr/>
            <Button onClick={()=>{
                const arr2 = s_Content.concat([]);
                console.log(arr2);
                setContent(arr2)
            }}>TEST</Button>
            <Button onClick={()=>{
                console.log(s_Content)
            }}>LOG</Button>
            <div className={styles['vl']}/>
            <div id={'render_elements'}>dfasdfasd
                <ul>
                    <li className="bullet" onClick={()=>{console.log(this);}}>1</li>
                    <li className="bullet" onClick={()=>{console.log(this);}}>2</li>
                    <li className="bullet" onClick={()=>{console.log(this);}}>3</li>
                    <li className="bullet" id={'btn4'} onClick={(e)=>{console.log(e.target)}}>4</li>
                </ul>
            </div>
        </>

    );
}

function contentMove(content,id,side, callback){
    // console.log('////////', side)
    // console.log(content())
    // let vcontent = content().concat([]);
    let vcontent = content;
    let vTargetElem = vcontent.find(elem=>elem.id===id);
    let canmove = !((vTargetElem.position === (content.length-1) && side ==='down') || (vTargetElem.position === 0 && side==='up'));
    let vposition = vTargetElem.position;
    let vOtherElem;
    if(canmove) {
        switch (side) {
            case 'up':
                console.log('+++up')
                vOtherElem = vcontent.find(elem => elem.position === (vposition - 1));
                vOtherElem.position=vOtherElem.position+1;
                vTargetElem.position=vTargetElem.position-1;
                break;
            case 'down':
                console.log('+++down')
                vOtherElem = vcontent.find(elem => elem.position === (vposition + 1));
                vOtherElem.position=vOtherElem.position-1;
                vTargetElem.position=vTargetElem.position+1;
                break;
        }
        // vcontent[vOtherElem.position]=vOtherElem;
        // vcontent[vTargetElem.position]=vTargetElem;
        // callback(vcontent.concat([]));
        callback(vcontent.reverse());
    }
}

export default TmpView;