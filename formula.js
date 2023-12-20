
for( let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur",(e)=>{
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;
            if(enteredData === cellProp.value) return;

            cellProp.value = enteredData;
            // If data modified update P-C relation, formula empty, 
            // update children with new hardcoded (modified) value.
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);
        })
    }
}

let formulaBar = document.querySelector('.formula-bar');
console.log(formulaBar);
formulaBar.addEventListener("keydown",async (e)=>{
    let inputFormula = formulaBar.value;
    
    if(e.key === "Enter" && inputFormula){
        console.log("inputFormula",inputFormula);
       // If change in formula, break old Parent-Child relation,
       // evaluate new formula
       let address = addressBar.value;
       let [cell,cellProp] = getCellAndCellProp(address);
       if(inputFormula !== cellProp.formula ){
        console.log("input",inputFormula);
            removeChildFromParent(cellProp.formula);
       }
       addChildToGraphComponent(inputFormula,address);
       // check formula is cyclic or not, then only evaluate.
       // True-> Cycle, False -> Not Cyclic
       let cycleResponse = isGraphCyclic(graphComponentMatrix);

       if(cycleResponse){
           let response = confirm("Your formula is cyclic. Do you want to trace your path?");
           while (response === true ){
              // Keep on tracking color until user is satisfied.
              await isGraphCyclicTracePath(graphComponentMatrix,cycleResponse);
              // want to complete full iteration colr tracking so attach await here also.
              response = confirm("Your formula is cyclic. Do you want to trace your path?");
           }
           removeChildFromGraphComponent(inputFormula,address);
           return;
       }

       let evaluatedValue = evaluateFormula(inputFormula);
       
       // To update UI and cellProp in DB
       setCellUIAndCellProp(evaluatedValue,inputFormula,address );
       //Dependency expression
       addChildToParent(inputFormula);
       // Update parent child values based on dependency
       updateChildrenCells(address);
      
       
    }
})

function removeChildFromGraphComponent(formula,childAddress){
    let [crid,ccid] = decodeRIDCID_From_Address(childAddress);
    let encodedFormula = formula.split(" ");
    console.log(graphComponentMatrix);
    for(let i=0;i<encodedFormula.length;i++){
       let asciiValue = encodedFormula[i].charCodeAt(0);
       if(asciiValue>=65 && asciiValue<=90){
           let [prid, pcid] = decodeRIDCID_From_Address(encodedFormula[i]);
           graphComponentMatrix[prid][pcid].pop();
       }
    }
}

function addChildToGraphComponent(formula, childAddress) {
    console.log("childAddress",formula);
    let [crid, ccid] = decodeRIDCID_From_Address(childAddress);
    console.log(crid,ccid);
    let encodedFormula = formula.split(" ");
    console.log(encodedFormula);
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        console.log(asciiValue);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCID_From_Address(encodedFormula[i]);
            console.log(prid,pcid);
            // B1: A1 + 10
            // rid -> i, cid -> j
            console.log(graphComponentMatrix);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

// implementing DFS
function updateChildrenCells(parentAddress){
    let [parentCell,parentCellProp] = getCellAndCellProp(parentAddress); 
    let children = parentCellProp.children;

    for ( let i = 0; i < children.length; i++ ){
        let childAddress = children[i];
        let [childCell,childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;
        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress);
        updateChildrenCells(childAddress);  
    }
}

function addChildToParent(formula){
    let childAddress = addressBar.value; 
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);//[] = cellProp.value;
        }
    }
}

function removeChildFromParent(formula){

    let childAddress = addressBar.value; 
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [parentCell,parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx,1);
        }
    }
}


function evaluateFormula(formula){
    let encodedFormula = formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
            let [cell,cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue,formula,address ){
    // let address = addressBar.value;
    let [cell,cellProp] = getCellAndCellProp(address);
    cell.innerText = evaluatedValue; // UI Update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}