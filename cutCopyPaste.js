let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i =0;i < rows;i++) {
    for (let j = 0;j < cols;j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}
let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        // Select cells range work
        if (!ctrlKey) return;
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage=[];
        }

        // UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        console.log(rangeStorage);
    })
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

function defaultSelectedCellsUI(){
    for (let i = 0;i < rangeStorage.length;i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}
let copyData = [];
copyBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2) return;
    copyData =[];
    let startRow = rangeStorage[0][0];
    let endRow = rangeStorage[1][0];
    let startCol = rangeStorage[0][1];
    let endCol = rangeStorage[1][1];
    for(let i=startRow;i<=endRow;i++){
        let copyRow = [];
        for(let j=startCol;j<=endCol;j++){
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);
    }
    console.log(copyData);
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click",(e)=>{
    // Paste cells data work
    if(rangeStorage.length<2){
        return;
    }

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);
    //Target
    let address = addressBar.value;
    let [tstrow,tstcol] = decodeRIDCID_From_Address(address);

    // r -> refers copydata row
    // c -> refers copydata col
    for(let i=tstrow,r=0;i<=(tstrow+rowDiff);i++,r++){
        for(let j=tstcol,c=0;j<=(tstcol+colDiff);j++,c++){
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        
            if(!cell) return;
            // DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];
            
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            // UI
            cell.click();
        }
    }


})
let cutData =[]
cutBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2) return;

    let [strow,stcol,endrow,endcol] = [rangeStorage[0][0],rangeStorage[0][1],rangeStorage[1][0],rangeStorage[1][1]];

    for(let i=strow;i<=endrow;i++){
        for(let j=stcol;j<=endcol;j++){
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            //DB
            let cellProp = sheetDB[i][j];
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";
            //UI
            cell.click();
        }  
    }  
    defaultSelectedCellsUI();  
});