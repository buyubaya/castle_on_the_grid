import React, { Component } from 'react';


class Grid extends Component {
    constructor(){
        super();

        this.state = {
            size: 8,
            grid: [],
            startCell: [6, 4],
            endCell: [7, 6]
        };
    }

    componentWillMount(){
        this._initGrid();
    }

    _initGrid(){
        let { grid, size } = this.state;

        for(let i=0; i < size; i++){
            grid[i] = [];
            for(let j=0; j < size; j++){
                grid[i].push('.');
            }
        }
        
        grid[3][4] = null;
        grid[4][4] = null;
        grid[5][4] = null;
        grid[6][5] = null;
        grid[7][5] = null;

        this.setState({ grid });
    }

    _minimumMoves(grid, startCell, endCell){
        let currentCell = [...startCell, 0];
        let queue = [currentCell];
        let prev = {
            [`${currentCell[0]}_${currentCell[1]}`]: [currentCell]
        };

        while(queue.length > 0){
            currentCell = queue[0];
            queue = queue.slice(1);
            const a = this._findValidCell(grid, currentCell, prev);

            if(!this._isFound(a, endCell)){
                for(let i=0, len=a.length; i < len; i++){
                    queue.push(a[i]);
                }
            }
        }

        const p = this._traceBack(prev, endCell);
        return this._formatP(p);
    }

    _findValidCell(grid, loc, prev){
        let tmp = [];
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        dirs.forEach(d => {
            const newI = loc[0] + d[0];
            const newJ = loc[1] + d[1];
            const newCost = loc[2] + 1;

            if(this._isValidCell(grid, [newI, newJ])){
                const fmLoc = `${newI}_${newJ}`;
                if(prev[fmLoc]){
                    if(newCost < prev[fmLoc][2]){
                        prev[fmLoc] = [[loc[0], loc[1], newCost]];
                    }
                    else if(newCost === prev[fmLoc][2]){
                        prev[fmLoc].push([loc[0], loc[1], newCost]);
                    }
                }
                else {
                    tmp.push([newI, newJ, newCost]);
                    prev[fmLoc] = [[loc[0], loc[1], newCost]];
                }
            }
        });

        return tmp;
    }

    _traceBack(prev, endCell){
        let tmp = [];
        let currentCell = endCell;

        while(1){
            const fmLoc = `${currentCell[0]}_${currentCell[1]}`;
            const prevLoc = prev[fmLoc][0];
            let fmData = `${prevLoc[0]}_${prevLoc[1]}`;
            
            if(fmLoc === fmData){
                break;
            }
            else {
                if(prevLoc[0] - currentCell[0] === 0){
                    if(prevLoc[1] - currentCell[1] < 0){
                        fmData += '_LEFT';
                    }
                    if(prevLoc[1] - currentCell[1] > 0){
                        fmData += '_RIGHT';
                    }
                }
                if(prevLoc[1] - currentCell[1] === 0){
                    if(prevLoc[0] - currentCell[0] < 0){
                        fmData += '_UP';
                    }
                    if(prevLoc[0] - currentCell[0] > 0){
                        fmData += '_DOWN';
                    }
                }
                tmp.push(fmData);
            }

            currentCell = prevLoc;
        }

        return tmp;
    }

    _trace(prev, endCell, tmp=[]){
        let currentCell = endCell;

        const key = `${currentCell[0]}_${currentCell[1]}`;
        prev[key].forEach(item => tmp.push(item));

        return tmp;
    }

    _isValidCell(grid, loc){
        if(
            loc[0] >= 0 && loc[0] < grid.length &&
            loc[1] >= 0 && loc[1] < grid.length &&
            grid[loc[0]][loc[1]] !== null
        ){
            return true;
        }
        else {
            return false;
        }
    }

    _isFound(locs, end){
        const fL = `${end[0]}_${end[1]}`;
        const tmp = locs.map(x => `${x[0]}_${x[1]}`);
        if(tmp[fL]){
            return true;
        }
        else {
            return false;
        }
    }

    _formatP(p){
        let tmp = {};

        p.forEach(item => {
            item = item.split('_');
            const key = `${item[0]}_${item[1]}`;
            const [,, ...rest] = item;
            tmp[key] = rest;
        });

        return tmp;
    }

	render() {
        const { grid, size, startCell, endCell } = this.state;
        const styles = {
            grid: {
                width: size * 50
            },
            cell: {
                width: 50,
                height: 50
            }
        };
        const p = this._minimumMoves(grid, startCell, endCell);

		return (
			<div className="grid-wrapper">
				<table className='board' style={styles.grid}>
                    <tbody>
                    {
                        grid.map((row, i) =>
                            <tr key={i}>
                                {
                                    row.map((cell, j) => {
                                        const key = `${i}_${j}`;

                                        return(
                                            <td 
                                                key={j}
                                                className={cell ? 'cell' : 'cell isNull'} 
                                                style={styles.cell}
                                            >
                                                {
                                                    i === startCell[0] && j === startCell[1] &&
                                                    <span className='startCell'></span>
                                                }
                                                {
                                                    i === endCell[0] && j === endCell[1] &&
                                                    <span className='endCell'></span>
                                                }
                                                {
                                                    p[key] && p[key].indexOf('DOWN') > -1 &&
                                                    <span className='line-up'></span>
                                                }
                                                {
                                                    p[key] && p[key].indexOf('UP') > -1 &&
                                                    <span className='line-down'></span>
                                                }
                                                {
                                                    p[key] && p[key].indexOf('RIGHT') > -1 &&
                                                    <span className='line-left'></span>
                                                }
                                                {
                                                    p[key] && p[key].indexOf('LEFT') > -1 &&
                                                    <span className='line-right'></span>
                                                }
                                            </td>
                                        );
                                    })
                                }
                            </tr>
                        )
                    }
                    </tbody>
                </table>
			</div>
		);
	}
}


export default Grid;
