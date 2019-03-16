import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import * as ROT from 'rot-js';

import { Utility } from "./utility";

export enum CellType {
    Empty = 0,
    Wall = 1
}

export class Cell {
    constructor(public x: number, public y: number, public type: CellType) {
    }
}   

export class Maze {
    public cells: Cell[];
    private deadEndCells: Cell[]; 

    public startCell: Cell;
    public endCell: Cell;

    public width: number;
    public height: number;
    public scale: number;

    public originX: number;
    public originY: number;
    public originZ: number;
    
    constructor(width: number, height: number, scale: number) {
        this.cells = [];
        this.deadEndCells = [];

        this.startCell = null;
        this.endCell = null;

        this.width = width;
        this.height = height;
        this.scale = scale;

        this.originX = -this.scale / 2.0; 
        this.originY = -1.3;
        this.originZ = -this.scale / 2.0;
    }

    public populateCells() {
        var map = new ROT.Map.DividedMaze(this.width, this.height);

        var userCallback = (x: number, y: number, value: number) => {
            const cell = new Cell(x, y, value);
            this.cells.push(cell)
        }
        map.create(userCallback);    
    }

    public findDeadEnds() {
        var surrondingWalls: number

        for (let cell of this.findCells(CellType.Empty)) {
            surrondingWalls = 0

            if (cell.x - 1 >= 0 && this.findCell(cell.x - 1, cell.y).type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (cell.x + 1 < this.width && this.findCell(cell.x + 1, cell.y).type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (cell.y - 1 >= 0 && this.findCell(cell.x, cell.y - 1).type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (cell.y + 1 < this.height && this.findCell(cell.x, cell.y + 1).type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (surrondingWalls == 3) {
                this.deadEndCells.push(cell);
            }
        }
    }

    public setStartAndEnd() {
        let startCellIndex = Utility.randomNumber(0, this.deadEndCells.length - 1)
        this.startCell = this.deadEndCells[startCellIndex];

        var longestDistance: number = 0; 

        for (let cell of this.deadEndCells) {
            let distance = Utility.distance(this.startCell.x, this.startCell.y, cell.x, cell.y) 

            if (distance > longestDistance) {
                longestDistance = distance;

                this.endCell = cell;
            }
        }
    }

    public findCell(x: number, y: number): Cell {
        return this.cells.filter(cell => cell.x == x && cell.y == y)[0];
    } 

    public findCells(type: CellType): Cell[] {
        return this.cells.filter(cell => cell.type == type);
    } 
}
