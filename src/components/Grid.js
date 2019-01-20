import React, { Component } from 'react';


class Grid extends Component {
    constructor(){
        super();

        this.state = {
            size: 8,
            grid: [],
            startCell: null,
            endCell: null,
            p: {},
            blocks: [],
            isStart: false
        };

        this._start = this._start.bind(this);
        this._find = this._find.bind(this);
        this._reset = this._reset.bind(this);
        this.handleClickCell = this.handleClickCell.bind(this);
    }

    componentWillMount(){
        this._initGrid(8);
    }

    _initGrid(size){
        let grid = [];

        for(let i=0; i < size; i++){
            grid[i] = [];
            for(let j=0; j < size; j++){
                grid[i].push('.');
            }
        }
        
        // grid[3][4] = null;
        // grid[4][4] = null;
        // grid[5][4] = null;
        // grid[6][5] = null;
        // grid[7][5] = null;

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
            else {
                break;
            }
        }
        
        const p = this._trace(prev, endCell);
        return this._getPath(prev, p);
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
                    else if(newCost === prev[fmLoc][0][2]){
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

    _trace(prev, endCell){
        let tmp = [endCell];
        let stack = [endCell];
        let checked = [`${endCell[0]}_${endCell[1]}`];
        
        while(stack.length > 0){
            const currentCell = stack.pop();
            const key = `${currentCell[0]}_${currentCell[1]}`;

            for(let i=0, len=prev[key].length; i<len; i++){
                const k = `${prev[key][i][0]}_${prev[key][i][1]}`;
                if(checked.indexOf(k) < 0){
                    tmp.push(prev[key][i]);
                    stack.push(prev[key][i]);
                    checked.push(k);
                }
            }
        }

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

    _getDirectionByCell(prev, cell){
        let tmp = [];
        const key = `${cell[0]}_${cell[1]}`;

        for(let i=0, len=prev[key].length; i<len; i++){
            if(cell[0] - prev[key][i][0] === 0){
                if(cell[1] - prev[key][i][1] < 0){
                    tmp.push('LEFT');
                }
                if(cell[1] - prev[key][i][1] > 0){
                    tmp.push('RIGHT');
                }
            }
            if(cell[1] - prev[key][i][1] === 0){
                if(cell[0] - prev[key][i][0] < 0){
                    tmp.push('UP');
                }
                if(cell[0] - prev[key][i][0] > 0){
                    tmp.push('DOWN');
                }
            }    
        }
        
        return tmp;
    }

    _getPath(prev, p){
        let tmp = {};

        for(let i=0, len=p.length; i<len; i++){
            const key = `${p[i][0]}_${p[i][1]}`;
            tmp[key] = this._getDirectionByCell(prev, p[i]);
        }

        return tmp;
    }

    handleClickCell(cell){
        let { grid, blocks } = this.state;

        if(this.startRadio.checked){
            this.setState({ startCell: cell });
        }

        if(this.endRadio.checked){
            this.setState({ endCell: cell });
        }

        if(this.blockRadio.checked){
            if(grid[cell[0]][cell[1]] === null){
                grid[cell[0]][cell[1]] = '.';
                blocks = blocks.filter(item => item !== `${cell[0]}_${cell[1]}`);
            }
            else {
                grid[cell[0]][cell[1]] = null;
                blocks.push(`${cell[0]}_${cell[1]}`);
            }
            this.setState({ grid, blocks });
        }
    }

    _find(){
        const { grid, startCell, endCell } = this.state;
        const p = this._minimumMoves(grid, startCell, endCell);
        this.setState({ p });
    }

    _start(){
        this.setState(
            { isStart: true, size: this.sizeInput.value || 8 },
            () => this._initGrid(this.sizeInput.value || 8)
        );
    }

    _reset(){
        this.setState({
            size: 8,
            grid: [],
            startCell: null,
            endCell: null,
            p: {},
            blocks: [],
            isStart: false
        });
    }

	render() {
        const { isStart, grid, size, startCell, endCell, p, blocks } = this.state;
        const styles = {
            grid: {
                width: size * 50
            },
            cell: {
                width: 50,
                height: 50
            }
        };

		return (
			<div className="grid-wrapper">
                {
                    <div className={isStart ? 'form-start-area isHidden' : 'form-start-area'}>
                        <div className='sizeNumber'>
                            <input ref={el => this.sizeInput = el} type='text' defaultValue={8} />
                        </div>
                        <button className='btn-start' onClick={this._start}>Start</button>
                    </div>
                }
				{
                    isStart &&
                    <div>
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
                                                        className={blocks.indexOf(key) > -1 ? 'cell isNull' : 'cell'} 
                                                        style={styles.cell}
                                                        onClick={() => this.handleClickCell([i, j])}
                                                    >
                                                        {
                                                            startCell && i === startCell[0] && j === startCell[1] &&
                                                            <span className='startCell'></span>
                                                        }
                                                        {
                                                            endCell && i === endCell[0] && j === endCell[1] &&
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
                    
                        <div className='options-area'>
                            <div className='radio-area'>
                                <div className='input-radio start'>
                                    <label>
                                        <input type='radio' name='cellType' className='cellType' defaultChecked={true} ref={el => this.startRadio = el} />
                                        <span>Start Point</span>  
                                    </label>
                                </div>
                                <div className='input-radio end'>
                                    <label>
                                        <input type='radio' name='cellType' className='cellType' ref={el => this.endRadio = el} />
                                        <span>End Point</span>
                                    </label>
                                </div>
                                <div className='input-radio block'>
                                    <label>
                                        <input type='radio' name='cellType' className='cellType' ref={el => this.blockRadio = el} />
                                        <span>Block</span>
                                    </label>
                                </div>
                            </div>
                            <div className='btn-area'>
                                <button className='btn-find' onClick={this._find}>Find Path</button>
                                <button className='btn-reset' onClick={this._reset}>Reset</button>
                            </div>
                        </div>  
                    </div>
                }
            </div>
		);
	}
}


export default Grid;
