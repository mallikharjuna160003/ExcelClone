// Storage > 2D matrix Basic needed.
let collectedGraphComponent = [];
// let graphComponentMatrix = [];

// for(let i=0;i<rows;i++){
//     let row = [];
//     for(let j=0;j<cols;j++){
//         //Why Array -> More than 1 child relation(dependency)
//         row.push([]);
//         console.log(row);
//     }
//     graphComponentMatrix.push(row);
   
// }
// console.log(graphComponentMatrix);
// True -> Cyclic , False ->Not cyclic
function isGraphCyclic(graphComponentMatrix){
    console.log(graphComponentMatrix);
    // Dependency -> Visited, dfsVisited (2D array)
    let visited =[]; // Node visit trace
    let dfsVisited = []; // stack visited trace

    for(let i=0;i<rows;i++){
        let visitedRow = [];
        let dfsVisitedRow = [];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);

    }

    for( let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(visited[i][j]===false){
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if(response===true) return [i,j]// true; // cycle found return
            }
           
        }
    }
    return null;
}
// Start -> visited(TRUE) and dfsVis(TRUE) 
// End -> dfsVis(FALSE)
// If vis[i][j] => already explored path, So go back no use to explore again.
// Cycle detection condition -> if (visited[i][j]===true && dfsVis[i][j]===true)
// Return --> True  --> cyclic False --> not cyclic
function dfsCycleDetection(graphComponentMatrix,srcr,srcc,visited,dfsVisited){
     visited[srcr][srcc] = true;
     dfsVisited[srcr][srcc] = true;
     // A1 -> [[0,1],[1,0],[5,10], ... ]

     for (let children=0;children < graphComponentMatrix[srcr][srcc].length;children++){
        let [nbrr,nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false){
            let response = dfsCycleDetection(graphComponentMatrix,nbrr,nbrc,visited,dfsVisited);
            console.log(response);
            if (response === true) return true; // Cycle found return immediately
        }
        else if(visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc]===true){
            return true;    
        }
     }

     dfsVisited[srcr][srcc]=false;
     return false;

}