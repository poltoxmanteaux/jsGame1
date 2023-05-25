
class Field {
    constructor(size) {
        this.size = size;
        this.drawField(this.size);
    }

    matrixSaved = [];

    drawField(size, matrix = '') {
        if (matrix == '') {

            let matrixToDraw = this.calculateField();
            document.querySelector('#gameField').innerHTML = this.matrixToHtml(matrixToDraw);
        } else {
            document.querySelector('#gameField').innerHTML = this.matrixToHtml(matrix);
        }
    }

    matrixToHtml(matrix = '') { 
        let tableHtmltmp = '<table id="gameTable">\n</table>';
        let rowsArray = new Array(+this.size);
        for(let row = 0; row < +this.size; row++) {
            rowsArray[row] = '<tr>\n</tr>';
            for(let col = 0; col < +this.size; col++) {
                switch (matrix[row][col]) {
                    case 'B':
                        rowsArray[row] = rowsArray[row].replace('</tr>', '<td class="BlueBall">' + matrix[row][col] + '</td>\n</tr>');
                        break;
                    case 'Y':
                        rowsArray[row] = rowsArray[row].replace('</tr>', '<td class="YellowBall">' + matrix[row][col] + '</td>\n</tr>');
                        break;
                    case 'G':
                        rowsArray[row] = rowsArray[row].replace('</tr>', '<td class="GreenBall">' + matrix[row][col] + '</td>\n</tr>');
                        break;
                    case 'R':
                        rowsArray[row] = rowsArray[row].replace('</tr>', '<td class="RedBall">' + matrix[row][col] + '</td>\n</tr>');
                        break;
                    case '':
                        rowsArray[row] = rowsArray[row].replace('</tr>', '<td>' + matrix[row][col] + '</td>\n</tr>');
                        break;
                }
            }
        }
        let tableHtml = tableHtmltmp.replace('>\n<', '>\n' + rowsArray.join('') + '<');
        return tableHtml
    }

    makeSomeBalls() {

        let ballCommonColor = ['R', 'G', 'B', 'Y'];
        let balls = [];

        let rowRand = Math.floor(Math.random() * +this.size);
        let colRand = Math.floor(Math.random() * +this.size);
        let color = ballCommonColor[Math.floor(Math.random()* + ballCommonColor.length)];
        balls.push({
            ballRow: rowRand,
            ballCol: colRand,
            ballColor: color 
        });
        for(let i = 0; i <= 1; i++) {
                do {
                    rowRand = Math.floor(Math.random() * +this.size);
                    colRand = Math.floor(Math.random() * +this.size);
                    color = ballCommonColor[Math.floor(Math.random()* + ballCommonColor.length)];
                } while (balls.some(balls => balls.ballColor === color) || balls.some(balls => (balls.ballRow === rowRand && balls.ballCol === colRand )))
                balls.push({
                    ballRow: rowRand,
                    ballCol: colRand,
                    ballColor: color 
                });
            }

        return balls
    }

    calculateField(matrix = '') {
        if (matrix == '') { 
            var calculatedMatrix = [];
            for(let row = 0; row < +this.size; row++) {
                calculatedMatrix[row] = []
                for(let col = 0; col < +this.size; col++) {
                    calculatedMatrix[row][col] = '';
                }
            }
            let randomizedBall = this.makeSomeBalls();
            for(let i = 0; i <= 2; i++) {
                calculatedMatrix[randomizedBall[i].ballRow][randomizedBall[i].ballCol] = randomizedBall[i].ballColor;
            }
            this.matrixSaved = JSON.parse(JSON.stringify(calculatedMatrix)); 
        } else {
            
            let randomizedBall = this.makeSomeBalls();

            let i = 0;
            do {
                if(matrix[randomizedBall[i].ballRow][randomizedBall[i].ballCol] === '') {
                    matrix[randomizedBall[i].ballRow][randomizedBall[i].ballCol] = randomizedBall[i].ballColor;
                    i++;
                } else {
                    randomizedBall = this.makeSomeBalls();
                }
            } while (i < randomizedBall.length)

            this.drawField(this.size, matrix);

        }
        return calculatedMatrix
    }

    ballIsOnTheWay(path) {

        let wayMatrix = JSON.parse(JSON.stringify(this.matrixSaved)); 
        
        let startPosition = path[0];
        let tmpBall = wayMatrix[startPosition[0]][startPosition[1]];
        let nextStep = [];
        let lastStep = [];
        for(let i = 0; i < path.length - 1; i++) {
            setTimeout(() => {
                lastStep = path[i];
                nextStep = path[i + 1];
                wayMatrix[nextStep[0]][nextStep[1]] = tmpBall;
                wayMatrix[lastStep[0]][lastStep[1]] = '';
                this.drawField(this.size, wayMatrix);
                if (i === path.length - 2) {
                    this.matrixSaved = JSON.parse(JSON.stringify(wayMatrix));
                    this.calculateField(this.matrixSaved);
                    this.delNearBalls(path[path.length - 1]);
                }
            }, 80 * (i + 1)); 
        }

    }

    delNearBalls(endPos) {
        let scoreField = document.querySelector('.score2');
        let ballsToDel = [];
        let currPos = [endPos[0], endPos[1]];

        ballsToDel.push(currPos);
        let indUbora = false;

// GO VERTICAL!
        while (currPos[0] - 1 >= 0 && this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
            if (currPos[0] - 1 >= 0) {
                currPos = [currPos[0] - 1, currPos[1]];
                if (this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
                    ballsToDel.push(currPos);
                    if (ballsToDel.length >= 3) {
                        indUbora = true;
                    }
                }
            }            
        };
        // GO BOTTOM ! ok
        currPos = [endPos[0], endPos[1]];
        while (currPos[0] + 1 < this.size && this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
            if (currPos[0] + 1 < this.size) {
                currPos = [currPos[0] + 1, currPos[1]];
                if (this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
                    
                    ballsToDel.push(currPos);
                    if (ballsToDel.length >= 3) {
                        indUbora = true;
                    }
                }
            }  
        };

        //Lets delete some balls

        if (!indUbora) { 

// GO horizontal!
            currPos = [endPos[0], endPos[1]];
            // GO left!
            while (currPos[1] - 1 >= 0 && this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
                if (currPos[1] - 1 >= 0) {
                    currPos = [currPos[0], currPos[1] - 1];
                    if (this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
                        ballsToDel.push(currPos);
                    }
                }            
            };
        // GO right !
            currPos = [endPos[0], endPos[1]];
            while (currPos[1] + 1 < this.size && this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
                if (currPos[1] + 1 < this.size) {
                    currPos = [currPos[0], currPos[1] + 1];
                    if (this.matrixSaved[currPos[0]][currPos[1]] === this.matrixSaved[endPos[0]][endPos[1]]) {
                        ballsToDel.push(currPos);
                    }
                }  
            };
        }
        let tmpMatrix = JSON.parse(JSON.stringify(this.matrixSaved)); 

        if (ballsToDel.length >= 3) {
            for (let i = 0; i < ballsToDel.length; i++) {
                tmpMatrix[ballsToDel[i][0]][ballsToDel[i][1]] = '';
            }
            this.matrixSaved = JSON.parse(JSON.stringify(tmpMatrix));
            this.drawField(this.matrixSize, this.matrixSaved);
            scoreField.innerHTML = +scoreField.innerHTML + ballsToDel.length;
        }
    }


    moveBall(cellOld, cellNew) {
        let startPos = [cellOld.rowOldPos, cellOld.cellOldPos];
        let endPos = [cellNew.rowNewPos, cellNew.cellNewPos];

        let tmpMatrix = JSON.parse(JSON.stringify(this.matrixSaved));
// №1 - ФОРМИРУЕМ ВОЛНЫ
        let pathNum = 1;
        tmpMatrix[startPos[0]][startPos[1]] = 0;
        let fullDoCycle = false;
        do {
            fullDoCycle = false;
            for (let i = 0; i <= this.size - 1; i++) {
                for (let j = 0; j <= this.size - 1; j++) {
                    if (tmpMatrix[i][j] === pathNum - 1) {
                        if ((i - 1 >= 0) && tmpMatrix[i - 1][j] === '') {
                            tmpMatrix[i - 1][j] = pathNum;
                            fullDoCycle = true;
                        }
                        if (((j + 1) <= (this.size - 1)) && tmpMatrix[i][j + 1] === '') {
                            tmpMatrix[i][j + 1] = pathNum;
                            fullDoCycle = true;
                        }
                        if (((i + 1) <= (this.size - 1)) && tmpMatrix[i + 1][j] === '') {
                            tmpMatrix[i + 1][j] = pathNum;
                            fullDoCycle = true;
                        }
                        if (((j - 1) >= 0) && tmpMatrix[i][j - 1] === '') {
                            tmpMatrix[i][j - 1] = pathNum;
                            fullDoCycle = true;
                        }
                    }
                }
            }
            pathNum++;
            
        } while (tmpMatrix[endPos[0]][endPos[1]] === '' && fullDoCycle);
        if (!fullDoCycle) {
            this.drawField(this.size, this.matrixSaved);
            alert('Нет пути !');
        }
        pathNum--;

// №2 - ВОССТАНАВЛИВАЕМ ПУТЬ
        tmpMatrix[endPos[0]][endPos[1]] = 'ZZZ';
        let currCell = endPos;
        // console.log(tmpMatrix);
        let pathAtoZ = [];
        do {
            let flag = false;
            if ( ( (currCell[0] - 1) >= 0) && tmpMatrix[currCell[0] - 1][currCell[1]] === pathNum - 1 && !flag) {

                flag = true;
                currCell = [currCell[0] - 1, currCell[1]];
                pathAtoZ.unshift(currCell);
            }
            if ( ( (currCell[0] + 1) <= (this.size - 1) ) && tmpMatrix[currCell[0] + 1][currCell[1]] === pathNum - 1  && !flag) {
              
                flag = true;
                currCell = [currCell[0] + 1, currCell[1]];
                pathAtoZ.unshift(currCell);
            }
            if ( ( (currCell[1] - 1) >= 0) && tmpMatrix[currCell[0]][currCell[1] - 1] === pathNum - 1  && !flag) {

                flag = true;
                currCell = [currCell[0], currCell[1] - 1];
                pathAtoZ.unshift(currCell);
            }
            if ( ( (currCell[1] + 1) <= (this.size - 1) ) && tmpMatrix[currCell[0]][currCell[1] + 1] === pathNum - 1  && !flag) {
                
                flag = true;
                currCell = [currCell[0], currCell[1] + 1];
                pathAtoZ.unshift(currCell);
            }
            pathNum--;
        } while (pathNum != 0);

        pathAtoZ.push(endPos);
       
        this.ballIsOnTheWay(pathAtoZ);
    }
}

window.addEventListener('load', function(){
    let btnStart = document.querySelector('.startBtn');
    btnStart.click();
});

document.querySelector('.startBtn').onclick = function() {
    let scoreField = document.querySelector('.score2');
    scoreField.innerHTML = 0;
    var settings = {
        matrixSize: document.querySelector('.matrixSize').value
    }
    gameField = new Field(settings.matrixSize);
    var cellNew = '', rowNew = '';
    var cellOld = null, rowOld = '';

    document.querySelector('#gameField').onclick = function(e) { 
        if(e.target.localName == 'td') { 
            if(e.target.closest('td').innerHTML != '') { 
                cellNew = e.target.closest('td');
                rowNew = cellNew.parentElement;
                if(cellOld == null) { 
                    cellOld = cellNew;
                    rowOld = rowNew;
                    cellNew.classList.toggle('clicked');
                } else { 
                    cellOld.classList.toggle('clicked');
                    cellNew.classList.toggle('clicked');
                }
                cellOld = cellNew;
                rowOld = rowNew;
            } else if(e.target.closest('td').innerHTML == '' && cellOld != null) {
                cellNew = e.target.closest('td');
                rowNew = cellNew.parentElement;
                let cellNewData = {
                    inCellText: cellNew.innerHTML,
                    rowNewPos: rowNew.rowIndex,
                    cellNewPos: cellNew.cellIndex
                }
                let cellOldData = {
                    inCellText: cellOld.innerHTML,
                    rowOldPos: rowOld.rowIndex,
                    cellOldPos: cellOld.cellIndex
                }
                function ZAMmoveball() {
                    gameField.moveBall(cellOldData, cellNewData);
                    cellOld = null;
                }
                ZAMmoveball();
            }
        }
    }
}














