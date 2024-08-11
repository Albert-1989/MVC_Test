//查詢按鈕
document.getElementById("BtnMemberSch").addEventListener("click", MemberSch);
async function MemberSch(e) {
    //alert("MemberSch");

    let Result;
    await GetData("/Home/GetMemberData").then(data => Result = data);
    //console.log(Result);

    if (!Result) return; 
    if (Result.msg != "OK") { alert(Result.msg); return; }

    //整理資料
    let Datas = Result.datas.map(obj => {
        obj.birthday = obj.birthday.slice(0, 10)
        obj.gender = obj.gender === '1'? "男" : "女";
        return obj
    })
    //console.log(Datas);

    //帶出資料
    ShowData("Tbd_Member", Datas); 

};

//選擇的Tr 添加Class & 改變顏色
document.getElementById("Tbd_Member").addEventListener("click", ChooseTr);


//新增按鈕
document.getElementById("BtnMemberAdd").addEventListener("click", MemberAdd);
async function MemberAdd() {
    //alert("MemberAdd");
    document.querySelector("#EditModal h5").innerText = "會員資料-新增";
    //清空 Input 資料
    document.getElementById("EditForm").reset();
    DisableInput("EditModal", false);
}

//修改按鈕
document.getElementById("BtnMemberEdit").addEventListener("click", MemberEdit);
async function MemberEdit() {
    //alert("MemberEdit");
    document.querySelector("#EditModal h5").innerText = "會員資料-修改";
    //帶入 Input 資料
    let Tr = document.querySelector("#Tbd_Member tr.Active")
    if (!Tr) return;

    TrtoModal(Tr, "EditModal");
    DisableInput("EditModal", false);

    let EditModal = document.getElementById("EditModal")
    new bootstrap.Modal(EditModal).show();

}

//刪除按鈕
document.getElementById("BtnMemberDel").addEventListener("click", MemberDel);
async function MemberDel() {
    //alert("MemberDel");
    document.querySelector("#EditModal h5").innerText = "會員資料-刪除";
    //帶入 Input 資料
    let Tr = document.querySelector("#Tbd_Member tr.Active")
    if (!Tr) return;

    TrtoModal(Tr, "EditModal");
    DisableInput("EditModal", true);

    let EditModal = document.getElementById("EditModal")
    new bootstrap.Modal(EditModal).show();

}


//修改確認按鈕(新增/修改/刪除)
document.getElementById("BtnEditCfm").addEventListener("click", EditCfm);
async function EditCfm() {
    //alert("EditCfm");

    let h5 = document.querySelector(`#EditModal h5`).innerText;
    let OPType = h5.split('-')[1];
    let Member = GetModalVal("EditModal");

    //刪除確認
    if (OPType === "刪除") {
        if (!confirm("確定要刪除此筆資料?")) return;
    }
        
    //資料防呆
    if (!InputDataChk("EditForm")) return;
    if (Member.Id === "") delete Member.Id
    //console.log(Member);

    let Param = {
        OPType: OPType,
        Param: Member
    }
    //console.log(Param);

    let Result;
    await PostData("/Home/EditMemberData", Param).then(data => Result = data);
    //console.log(Result);

    if (!Result) return;
    if (Result.msg != "OK") { alert(Result.msg); return; }

    //關閉 bootstrap modal
    document.getElementById("BtnCancel").click();

    MemberSch();
    alert(`${OPType}成功!`);
}



//新增/編輯 資料防呆
function InputDataChk(FormID) {
    //有設定 Need Class 的欄位，必須有值
    let Inps = document.querySelectorAll(`#${FormID} .Need[data-colnm]`);
    //console.log(Inps);

    for (let i = 0; i < Inps.length; i++) {
        let Inp = Inps[i];
        let ColNm = Inp.dataset.colnm;
        let Param = Inp.parentNode.querySelector("span").innerText;
        //console.log(Inp);  
        if (Inp.value == "") {
            
            if (!Param) continue;
            alert(`<${Param}>必須輸入!`);
            return false;
        }

        //if (ColNm === "Phone") {
        //    const regex = /^(\+886|0){1}\d{9,9}$/g;
        //    if (!Inp.value.match(regex)) {
        //        alert(`<${Param}>格式錯誤!`);
        //        return false;
        //    }
        //}

        //if (ColNm === "Tel") {
        //    const regex = /^[\d-]{8,}$/g;
        //    if (!Inp.value.match(regex)) {
        //        alert(`<${Param}>格式錯誤!`);
        //        return false;
        //    }
        //}
    }


    return true;
}

//Test
document.getElementById("BtnTest").addEventListener("click", Test);
function Test() {



}