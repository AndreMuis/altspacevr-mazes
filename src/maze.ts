import * as ROT from 'rot-js';

import { Utility } from "./utility";

export enum CellType {
    Empty = 0,
    Wall = 1
}

export enum Orientation {
    Horizontal = 0,
    Vertical = 1
}

export class Cell {
    public topLeftCell: Cell
    public topCell: Cell
    public topRightCell: Cell
    public leftCell: Cell
    public rightCell: Cell
    public bottomLeftCell: Cell
    public bottomCell: Cell
    public bottomRightCell: Cell

    constructor(public x: number, public y: number, public type: CellType) {
    }
}   

export class WallSegment {
    constructor(public x: number, public y: number, public length: number, public orientation: Orientation) {
    }
}   

export class Maze {
    public cells: Cell[];
    private deadEndCells: Cell[]; 
    public wallSegments: WallSegment[];

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
        this.wallSegments = [];

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
        var tmpCells: Cell[] = [];

        ROT.RNG.setSeed(123)

        var map = new ROT.Map.IceyMaze(this.width, this.height, 0);

        var userCallback = (x: number, y: number, value: number) => {
            const cell = new Cell(x, y, value);
            tmpCells.push(cell)
        }
        map.create(userCallback);

        for (var y = this.height - 1; y >= 0; y = y - 1) {
            for (var x = 0; x < this.width; x = x + 1) {
                let cell = tmpCells.filter(cell => cell.x == x && cell.y == y)[0];
                cell.y = (this.height - 1) - cell.y
                this.cells.push(cell)
            }
        } 
    }

    public populateNeighbors() {
        for (var cell of this.cells) {
            cell.topLeftCell = this.findCell(cell.x - 1, cell.y + 1)
            cell.topCell = this.findCell(cell.x, cell.y + 1)
            cell.topRightCell = this.findCell(cell.x + 1, cell.y + 1)
            cell.leftCell = this.findCell(cell.x - 1, cell.y)
            cell.rightCell = this.findCell(cell.x + 1, cell.y)
            cell.bottomLeftCell = this.findCell(cell.x - 1, cell.y - 1)
            cell.bottomCell = this.findCell(cell.x, cell.y - 1)
            cell.bottomRightCell = this.findCell(cell.x + 1, cell.y - 1)
        }
    }

    public findDeadEnds() {
        var surrondingWalls: number

        for (let cell of this.findCells(CellType.Empty)) {
            surrondingWalls = 0

            if (cell.topCell && cell.topCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (cell.leftCell && cell.leftCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (cell.rightCell && cell.rightCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1;
            }

            if (cell.bottomCell && cell.bottomCell.type == CellType.Wall) {
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

    public populateWallSegments() {
        var a = this.cells;

        var wallCells = this.findCells(CellType.Wall)

        while (wallCells.length >= 1) {
            let firstWall = wallCells.shift()
            var lastWall = firstWall
            var wallSegment: WallSegment

            if (lastWall.rightCell && lastWall.rightCell.type == CellType.Wall && wallCells.includes(lastWall.rightCell)) {
                while (lastWall.rightCell && lastWall.rightCell.type == CellType.Wall && wallCells.includes(lastWall.rightCell)) {
                    lastWall = lastWall.rightCell
                    wallCells.splice(wallCells.indexOf(lastWall), 1);
                }

                wallSegment = new WallSegment(firstWall.x, firstWall.y, lastWall.x - firstWall.x + 1, Orientation.Horizontal)
            } else if (lastWall.topCell && lastWall.topCell.type == CellType.Wall && wallCells.includes(lastWall.topCell)) {
                while (lastWall.topCell && lastWall.topCell.type == CellType.Wall && wallCells.includes(lastWall.topCell)) {
                    lastWall = lastWall.topCell
                    wallCells.splice(wallCells.indexOf(lastWall), 1);
                }

                wallSegment = new WallSegment(firstWall.x, firstWall.y, lastWall.y - firstWall.y + 1, Orientation.Vertical)
            } else {
                wallSegment = new WallSegment(firstWall.x, firstWall.y, 1, Orientation.Horizontal)
            }

            this.wallSegments.push(wallSegment)
        }
    }

    public findCell(x: number, y: number): Cell {
        return this.cells.filter(cell => cell.x == x && cell.y == y)[0]
    } 

    public findCells(type: CellType): Cell[] {
        return this.cells.filter(cell => cell.type == type)
    } 
}
