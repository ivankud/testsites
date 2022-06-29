import React from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css';

import MainBoard from './view/components/MainBoard.js'

// import TmpView from "./view/components/TmpView";
import TmpView from "./view/components/TmpView.jsx";
import {Button, Label} from "react-bootstrap";

function App() {
  let tmpVar = '<div clasName={"bg-warning"}>Help Me</div>';
  return (
      <>
        <TmpView content={tmpVar}/>
        <div id='vVeiw'></div>
      </>
      // <MainBoard/>

  );
}

export default App;
