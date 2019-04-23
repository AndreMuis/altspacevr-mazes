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

export enum Direction {
    TopLeft,
    Top,
    TopRight,
    Left,
    Right,
    BottomLeft,
    Bottom,
    BottomRight
}

export class Cell {
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

    public findDeadEnds() {
        for (let cell of this.findCells(CellType.Empty)) {
            var surrondingWallCount = 0

            let surrondingWalls: Cell[] = [
                this.findCell2(cell, Direction.Top),
                this.findCell2(cell, Direction.Left),
                this.findCell2(cell, Direction.Right),
                this.findCell2(cell, Direction.Bottom)]

            surrondingWalls.forEach(function (cell) {
                if (cell && cell.type == CellType.Wall) {
                    surrondingWallCount = surrondingWallCount + 1
                }
            });

            if (surrondingWallCount == 3) {
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
            let firstWallCell = wallCells.shift()
            var lastCell = firstWallCell
            var wallSegment: WallSegment

            var rightCell = this.findCell2(lastCell, Direction.Right)

            if (rightCell && rightCell.type == CellType.Wall && wallCells.includes(rightCell)) {
                while (rightCell && rightCell.type == CellType.Wall && wallCells.includes(rightCell)) {
                    lastCell = this.findCell(lastCell.row, lastCell.column + 1)
                    wallCells.splice(wallCells.indexOf(lastCell), 1)
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

    public findCell2(cell: Cell, direction: Direction) {
        switch (direction) {
            case Direction.TopLeft:
                return this.findCell(cell.row + 1, cell.column - 1)
            case Direction.Top:
                return this.findCell(cell.row + 1, cell.column)
            case Direction.TopRight:
                return this.findCell(cell.row + 1, cell.column + 1)
            case Direction.Left:
                return this.findCell(cell.row, cell.column - 1)
            case Direction.Right:
                return this.findCell(cell.row, cell.column + 1)
            case Direction.BottomLeft:
                return this.findCell(cell.row - 1, cell.column - 1)
            case Direction.Bottom:
                return this.findCell(cell.row - 1, cell.column)
            case Direction.BottomRight:
                return this.findCell(cell.row - 1, cell.column + 1)
        }
    }

    public findCells(type: CellType): Cell[] {
        return this.cells.filter(cell => cell.type == type)
    } 
}
