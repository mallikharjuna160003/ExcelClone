let sheetDB = [];
let collectedSheetDB =[]; // All sheets DB

{
    let addSheetBtn = document.querySelector(".sheet-add-icons");
    addSheetBtn.click();
    // handleSheetProperties();
}

// for( let i = 0; i < rows; i++){
//     let sheetRow = [];
//     for(let j = 0;j<cols;j++){
//          let cellProp = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "monospace",
//             fontSize: "14",
//             fontColor: "#000000",
//             BGcolor: "#000000", //For indication purpose(default val)
//             value: "",
//             formula:"",
//             children: []
            
//          } 
//          sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

// Selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic")
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let BGcolor = document.querySelector(".BGcolor-prop");
let alignment = document.querySelectorAll(".alignment");

let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];


let activeColorProp = "#d1d8e0";
let inactiveColorProp = "#ecf0f1";
// Application of two-way binding

// Attach property listeners
bold.addEventListener("click",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.bold = !cellProp.bold; // Data Change
    cell.style.fontWeight = cellProp.bold ? "bold": "normal"; // UI change (1)   
    bold.style.backgroundColor = cellProp.bold ? activeColorProp: inactiveColorProp; // UI change (2)
})

italic.addEventListener("click",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.italic = !cellProp.italic; // Data Change
    cell.style.fontStyle = cellProp.italic ? "italic": "normal"; // UI change (1)   
    italic.style.backgroundColor = cellProp.italic ? activeColorProp: inactiveColorProp; // UI change (2)
})

underline.addEventListener("click",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    // Modification
    cellProp.underline = !cellProp.underline; // Data Change
    cell.style.textDecoration = cellProp.underline ? "underline": "none"; // UI change (1)   
    underline.style.backgroundColor = cellProp.underline ? activeColorProp: inactiveColorProp; // UI change (2)
})

fontSize.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.fontSize = fontSize.value; // Data change
    cell.style.fontSize = cellProp.fontSize + "px";
    fontSize.value = cellProp.fontSize;
})

fontFamily.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.fontFamily = fontFamily.value; // Data change
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value = cellProp.fontFamily;

})

fontColor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.fontColor = fontColor.value; // Data change
    cell.style.color = cellProp.fontColor;
    fontColor.value = cellProp.fontColor;
})

BGcolor.addEventListener("change",(e)=>{
    let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);

    cellProp.BGcolor = BGcolor.value; // Data change
    cell.style.backgroundColor = cellProp.BGcolor;
    BGcolor.value = cellProp.BGcolor;
})

alignment.forEach((alignElem) =>{
    alignElem.addEventListener("click",(e)=>{
        let address = addressBar.value;
        let [cell,cellProp] = getCellAndCellProp(address);

        let alignValue = e.target.classList[0];
        cellProp.alignment = alignValue; // Data Change
        cell.style.textAlign = cellProp.alignment // UI change (1)
        // UI change (2)
        switch(alignValue){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        
    })
})

let allCells = document.querySelectorAll(".cell")
for(let i=0;i<allCells.length;i++){

    addListenerTOAttachCellProperties(allCells[i]);
}

function addListenerTOAttachCellProperties(cell){
    // Work
    cell.addEventListener("click",(e)=>{
        // Apply properties to cells 
        let address = addressBar.value;
        let [rid,cid]= decodeRIDCID_From_Address(address);
        let cellProp = sheetDB[rid][cid];
        cell.style.fontWeight = cellProp.bold ? "bold": "normal"; // UI change (1)
        cell.style.fontStyle = cellProp.italic ? "italic": "normal"; // UI change (1)   
        cell.style.textDecoration = cellProp.underline ? "underline": "none"; // UI change (1)   
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.BGcolor === "#000000" ? "transparent":cellProp.BGcolor;
        cell.style.textAlign = cellProp.alignment; 

       // console.log(cellProp.fontFamily,cellProp.fontSize);
        

        // Apply Properties to UI props container
        bold.style.backgroundColor = cellProp.bold ? activeColorProp: inactiveColorProp;
        italic.style.backgroundColor = cellProp.italic ? activeColorProp: inactiveColorProp; // UI change (2)
        fontColor.value = cellProp.fontColor;
        BGcolor.value = cellProp.BGcolor;
        underline.style.backgroundColor = cellProp.underline ? activeColorProp: inactiveColorProp; // UI change (2)
        fontFamily.value = cellProp.fontFamily;
        fontSize.value = cellProp.fontSize;


         // UI change (2)
         switch(cellProp.alignment){
            case "left":
                leftAlign.style.backgroundColor = activeColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "center":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = activeColorProp;
                rightAlign.style.backgroundColor = inactiveColorProp;
                break;
            case "right":
                leftAlign.style.backgroundColor = inactiveColorProp;
                centerAlign.style.backgroundColor = inactiveColorProp;
                rightAlign.style.backgroundColor = activeColorProp;
                break;
        }
        let formulaBar = document.querySelector(".formula-bar");
        formulaBar.value = cellProp.formula;
        cell.innerText = cellProp.value;

    });
}

function getCellAndCellProp(address){
    let [rid,cid] = decodeRIDCID_From_Address(address);
    // Access cell & storage object
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = sheetDB[rid][cid];
    return [cell,cellProp];
}  

function decodeRIDCID_From_Address(address){
   // address -> "A1"
   let rid = Number(address.slice(1)-1); // "1"
   let cid = Number(address.charCodeAt(0))-65; // "A" -> 65
   console.log(rid,cid);

   return [rid,cid];
}

