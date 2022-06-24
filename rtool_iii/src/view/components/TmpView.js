import React/*, { useState }*/, {useState} from 'react';
import {Button, textarea} from "react-bootstrap";
import styles from './components.module.css';
function TmpView(props) {
    const [s_Content , setContent]=useState(
            [1,2, 3, 4]
            // [
            //     <Button id='1' key={1} onClick={()=>{console.log("this")}}>11</Button>,
            //     <Button id='2' key={2} onClick={()=>{console.log("this")}}>22</Button>
            // ]
    );
    console.log('s_Content',s_Content);
    return (
        <>
            {s_Content}
            {/*{s_Content.map((item)=>item)}*/}
            <hr/>
            <Button onClick={()=>{
                console.log(s_Content);
                // console.log(s_Content.reverse());
                // let vtmp = contentMove(s_Content);
                // console.log(vtmp);
                // setContent(...prevState,1)
            }}>TEST</Button>
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

function contentMove(content,id){
    let clone   = content;
    return clone.reverse()
    // callback_return(clone.reverse());
}

export default TmpView;