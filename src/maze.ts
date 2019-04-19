import * as ROT from 'rot-js'

import { Utility } from "./utility"

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

    constructor(public row: number, public column: number, public type: CellType) {
    }
}   

export class WallSegment {
    constructor(public row: number, public column: number, public length: number, public orientation: Orientation) {
    }
}   

export class Maze {
    private cells: Cell[]
    private deadEndCells: Cell[] 

    public wallSegments: WallSegment[]

    public startCell: Cell
    public endCell: Cell

    public rows: number
    public columns: number

    constructor(rows: number, columns: number) {
        this.cells = []
        this.deadEndCells = []
        this.wallSegments = []

        this.startCell = null
        this.endCell = null

        this.rows = rows
        this.columns = columns
    }

    public setup() {
        this.populateCells()
        this.flipRowsDirection()

        this.populateNeighbors()

        this.findDeadEnds() 
        this.setStartAndEnd()

        this.populateWallSegments()
    }
    
    public populateCells() {
        var map = new ROT.Map.IceyMaze(this.columns, this.rows, 0)

        var userCallback = (column: number, row: number, value: number) => {
            const cell = new Cell(row, column, value)
            this.cells.push(cell)
        }
        map.create(userCallback)
    }

    public flipRowsDirection() {
        var tmpCells: Cell[] = []

        for (var row = this.rows - 1; row >= 0; row = row - 1) {
            for (var column = 0; column < this.columns; column = column + 1) {
                let cell = this.cells.filter(cell => cell.row == row && cell.column == column)[0]
                cell.row = (this.rows - 1) - cell.row
                tmpCells.push(cell)
            }
        }

        this.cells = tmpCells
    }

    public populateNeighbors() {
        for (var cell of this.cells) {
            cell.topLeftCell = this.findCell(cell.row + 1, cell.column - 1)
            cell.topCell = this.findCell(cell.row + 1, cell.column)
            cell.topRightCell = this.findCell(cell.row + 1, cell.column + 1)
            cell.leftCell = this.findCell(cell.row, cell.column - 1)
            cell.rightCell = this.findCell(cell.row, cell.column + 1)
            cell.bottomLeftCell = this.findCell(cell.row - 1, cell.column - 1)
            cell.bottomCell = this.findCell(cell.row - 1, cell.column)
            cell.bottomRightCell = this.findCell(cell.row - 1, cell.column + 1)
        }
    }

    public findDeadEnds() {
        var surrondingWalls: number

        for (let cell of this.findCells(CellType.Empty)) {
            surrondingWalls = 0

            if (cell.topCell && cell.topCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1
            }

            if (cell.leftCell && cell.leftCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1
            }

            if (cell.rightCell && cell.rightCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1
            }

            if (cell.bottomCell && cell.bottomCell.type == CellType.Wall) {
                surrondingWalls = surrondingWalls + 1
            }

            if (surrondingWalls == 3) {
                this.deadEndCells.push(cell)
            }
        }

        if (this.deadEndCells.length == 0) {
            throw new Error("No dead end cells found.")
        }
    }

    public setStartAndEnd() {
        let startCellIndex = Utility.randomNumber(0, this.deadEndCells.length - 1)
        this.startCell = this.deadEndCells[startCellIndex]

        if (!this.startCell) {
            throw new Error("Start cell not found.")
        }

        var longestDistance: number = 0 

        for (let cell of this.deadEndCells) {
            let distance = Utility.distance(this.startCell.row, this.startCell.column, cell.row, cell.column) 

            if (distance > longestDistance) {
                longestDistance = distance

                this.endCell = cell
            }
        }

        if (!this.endCell) {
            throw new Error("End cell not found.")
        }
    }

    public populateWallSegments() {
        var wallCells = this.findCells(CellType.Wall)

        while (wallCells.length >= 1) {
            let firstWall = wallCells.shift()
            var lastWall = firstWall
            var wallSegment: WallSegment

            if (lastWall.rightCell && lastWall.rightCell.type == CellType.Wall && wallCells.includes(lastWall.rightCell)) {
                while (lastWall.rightCell && lastWall.rightCell.type == CellType.Wall && wallCells.includes(lastWall.rightCell)) {
                    lastWall = lastWall.rightCell
                    wallCells.splice(wallCells.indexOf(lastWall), 1)
                }

                wallSegment = new WallSegment(firstWall.row, firstWall.column, lastWall.column - firstWall.column + 1, Orientation.Horizontal)
            } else if (lastWall.topCell && lastWall.topCell.type == CellType.Wall && wallCells.includes(lastWall.topCell)) {
                while (lastWall.topCell && lastWall.topCell.type == CellType.Wall && wallCells.includes(lastWall.topCell)) {
                    lastWall = lastWall.topCell
                    wallCells.splice(wallCells.indexOf(lastWall), 1)
                }

                wallSegment = new WallSegment(firstWall.row, firstWall.column, lastWall.row - firstWall.row + 1, Orientation.Vertical)
            } else {
                wallSegment = new WallSegment(firstWall.row, firstWall.column, 1, Orientation.Horizontal)
            }

            this.wallSegments.push(wallSegment)
        }

        if (this.wallSegments.length == 0) {
            throw new Error("No wall segments found.")
        }
    }

    public findCell(row: number, column: number): Cell {
        return this.cells.filter(cell => cell.row == row && cell.column == column)[0]
    } 

    public findCells(type: CellType): Cell[] {
        return this.cells.filter(cell => cell.type == type)
    } 
}
