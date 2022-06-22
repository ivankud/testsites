import React, {useEffect, useState} from 'react';
import ToolBar from './ToolBar'
import {Button, textarea} from "react-bootstrap";
import {saveIcon} from '../../open-iconic-master/svg/file.svg';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Scrollspy } from 'reactstrap-scrollspy'

function MainBoard() {
    const [s_nameModel, setNameModel]=useState('');
    const [s_swaggerUrl, setSwaggerUrl]=useState('http://172.16.50.42:9995/soup/v2/api-docs');
    const [s_textModel, setTextModal]=useState('');
    const [s_showModel, setShowModel]=useState('none');
    const [s_textService, setTextService]=useState('');
    const [s_showService, setShowService]=useState('none');
    const [s_swaggerTree, setSwaggerTree]=useState();
    const [s_treeList, setTreeList]=useState();
    useEffect(()=>{getSwagger(s_swaggerUrl, setSwaggerTree)},[]);
    useEffect(()=>{s_swaggerTree&&createList(s_swaggerTree, setTreeList,setTextModal)},[s_swaggerTree]);
    // s_swaggerTree&&createList(s_swaggerTree, setTreeList);
    return (
        <div className="d-flex align-items-stretch bd-highlight example-parent" style={{ height: '1080px', width: '100%' }}>
            <div id='toolbar' className="bd-highlight col-example bg-info"     style={{ width:'20%' }}>
                <div className={'d-flex justify-content-center text-center'}><h2>Поле для ввода URL</h2></div>
                <input id='SwaggerUrlInput' type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                <hr/>
                <div>
                    <div className={'d-flex justify-content-center text-center'}><h2>Поле для ввода модели</h2></div>
                </div>
                <ToolBar model={s_textModel}/>
                <Button
                    onClick={
                        ()=>{
                                let vmodel = document.getElementById('idmodeltextarea').value;
                                let vSwaggerUrl = document.getElementById('SwaggerUrlInput').value;
                                setSwaggerUrl(vSwaggerUrl);
                                let vJsonModel = JSON.parse('{'+vmodel+'}')
                                let nameModel = Object.keys(vJsonModel)[0];// наименование модели #ИМЯ_МОДЕЛИ
                                if(s_nameModel!==nameModel) setNameModel(nameModel);
                                let Model = buildModel(vJsonModel, nameModel,vSwaggerUrl)
                                setTextModal(Model);
                                let Services = buildServices(vJsonModel, nameModel,vSwaggerUrl);
                                setTextService(Services);
                                setShowModel('block');
                                setShowService('none');
                            }
                    }>Сохранить</Button>
            </div>
            <div id='workcpace' className="bd-highlight col-example bg-light"  style={{ width:'50%' }}>
                {(s_textModel||s_textService)&&
                    <div>
                        <ul className="nav">
                            <li className={"nav"}>
                                <Button
                                    id='btnSaveAll'
                                    className={'bg-danger'}
                                      onClick={()=> {
                                          let zip = new JSZip();
                                          let modelContent = s_textModel;
                                          let modelBlob = new Blob([modelContent], {type: 'text/plain'});
                                          let modelFile = new File([modelBlob], s_nameModel +".model");
                                          zip.file(s_nameModel +".model",modelFile);
                                          let serviceContent = s_textService;
                                          let serviceBlob = new Blob([serviceContent], {type: 'text/plain'});
                                          let serviceFile = new File([serviceBlob], s_nameModel +".service.js");
                                          zip.file(s_nameModel +".service.js",serviceFile);
                                          zip.generateAsync({type:"blob"}).then(function(content) {
                                              saveAs(content, s_nameModel +".zip");
                                              }
                                            )
                                        }
                                      } >
                                    <img src={require('../../open-iconic-master/png/file.png')}/>
                                </Button>
                            </li>
                            {s_textModel&&
                                <li className="nav nav-pills">
                                    <a className={`nav-link${s_showModel==='block'?' active':''}`} href="#"
                                       onClick={()=>{
                                                     setShowModel('block');
                                                     setShowService('none');}
                                                }
                                    >Model</a>
                                </li>
                            }
                            {s_textService&&
                                <li className="nav nav-pills">
                                    <a className={`nav-link${s_showService==='block'?' active':''}`} href="#"
                                       onClick={()=>{
                                                     setShowModel('none');
                                                     setShowService('block');}
                                                }>Service</a>
                                </li>}
                        </ul>
                        {/*<label style={{width:'100%', height:"500px", resize: "none", display: s_showModel} value='aadsfasdf'/>*/}
                        <div className={'mb-3 bg-secondary text-white'} style={{display: s_showModel}}>
                            <Button id='btnSaveModel'
                                className={'bg-danger'}
                                onClick={
                                    ()=> {
                                            let modelContent = s_textModel;
                                            let modelBlob = new Blob([modelContent], {type: 'text/plain'});
                                            let modelFile = new File([modelBlob], s_nameModel +".model");
                                            const urlModel = URL.createObjectURL(modelFile)
                                            const link = document.createElement("a");
                                            link.href=urlModel;
                                            link.download=modelFile.name;
                                            link.click();
                                        }
                                    }
                            >
                                <img src={require('../../open-iconic-master/png/file.png')}/>
                            </Button>
                            <label className={'ml-3'}>{(s_nameModel+'.model').toLowerCase()}</label>
                        </div>
                        <textarea
                            id='textarea'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showModel}}
                            value = {s_textModel}
                        />
                        <div className={'mb-3 bg-secondary text-white'} style={{display: s_showService}}>
                            <Button id='btnSaveService' className={'bg-danger'}
                                    onClick={()=> {
                                        let serviceContent = s_textService;
                                        let serviceBlob = new Blob([serviceContent], {type: 'text/plain'});
                                        let serviceFile = new File([serviceBlob], s_nameModel +".service.js");
                                        const urlService = URL.createObjectURL(serviceFile)
                                        const link = document.createElement("a");
                                        link.href=urlService;
                                        link.download=serviceFile.name;
                                        link.click();
                                    }
                                    }
                            >
                                <img src={require('../../open-iconic-master/png/file.png')}/>
                            </Button>
                            <label>{(s_nameModel+'.service.js').toLowerCase()}</label>
                        </div>
                        <textarea
                            id='textarea'
                            style={{width:'100%', height:"500px", resize: "none", display: s_showService}}
                            value = {s_textService}
                        />
                    </div>
                }
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

function createList(json,setTreeList,callBack){
    console.log('createList',json)
    var list =
        json&&Object.keys(json).map((item, i) => (
            <li key={i} className="list-group-item">
                <Button onClick={()=>{callBack(json[item])}}>{item}</Button>
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
    let vJsonModel = JsonModel;
    let vNameModel = nameModel;// наименование модели #ИМЯ_МОДЕЛИ
    let bodyModel = vJsonModel[vNameModel];
    console.log(bodyModel)
    // пока без проверки на наличие ключа properties
    let fieldsModel = bodyModel["properties"];
    let key;
    let sfields; // поля для модели
    for(key in fieldsModel) { // надо прикрутить фичу с сортировкой поле по наименованию поля!!!
        // console.log( 'name:'+key);
        // console.log( 'type:'+fieldsModel[key]["type"])
        // console.log( 'description:'+fieldsModel[key]["description"])
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
    let descriptionServise =bodyModel["description"];
    // console.log(descriptionServise)
    //пока без проверки на наличие ключа properties
    let fieldsModel = bodyModel["properties"];
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

export default MainBoard;