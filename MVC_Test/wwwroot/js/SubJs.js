
 //fetch API
async function GetData(url, params = null) {
    //alert("getData")

    ShowLoading(true);
    var serviceUrl = url;

    if (params != null) {
        serviceUrl = url + "?" + new URLSearchParams(params);
    };

    let ReturnData = await fetch(serviceUrl, {
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: { 'content-type': 'application/json' },
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        referrer: 'no-referrer', // *client, no-referrer
    }).then(response => response.json()) // 輸出成 json
        .catch((error) => {
            alert("getData Error : " + error);
            console.log(error);
        })

    ShowLoading(false);

    return ReturnData;
}


//自動比對欄位，若欄位名稱設定相符，則自動帶出欄位
//TbodyID = 表格元素 tbody 的 ID
//ObjDatas = 物件陣列 [{}]
async function ShowData(TbodyID, ObjDatas) {
    //console.log(ObjData);
    if (!ObjDatas) return;

    let Tb = document.getElementById(TbodyID);
    if (!Tb) return;

    DeleteTable(Tb.parentNode.id);   //先清空資料

    //後端回傳的物件屬性 統一改成大寫英文，方便前端Html欄位名稱比對
    ObjDatas = ObjKeytoUpper(ObjDatas);


    let Ths = Tb.parentNode.querySelectorAll("th");
    for (let r = 0; r < ObjDatas.length; r++) {
        NewTr = document.createElement("tr");
        //自動比對欄位名稱，欄位名稱相符才增加td
        for (let c = 0; c < Ths.length; c++) {
            const Th = Ths[c];
            const ColNm = Th.dataset.colnm;  //定義的DB欄位名稱(自定義屬性)
            const ColNmUp = ColNm.toUpperCase();  //英文大寫的屬性名稱，做比對用
            //console.log(ColNmUp in ObjDatas[0]);

            //判斷Th欄位名稱 是否有在回傳的第1筆資料內，若有 => 增加td
            if (ColNmUp in ObjDatas[0]) {
                NewTd = document.createElement("td");
                NewTd.dataset.colnm = ColNm //使用Th的ColNm
                NewTd.innerText = ObjDatas[r][ColNmUp];
                //如果Th欄位隱藏，後面資料也跟著隱藏
                if (Th.classList.contains("d-none")) NewTd.classList.add("d-none");
                NewTr.appendChild(NewTd);
            }
            else Ths[c].classList.add("d-none"); //若資料沒有Th欄位 => 隱藏th，添加Class d-none 隱藏Th
        }

        Tb.appendChild(NewTr);
    }

}



async function PostData(url, data) {
    // Default options are marked with *
    let ReturnData = await fetch(url, {
        body: JSON.stringify(data), // must match 'Content-Type' header
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, same-origin, *omit
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        referrer: 'no-referrer', // *client, no-referrer
    }).then(response => response.json()) // 輸出成 json
        .catch((error) => {
            alert("postData Error : " + error);
            console.log(error);
        })

    ShowLoading(false);
    return ReturnData;
}


//刪除Table資料
function DeleteTable(TableID) {
    var tbody = document.querySelector(`#${TableID} tbody`)
    tbody.innerHTML = "";  
}


//統一把物件陣列屬性改為大寫英文字母，方便比對
//Objs = 物件陣列
function ObjKeytoUpper(Objs) {
    return NewObjs = Objs.map(obj => {
        let NewObj = {};
        for (const Key in obj) {
            let Value = obj[Key];
            let NewKey = Key.toUpperCase(); //改大寫英文字母
            NewObj[NewKey] = Value;
        }
        return NewObj;
    });
}



//取得輸入元件內的值，回傳物件
function GetModalVal(ModalID) {
    //Modal內 有data-colnm 屬性的輸入元件(input/select)
    let Inputs = document.querySelectorAll(`#${ModalID} [data-colnm]`);
    let InpObj = {};
    Array.from(Inputs).forEach(inp => InpObj[inp.dataset.colnm] = inp.value);
    return InpObj
}


//點擊Tbody內元素， 選擇Tr
function ChooseTr(e) {
    var TriEl = e.target; //觸發事件的元素
    //console.log(TriEl.tagName);
    //如果觸發元素是 TD、SELECT、INPUT，才去找Tr
    if ("TD, SELECT, INPUT".indexOf(TriEl.tagName) == -1) return;

    //觸發元素往上找到Tr 節點層
    let TriElUp1 = TriEl.parentNode;     //觸發元素 的父層
    let TriElUp2 = TriElUp1.parentNode;  //觸發元素 往上2層

    let Tr = TriElUp1.tagName == "TR" ? TriElUp1 :
        TriElUp2.tagName == "TR" ? TriElUp2 : null;
    //console.log(Tr);  
    if (Tr != null) SetTrActive(Tr);
}

//tr元素，添加Class = 'Active'
function SetTrActive(Tr) {
    //Tbody內所有tr元素 移除Class:"Active"
    let Tb = Tr.parentNode;
    Tb.childNodes.forEach(tr => {
        if (tr.tagName == "TR") tr.classList.remove("Active");
    });

    Tr.classList.add("Active");
}

//把Tr的資料帶到Modal 裡面對應的 輸入元件(編輯模式使用)
//Tr:Tr物件
//ModalID:模組ID
function TrtoModal(Tr, ModalID) {
    //alert("TrtoModal");
    if (!Tr) return null;

    //Tr 轉成 物件，屬性名稱 = Td自訂屬性 data-colnm
    let Tds = Tr.querySelectorAll("td");
    let TrObj = {};
    for (let i = 0; i < Tds.length; i++) {
        const Td = Tds[i];
        const ColNm = Td.dataset.colnm.toUpperCase(); //統一轉大寫比對
        const Val = Td.innerText;
        TrObj[ColNm] = Val;

        if (ColNm === "GENDER") {
            TrObj[ColNm] = Val == "男" ? "1" : "0";
        }
    }
    //console.log(TrObj);

    //Modal內 有data-colnm 屬性的輸入元件(input/select)
    let Inps = document.querySelectorAll(`#${ModalID} [data-colnm]`);

    for (let i = 0; i < Inps.length; i++) {
        const Inp = Inps[i];
        const ColNm = Inp.dataset.colnm.toUpperCase(); //統一轉大寫比對
        //如果找到對應的Td，則把值填入Input
        if (TrObj[ColNm]) Inp.value = TrObj[ColNm]; 
    }
}


function DisableInput(ModalID, IsDisable) {
    //Modal內 有data-colnm 屬性的輸入元件(input/select)
    let Inps = document.querySelectorAll(`#${ModalID} [data-colnm]`);
    Inps.forEach(Inp => Inp.disabled = IsDisable)
}



//IsShow = True/False
function ShowLoading(IsShow) {
    //console.log(document.getElementById("Loading"));
    if (!document.getElementById("Loading")) {
        let btn = document.createElement("button");
        btn.classList.add("btn", "btn-primary", "d-none");
        btn.id = "Loading";
        btn.type = "button";
        btn.setAttribute("disabled", "disabled");
        btn.innerHTML += '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Loading...';
        document.body.appendChild(btn);
    }

    let LoadImg = document.getElementById("Loading");
    LoadImg.classList.add("d-none"); //先統一新增d-none 再依判斷移除
    if (IsShow) LoadImg.classList.remove("d-none");
}
