import React, {useEffect, useState} from 'react';
import ToolBar from './ToolBar'
import {Button, textarea} from "react-bootstrap";
import JSZip from 'jszip';
import {saveAs} from 'file-saver';
import styles from './components.module.css';

function MainBoard() {
    const [s_nameModel, setNameModel]=useState('');
    const [s_swaggerUrl, setSwaggerUrl]=useState('http://172.16.50.42:9995/soup/v2/api-docs');
    const [s_jsonModel, setJsonModal]=useState('');
    const [s_textModel, setTextModal]=useState('');
    const [s_showModel, setShowModel]=useState('none');
    const [s_textService, setTextService]=useState('');
    const [s_showService, setShowService]=useState('none');
    const [s_textListItem, setTextListItem]=useState('');
    const [s_showListItem, setShowListItem]=useState('none');
    const [s_textList, setTextList]=useState('');
    const [s_showList, setShowList]=useState('none');
    const [s_textCSS, setTextCSS]=useState('');
    const [s_showCSS, setShowCSS]=useState('none');
    const [s_textMainFile, setTextMainFile]=useState('');
    const [s_showMainFile, setShowMainFile]=useState('none');
    const [s_swaggerTree, setSwaggerTree]=useState();
    const [s_treeList, setTreeList]=useState();
    useEffect(()=>{getSwagger(s_swaggerUrl, setSwaggerTree)},[]);
    useEffect(()=>{s_swaggerTree&&createList(s_swaggerTree, setTreeList,setJsonModal,s_treeList)},[s_swaggerTree]);
    dragElement(document.getElementById("editor-elem"));
    return (
        <div className="d-flex align-items-stretch bd-highlight example-parent" style={{ height: '1080px', width: '100%' }}>
            <div id='toolbar' className="bd-highlight col-example bg-info"     style={{ width:'20%' }}>
                <div className={'d-flex justify-content-center text-center'}><h2>Поле для ввода URL</h2></div>
                <input id='SwaggerUrlInput' type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                <hr/>
                <div>
                    <div className={'d-flex justify-content-center text-center'}><h2>Поле для ввода модели</h2></div>
                </div>
                <ToolBar id='modelview' model={s_jsonModel}/>
                <Button
                    onClick={
                        ()=>{
                                let vmodel = document.getElementById('idmodeltextarea').value;
                                let vSwaggerUrl = document.getElementById('SwaggerUrlInput').value;
                                setSwaggerUrl(vSwaggerUrl);
                                let vJsonModel = JSON.parse(vmodel)
                                let nameModel = vJsonModel['title'];        // наименование модели #ИМЯ_МОДЕЛИ
                                if(s_nameModel!==nameModel) setNameModel(nameModel);
                                let Model = buildModel(vJsonModel, nameModel,vSwaggerUrl);  // составление фала компонента Model
                                setTextModal(Model);                                        // составление фала компонента Model
                                let Services = buildServices(vJsonModel, nameModel,vSwaggerUrl); // составление фала компонента Servises
                                setTextService(Services);                                        // составление фала компонента Servises
                                let ListItem = buildListItem(nameModel);    // составление фала компонента ListItem
                                setTextListItem(ListItem);                  // составление фала компонента ListItem
                                let List = buildList(nameModel);    // составление фала компонента List
                                setTextList(List);                  // составление фала компонента List
                                let CSS = buildCSS(nameModel);    // составление фала компонента CSS
                                setTextCSS(CSS);                  // составление фала компонента CSS
                                let MainFile = buildMainFile(nameModel);    // составление фала компонента MainFile
                                setTextMainFile(MainFile);                  // составление фала компонента MainFile
                                setShowModel('block');
                                setShowService('none');
                                setShowListItem('none');
                                setShowList('none');
                                setShowCSS('none');
                                setShowMainFile('none');
                        }
                    }>Сохранить</Button>
            </div>
            <div id='workcpace' className="bd-highlight col-example bg-light"  style={{ width:'50%' }}>
                {(s_textModel||s_textService)&&
                    <div>
                        <ul className="nav">
                            <li >
                                <button type="button" className="btn">
                                    <img className={'align-content-md-center'} src={require('../../open-iconic-master/png/file-2x.png')}
                                     onClick={()=> {
                                         let zip = new JSZip();
                                         let modelBlob = new Blob([s_textModel], {type: 'text/plain'});
                                         let modelFile = new File([modelBlob], s_nameModel +".model.js");
                                         zip.file(s_nameModel +".model",modelFile);
                                         let serviceBlob = new Blob([s_textService], {type: 'text/plain'});
                                         let serviceFile = new File([serviceBlob], s_nameModel +".service.js");
                                         zip.file(s_nameModel +".service.js",serviceFile);
                                         zip.generateAsync({type:"blob"}).then(function(content) {
                                                 saveAs(content, s_nameModel +".zip");
                                             }
                                         )
                                     }
                                     }/>
                                </button>
                            </li>
                            {s_textModel&&
                                <li className="nav nav-pills">
                                    <a className={`nav-link${s_showModel==='block'?' active':''}`} href="#"
                                       onClick={()=>{
                                           setShowModel('block');
                                           setShowService('none');
                                           setShowListItem('none');
                                           setShowList('none');
                                           setShowCSS('none');
                                           setShowMainFile('none');
                                        }
                                       }>Model</a>
                                </li>
                            }
                            {s_textService&&
                                <li className="nav nav-pills">
                                    <a className={`nav-link${s_showService==='block'?' active':''}`} href="#"
                                       onClick={()=>{
                                            setShowModel('none');
                                            setShowService('block');
                                            setShowListItem('none');
                                            setShowList('none');
                                            setShowCSS('none');
                                            setShowMainFile('none');
                                        }
                                       }>Service</a>
                                </li>}
                                {(s_textListItem||s_textList||s_textCSS||s_textMainFile)&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${(s_showMainFile==='block' || s_showCSS==='block' || s_showList==='block' || s_showListItem==='block')?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('none');
                                               setShowListItem('none');
                                               setShowList('none');
                                               setShowCSS('none');
                                               setShowMainFile('block');
                                           }
                                           }>Main</a>
                                    </li>}
                        </ul>
                        <div style={{display: `${(s_showModel==='block')?'block':'none'}`}}>
                            <ul className="nav">
                                {s_textModel&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${s_showModel==='block'?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('none');
                                               setShowListItem('block');
                                               setShowList('none');
                                               setShowCSS('none');
                                               setShowMainFile('none');
                                           }
                                           }>
                                            <img src={require('../../open-iconic-master/png/file.png')}
                                                 onClick={
                                                     ()=> {
                                                         let modelContent = s_textModel;
                                                         let modelBlob = new Blob([modelContent], {type: 'text/plain'});
                                                         let modelFile = new File([modelBlob], s_nameModel +".model.js");
                                                         const urlModel = URL.createObjectURL(modelFile)
                                                         const link = document.createElement("a");
                                                         link.href=urlModel;
                                                         link.download=modelFile.name;
                                                         link.click();
                                                     }
                                                 }
                                            />
                                            {(s_nameModel+'.model.js').toLowerCase()}
                                        </a>
                                    </li>}
                            </ul>
                        </div>
                        <div style={{display: `${(s_showService==='block')?'block':'none'}`}}>
                            <ul className="nav">
                                {s_textService&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${s_showService==='block'?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('block');
                                               setShowListItem('none');
                                               setShowList('none');
                                               setShowCSS('none');
                                               setShowMainFile('none');
                                           }
                                           }>
                                            <img src={require('../../open-iconic-master/png/file.png')}
                                                 onClick={
                                                     ()=> {
                                                         let ServiceContent = s_textService;
                                                         let ServiceBlob = new Blob([ServiceContent], {type: 'text/plain'});
                                                         let ServiceFile = new File([ServiceBlob], s_nameModel +".service.js");
                                                         const urlService = URL.createObjectURL(ServiceFile)
                                                         const link = document.createElement("a");
                                                         link.href=urlService;
                                                         link.download=ServiceFile.name;
                                                         link.click();
                                                     }
                                                 }/>
                                            {(s_nameModel +".service.js").toLowerCase()}
                                        </a>
                                    </li>}
                            </ul>
                        </div>
                        <div style={{display: `${(s_showListItem==='block'|| s_showList==='block'|| s_showCSS==='block'||s_showMainFile==='block')?'block':'none'}`}}>
                            <ul className="nav">
                                {s_textListItem&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${s_showListItem==='block'?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('none');
                                               setShowListItem('block');
                                               setShowList('none');
                                               setShowCSS('none');
                                               setShowMainFile('none');
                                            }
                                           }>
                                            <img src={require('../../open-iconic-master/png/file.png')}
                                                 onClick={
                                                     ()=> {
                                                         let ListItemContent = s_textListItem;
                                                         let ListItemBlob = new Blob([ListItemContent], {type: 'text/plain'});
                                                         let ListItemFile = new File([ListItemBlob], s_nameModel +"ListItem.js");
                                                         const urlListItem = URL.createObjectURL(ListItemFile)
                                                         const link = document.createElement("a");
                                                         link.href=urlListItem;
                                                         link.download=ListItemFile.name;
                                                         link.click();
                                                     }
                                                 }/>
                                            {(s_nameModel +"ListItem.js").toLowerCase()}
                                        </a>
                                    </li>}
                                {s_textList&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${s_showList==='block'?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('none');
                                               setShowListItem('none');
                                               setShowList('block');
                                               setShowCSS('none');
                                               setShowMainFile('none');
                                           }
                                           }>
                                            <img src={require('../../open-iconic-master/png/file.png')} onClick={
                                                ()=> {
                                                    let ListContent = s_textList;
                                                    let ListBlob = new Blob([ListContent], {type: 'text/plain'});
                                                    let ListFile = new File([ListBlob], s_nameModel +"List.js");
                                                    const urlList = URL.createObjectURL(ListFile)
                                                    const link = document.createElement("a");
                                                    link.href=urlList;
                                                    link.download=ListFile.name;
                                                    link.click();
                                                }
                                            }/>
                                            {(s_nameModel +"List.js").toLowerCase()}
                                        </a>
                                    </li>}
                                {s_textCSS&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${s_showCSS==='block'?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('none');
                                               setShowListItem('none');
                                               setShowList('none');
                                               setShowCSS('block');
                                               setShowMainFile('none');
                                           }
                                           }>
                                            <img src={require('../../open-iconic-master/png/file.png')} onClick={
                                                ()=> {
                                                    let CSSContent = s_textCSS;
                                                    let CSSBlob = new Blob([CSSContent], {type: 'text/plain'});
                                                    let CSSFile = new File([CSSBlob], s_nameModel +".module.scss");
                                                    const urlCSS = URL.createObjectURL(CSSFile)
                                                    const link = document.createElement("a");
                                                    link.href=urlCSS;
                                                    link.download=CSSFile.name;
                                                    link.click();
                                                }
                                            }/>
                                            {(s_nameModel +".module.scss").toLowerCase()}
                                        </a>
                                    </li>}
                                {s_textMainFile&&
                                    <li className="nav nav-pills">
                                        <a className={`nav-link${s_showMainFile==='block'?' active':''}`} href="#"
                                           onClick={()=>{
                                               setShowModel('none');
                                               setShowService('none');
                                               setShowListItem('none');
                                               setShowList('none');
                                               setShowCSS('none');
                                               setShowMainFile('block');
                                           }
                                           }>
                                            <img src={require('../../open-iconic-master/png/file.png')} onClick={
                                                ()=> {
                                                    let MainFileContent = s_textMainFile;
                                                    let MainFileBlob = new Blob([MainFileContent], {type: 'text/plain'});
                                                    let MainFileFile = new File([MainFileBlob], s_nameModel +".js");
                                                    const urlMainFile = URL.createObjectURL(MainFileFile)
                                                    const link = document.createElement("a");
                                                    link.href=urlMainFile;
                                                    link.download=MainFileFile.name;
                                                    link.click();
                                                }
                                            }/>
                                            {(s_nameModel +".js").toLowerCase()}
                                        </a>
                                    </li>}
                                </ul>
                        </div>
                        <textarea
                            id='textareaModel'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showModel}}
                            value = {s_textModel}
                        />
                        <textarea
                            id='textareaListItem'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showListItem}}
                            value = {s_textListItem}
                        />
                        <textarea
                            id='textareaList'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showList}}
                            value = {s_textList}
                        />
                        <textarea
                            id='textareaCSS'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showCSS}}
                            value = {s_textCSS}
                        />
                        <textarea
                            id='textareaMainFile'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showMainFile}}
                            value = {s_textMainFile}
                        />
                        <textarea
                            id='textarea'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showService}}
                            value = {s_textService}
                        />
                    </div>
                }
            <div id={'editor'}>
                <div id={'editor-elem'} className={styles.mydiv}>
                    <div className={styles.mydivheader}>Click here to move</div>
                    <p>Move</p>
                    <p>this</p>
                    <p>DIV</p>
                </div>
            </div>
                {dragElement(document.getElementById('editor-elem'),document.getElementById('editor'))}
            </div>
            <div id='view' className="bd-highlight col-example bg-primary"  style={{ width:'30%' }}>
                <div className="p-3 w-100">
                    <div className={'bg-light'} style={{"height": `${1080*0.9}px`, "overflow":"auto"}}>
                        <div id={'div_for_tree'}>
                            <ul>
                                {s_treeList&&s_treeList}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function logpos(x,y){
    console.log("x:",x,"\ty:",y);
}

function dragElement(elmnt,outcntnr) {
    if(elmnt){
        console.log(elmnt.getBoundingClientRect());
    }
    if(outcntnr){
        console.log(outcntnr.getBoundingClientRect());
    }
    // console.log(document.getElementById(elmnt).getBoundingClientRect())
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if(elmnt){
        if (document.getElementById(elmnt)) {
            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt).onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {

        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}




function createList(json,setTreeList,callBack){
    console.log('createList',json)
    var list =
        json&&Object.keys(json).map((item, i) => (
            <li key={`${i}-${item}`} className="list-group-item">
                <Button onClick={(e)=>{
                                        callBack(json[item]); // надо сделать каскадное разворачивание элементов
                                        // console.log("key",e.key)
                                        // let vl =
                                        //     <ul>
                                        //         {Object.keys(json[item]).map((vitem, vi)=>(
                                        //             <li key={`${vi}-${vitem}`} className="list-group-item">
                                        //                 <Button>{vitem}</Button>
                                        //             </li>
                                        //         ))}
                                        //     </ul>;
                                     }
                }>{item}</Button>
            </li>
        ));
    if(json) setTreeList(list);
}

function getSwagger(url, setSwaggerTree){
    let stree='<ul>';
    (async () => {
        let response = await fetch(url);
        let jsonSwagger = await response.json();
        // setSwaggerTree(jsonSwagger['paths']);
        setSwaggerTree(jsonSwagger['definitions']);
    })();
}


/* Функция для составления текста для файла модели на основе модели из SWAGGER
* @params JsonModel - модель в формет json
* @params swaggerUrl - url из  SWAGGER
* @params nameModel - имя модели
* @author - KudryavtsevIV
* @date - 2022/06/21
* @description функция составляет текст для файла модели, который включает в себя список полей, количество записей на страницу и экспорт созданных объектов
* @returns Model <text> - текст файла модели
* */
function buildModel(JsonModel, nameModel, swaggerUrl ='/#YOU_FUCKING_URL/'){
//#ИМЯ_МОДЕЛИ #МОДЕЛЬ_ДАННЫХ #МОДЕЛЬ_ДЛЯ_ТАБЛИЦЫ #МОДЕЛЬ_ДЛЯ_ФИЛЬТРОВ #SWAGGER
//     console.log('JsonModel',JsonModel)
    let vJsonModel = JsonModel;
    let vNameModel = nameModel;// наименование модели #ИМЯ_МОДЕЛИ
    let bodyModel = vJsonModel[vNameModel];
    // пока без проверки на наличие ключа properties
    let fieldsModel = JsonModel["properties"];
    // console.log("fieldsModel",fieldsModel)
    let key;
    let sfields; // поля для модели
    for(key in fieldsModel) { // надо прикрутить фичу с сортировкой поле по наименованию поля!!!
        console.log( 'name:'+key);
        console.log( 'type:'+fieldsModel[key]["type"])
        console.log( 'description:'+fieldsModel[key]["description"])
        sfields=sfields+
        '{\n'+
        '   field: \''+key+'\',\n'+
        '   headerName: \''+fieldsModel[key]["description"]+'\',\n' +
        '   width: 120,\n'+
        '   datatype: \''+fieldsModel[key]["type"]+'\',\n'+
        '},\n';
    }
    let Model = // составлениие модели по полям
    'import React from \'react\';\n'+
    'import { FontAwesomeIcon } from \'@fortawesome/react-fontawesome\';\n\n'+
    'import { Button } from \'../components\';\n'+
    'import { withColumnsTitle2 } from \'../utils\';\n'+
    'import { FontAwesomeIcon } from \'@fortawesome/react-fontawesome\';\n\n'+
    'const '+vNameModel+'ColumnDefs = (history) => {\n'+ // добавление имени миодели в название полей #ИМЯ_МОДЕЛИ
    '  return withColumnsTitle2([\n'+
        sfields+
    '{\n'+
    ' field: \'action\',\n'+
    ' headerName: \'\',\n ' +
    ' headerTooltip: \'Подробно\',\n' +
    ' width: 60,\n' +
    ' resizable: false,\n' +
    ' notFiltered: true,\n' +
    ' notSorted: true,\n' +
    ' pinned: \'right\',\n' +
    ' lockPinned: true,\n' +
    ' serviceField: true,\n' +
    ' hidden: true,\n' +
    ' cellRendererFramework: (params) => {\n' +
    ' const row = params.data;\n' +
    ' return (\n' +
    '     <Button color=\"secondary\"' +
    '         size=\"sm\"' +
    '         outline' +
    '         onClick={() => history.push(\''+swaggerUrl+'\' + row.id)}>\n' + //#URL
    '         <FontAwesomeIcon icon=\"info\" fixedWidth />\n' +
    '     </Button>\n' +
    '     );\n' +
    '      },\n' +
    '}\n' +
    ']);\n' +
    '};\n' +
    '\n' +
    'const '+vNameModel+'PageSize = 14;\n\n' +// добавление имени миодели #ИМЯ_МОДЕЛИ
    'export { '+vNameModel+'ColumnDefs, '+vNameModel+'PageSize };\n'+
    '// не забудьте ↓↓↓↓ прописать Модель в файл импорта "index.js" \n'+
    '// export * from \'./'+vNameModel+'.model\';'; // добавление имени миодели #ИМЯ_МОДЕЛИ
    return Model;
}

/* Функция для составления текста для файла сервисов на основе модели из SWAGGER
* @params JsonModel - модель в формет json
* @params swaggerUrl - url из  SWAGGER
* @params nameModel - имя модели
* @author - KudryavtsevIV
* @date - 2022/06/21
* @description функция составляет текст для файла модели, который включает в себя список полей, количество записей на страницу и экспорт созданных объектов
* @returns "Service" <text> - текст файла сервисов
* */
function buildServices(JsonModel, nameModel, swaggerUrl ='/#YOU_FUCKING_URL/'){
    let vJsonModel = JsonModel;
    let vNameModel = nameModel;// наименование модели
    let bodyModel = vJsonModel[vNameModel];
    console.log(bodyModel)
    let descriptionServise =JsonModel["description"];
    // console.log(descriptionServise)
    //пока без проверки на наличие ключа properties
    let fieldsModel = JsonModel["properties"];
    let Service = // составлениие модели по полям
        'import { restService } from \'./rest.service\';\n' +
        'import { RESTSearchParams } from \'../utils\';\n' +
        '\n' +
        'const get'+vNameModel+'Data = (id, filter, sort, page, pageSize) => {\n' +
        '  const sourceName = \''+descriptionServise+'\';\n' +
        '  const url = \''+swaggerUrl+'\';\n' +
        '  const restParams = new RESTSearchParams();\n' +
        '  restParams.setFilter(filter, \'\');\n' +
        '  restParams.setSort(sort);\n' +
        '  restParams.setPage(page);\n' +
        '  restParams.setPageSize(pageSize);\n' +
        '  return restService\n' +
        '    .get(restParams.getUrl(url), sourceName)\n' +
        '    .then((json) => Promise.resolve({ data: json.content, numberOfElements: json.content.length }))\n' +
        '    .catch((error) => Promise.reject(error));\n' +
        '};\n' +
        '\n' +
        'const get'+vNameModel+'DetailsData = (id) => {\n' +
        '  const sourceName = \''+descriptionServise+' (подробно)\';\n' +
        '  const url = \''+swaggerUrl+'\'+ id;\n' +
        '  const restParams = new RESTSearchParams();\n' +
        '  return restService\n' +
        '    .get(restParams.getUrl(url), sourceName)\n' +
        '    .then((json) => Promise.resolve({ data: [json], numberOfElements: json.length }))\n' +
        '    .catch((error) => Promise.reject(error));\n' +
        '};\n' +
        '\n' +
        'export { get'+vNameModel+'Data, get'+vNameModel+'DetailsData };'
    return Service;
}

function buildListItem(nameModel){
    let ListItem =
    'import React from \'react\';\n' +
    '\n' +
    'import { ListGroup, ListGroupItem, } from \'../../components\';\n' +
    'import { '+nameModel+'ColumnDefs } from \'../../models/'+nameModel+'.model\';\n' +
    '\n' +
    'class '+nameModel+'ListItem extends React.Component {\n' +
    '  constructor(props) {\n' +
    '    super(props);\n' +
    '    this.state = {\n' +
    '      openedList: false,\n' +
    '    };\n' +
    '    this.handleTaskClick = this.handleTaskClick.bind(this);\n' +
    '  }\n' +
    '\n' +
    '  handleTaskClick() {\n' +
    '    this.setState({ openedList: !this.state.openedList });\n' +
    '  }\n' +
    '  render() {\n' +
    '    const { row } = this.props;\n' +
    '    let columnDefs = '+nameModel+'ColumnDefs();\n' +
    '    return (\n' +
    '      <ListGroup key={row.id} className="mb-2">\n' +
    '        {columnDefs.map((item) => {\n' +
    '          const key = item.field;\n' +
    '          return !item.hidden && !item.isDummyField ? (\n' +
    '            <ListGroupItem key={key}>\n' +
    '              <div className="w-100 d-flex">\n' +
    '                <span className="mr-auto ">{item.headerName}</span>\n' +
    '                <span className="text-right ">{row[key]}</span>\n' +
    '              </div>\n' +
    '            </ListGroupItem>\n' +
    '          ) : null;\n' +
    '        })}\n' +
    '        <ListGroupItem className="d-flex">\n' +
    '        </ListGroupItem>\n' +
    '      </ListGroup>\n' +
    '    );\n' +
    '  }\n' +
    '}\n' +
    '\n' +
    'export { '+nameModel+'ListItem };\n';
    return ListItem;
}

function buildList(nameModel){
    let ListItem =
        'import React from \'react\';\n' +
        '\n' +
        'import { '+nameModel+'ListItem } from \'./'+nameModel+'ListItem\';\n' +
        '\n' +
        'class '+nameModel+'List extends React.Component {\n' +
        '  render() {\n' +
        '    const { data, history } = this.props;\n' +
        '    return (\n' +
        '      <React.Fragment>\n' +
        '        {data.map((row) => {\n' +
        '          return <'+nameModel+'ListItem row={row} history={history} />;\n' +
        '        })}\n' +
        '      </React.Fragment>\n' +
        '    );\n' +
        '  }\n' +
        '}\n' +
        'export { '+nameModel+'List };\n';
    return ListItem;
}

function buildCSS(nameModel){
    let css =
    '.'+nameModel.toLowerCase()+'-table {\n' +
    '  height: calc(70vh - 330px)!important;\n' +
    '  overflow-y: auto;\n' +
    '}\n' +
    '\n' +
    '.'+nameModel.toLowerCase()+'-table-mobile {\n' +
    '  height: calc(100vh - 230px - 90px)!important;\n' +
    '  overflow-y: auto;\n' +
    '}\n' +
    '\n';
    return css;
}


function buildMainFile(nameModel){
    let mainfile=
        'import React from \'react\';\n' +
        'import MediaQuery from \'react-responsive\';\n' +
        'import { connect } from \'react-redux\';\n' +
        '\n' +
        'import {\n' +
        '  ButtonGroup,\n' +
        '  ButtonToolbar,\n' +
        '  Card,\n' +
        '  CardHeader,\n' +
        '  CardFooter,\n' +
        '  Container,\n' +
        '  DataLoader,\n' +
        '  DataParams2,\n' +
        '  DataProviderCRUD,\n' +
        '  HeaderMain,\n' +
        '  MultiFilterPopover,\n' +
        '  PageNavigationNP,\n' +
        '  RefreshButton,\n' +
        '} from \'../../components\';\n' +
        '\n' +
        'import { get'+nameModel+'Data } from \'../../services\';\n' +
        '\n' +
        'import { '+nameModel+'ColumnDefs } from \'../../models\';\n' +
        'import { '+nameModel+'List } from \'./'+nameModel+'List\';\n' +
        'import { '+nameModel+'Table } from \'./'+nameModel+'Table\';\n' +
        '\n' +
        'import classes from \'./'+nameModel+'.module.scss\';\n' +
        '\n' +
        'class '+nameModel+' extends React.Component {\n' +
        '  constructor(props) {\n' +
        '    super(props);\n' +
        '    this.state = {};\n' +
        '    this.handleRefresh = this.handleRefresh.bind(this);\n' +
        '  }\n' +
        '\n' +
        '  handleRefresh() {\n' +
        '    this.setState({ refreshId: new Date() });\n' +
        '  }\n' +
        '\n' +
        '  render() {\n' +
        '    const { history, device } = this.props;\n' +
        '    const { refreshId } = this.state;\n' +
        '    const realPageSize = device.selectMobileDevice ? 11 : 15;\n' +
        '    return (\n' +
        '      <Container fluid>\n' +
        '\n' +
        '        <DataParams2\n' +
        '          pageDefault={1}\n' +
        '        // sortDefault={stocksDefaultSortField} filterDefault={stocksDefaultFilterField}\n' +
        '        >\n' +
        '          {(params, setParams) => {\n' +
        '            let filtered = params.filter.length > 0 && Boolean(params.filter[0].val);\n' +
        '            return (\n' +
        '              <DataProviderCRUD\n' +
        '                getData={get'+nameModel+'Data}\n' +
        '                pageSize={realPageSize}\n' +
        '                filter={params.filter}\n' +
        '                sort={params.sort}\n' +
        '                page={params.page}\n' +
        '                refreshId={refreshId}>\n' +
        '                {(provider) => {\n' +
        '                  const { loading, lastPage, totalPages, data, error } = provider.state;\n' +
        '                  let noData = !data || data.length === 0;\n' +
        '                  return (\n' +
        '                    <React.Fragment>\n' +
        '                      <div className="d-flex">\n' +
        '                        <div>\n' +
        '                          <HeaderMain title="Состояние КАН" />\n' +
        '                        </div>\n' +
        '                        <div className="ml-auto">\n' +
        '                          <ButtonToolbar>\n' +
        '                            <ButtonGroup className="mb-3 mt-1">\n' +
        '                              <RefreshButton\n' +
        '                                loading={loading}\n' +
        '                                handleRefresh={() => {\n' +
        '                                  // this.handleClickRow(this.state.selRow);\n' +
        '                                  provider.refreshData();\n' +
        '                                }}\n' +
        '                              />\n' +
        '                            </ButtonGroup>\n' +
        '                          </ButtonToolbar>\n' +
        '                        </div>\n' +
        '                      </div>\n' +
        '                      <MediaQuery minWidth={768}>\n' +
        '                        <Card                       >\n' +
        '                          <CardHeader>\n' +
        '                            <MultiFilterPopover\n' +
        '                              clearButton\n' +
        '                              filterFields={'+nameModel+'ColumnDefs()}\n' +
        '                              activeFilter={params.filter0}\n' +
        '                              onFilterValue={(filter) => {\n' +
        '                                setParams({ filter0: filter });\n' +
        '                              }}\n' +
        '                            />\n' +
        '                          </CardHeader>\n' +
        '                          <div className={classes[\''+nameModel.toLowerCase()+'-table\']} >\n' +
        '                            <DataLoader\n' +
        '                              className="ml-3 mt-3"\n' +
        '                              loading={loading}\n' +
        '                              loadingText="Загрузка данных..."\n' +
        '                              error={error}\n' +
        '                              errorText="Ошибка загрузки данных"\n' +
        '                              noData={noData}\n' +
        '                              noDataText={filtered ? \'Совпадений не найдено\' : \'Нет данных\'}>\n' +
        '                              <'+nameModel+'Table\n' +
        '                                data={data}\n' +
        '                                history={history}\n' +
        '                                onDeleteEnd={this.handleDeleteEnd}\n' +
        '                                activeSort={params.sort}\n' +
        '                                onChangeParam={(sort) => setParams({ sort: sort })}\n' +
        '                              />\n' +
        '                            </DataLoader>\n' +
        '                          </div>\n' +
        '                          <CardFooter className="d-flex justify-content-center pb-0">\n' +
        '                            <PageNavigationNP\n' +
        '                              currentPage={params.page}\n' +
        '                              nextPage={(page) => setParams({ page: page })}\n' +
        '                              lastPage={lastPage}\n' +
        '                              totalPages={totalPages}\n' +
        '                            />\n' +
        '                          </CardFooter>\n' +
        '                        </Card>\n' +
        '\n' +
        '                      </MediaQuery>\n' +
        '                      <MediaQuery maxWidth={767.99}>\n' +
        '                        <div className="mb-2">\n' +
        '                          <MultiFilterPopover\n' +
        '                            clearButton\n' +
        '                            filterFields={'+nameModel+'ColumnDefs()}\n' +
        '                            activeFilter={params.filter}\n' +
        '                            onFilterValue={(filter) => {\n' +
        '                              setParams({ filter0: filter });\n' +
        '                            }}\n' +
        '                          />\n' +
        '                        </div>\n' +
        '                        <DataLoader\n' +
        '                          className="ml-3 mt-3"\n' +
        '                          loading={loading}\n' +
        '                          loadingText="Загрузка данных..."\n' +
        '                          error={error}\n' +
        '                          errorText="Ошибка загрузки данных"\n' +
        '                          noData={noData}\n' +
        '                          noDataText={filtered ? \'Совпадений не найдено\' : \'Нет данных\'}>\n' +
        '                          <'+nameModel+'List data={data} history={history}></'+nameModel+'List>\n' +
        '                        </DataLoader>\n' +
        '                        <div className="d-flex justify-content-center">\n' +
        '                          <PageNavigationNP\n' +
        '                            currentPage={params.page}\n' +
        '                            nextPage={(page) => setParams({ page: page })}\n' +
        '                            lastPage={lastPage}\n' +
        '                            totalPages={totalPages}\n' +
        '                          />\n' +
        '                        </div>\n' +
        '                      </MediaQuery>\n' +
        '                    </React.Fragment>\n' +
        '                  );\n' +
        '                }}\n' +
        '              </DataProviderCRUD>\n' +
        '            );\n' +
        '          }}\n' +
        '        </DataParams2>\n' +
        '      </Container >\n' +
        '    );\n' +
        '  }\n' +
        '}\n' +
        'const mapStateToProps = (store) => {\n' +
        '  return {\n' +
        '    // user: store.user,\n' +
        '    pages: store.pages,\n' +
        '    device: store.device,\n' +
        '  };\n' +
        '};\n' +
        '\n' +
        'export default connect(mapStateToProps)('+nameModel+');\n';
    return mainfile;
}

export default MainBoard;