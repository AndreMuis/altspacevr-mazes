require('@microsoft/mixed-reality-extension-sdk/built/protocols/protocol').DefaultConnectionTimeoutSeconds = 0

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

    public equals(cell: Cell): boolean {
        if (this.row == cell.row && this.column == cell.column && this.type == cell.type) {
            return true
        } else {
            return false
        }
    }
}   

export class DeadEndCell extends Cell {
    public openFaceDirection: Direction

    constructor(cell: Cell, openFaceDirection: Direction) {
        super(cell.row, cell.column, cell.type)

        this.openFaceDirection = openFaceDirection
    }
}   

export class WallSegment {
    constructor(public row: number, public column: number, public length: number, public orientation: Orientation) {
    }
}   

export class Maze {
    public cells: Cell[]
    public deadEndCells: DeadEndCell[] 

    public wallSegments: WallSegment[]

    public startCell: DeadEndCell
    public endCell: DeadEndCell

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
        var map = new ROT.Map.EllerMaze(this.columns, this.rows)

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
        var surrondingWallCount: number
        var openFaceDirection: Direction

        let directions: Direction[] = [
            Direction.Top,
            Direction.Left,
            Direction.Right,
            Direction.Bottom]

        for (let cell of Maze.findCells(this.cells, CellType.Empty)) {
            surrondingWallCount = 0

            directions.forEach((direction) => {
                var neighborCell = Maze.findCellAtDirection(this.cells, cell, direction)

                if (neighborCell) {
                    if (neighborCell.type == CellType.Wall) {
                        surrondingWallCount = surrondingWallCount + 1
                    } else {
                        openFaceDirection = direction
                    }
                }
            })

            if (surrondingWallCount == 3) {
                let deadEndCell = new DeadEndCell(cell, openFaceDirection)
                this.deadEndCells.push(deadEndCell)
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
        var wallCells = Maze.findCells(this.cells, CellType.Wall)

        while (wallCells.length >= 1) {
            let firstCell = wallCells.shift()
            var lastCell = firstCell
            var wallSegment: WallSegment

            var rightCell = Maze.findCellAtDirection(wallCells, lastCell, Direction.Right)
            var topCell = Maze.findCellAtDirection(wallCells, lastCell, Direction.Top)

            if (rightCell && rightCell.type == CellType.Wall) {
                while (rightCell && rightCell.type == CellType.Wall) {
                    lastCell = rightCell
                    rightCell = Maze.findCellAtDirection(wallCells, lastCell, Direction.Right)

                    wallCells.splice(wallCells.indexOf(lastCell), 1)
                }

                wallSegment = new WallSegment(firstCell.row, firstCell.column, lastCell.column - firstCell.column + 1, Orientation.Horizontal)
            } else if (topCell && topCell.type == CellType.Wall) {
                while (topCell && topCell.type == CellType.Wall) {
                    lastCell = topCell
                    topCell = Maze.findCellAtDirection(wallCells, lastCell, Direction.Top)

                    wallCells.splice(wallCells.indexOf(lastCell), 1)
                }

                wallSegment = new WallSegment(firstCell.row, firstCell.column, lastCell.row - firstCell.row + 1, Orientation.Vertical)
            } else {
                wallSegment = new WallSegment(firstCell.row, firstCell.column, 1, Orientation.Horizontal)
            }

            this.wallSegments.push(wallSegment)
        }

        if (this.wallSegments.length == 0) {
            throw new Error("No wall segments found.")
        }
    }

    public static findCell(cells: Cell[], row: number, column: number): Cell {
        return cells.filter(cell => cell.row == row && cell.column == column)[0]
    } 

    public static findCellAtDirection(cells: Cell[], cell: Cell, direction: Direction) {
        switch (direction) {
            case Direction.TopLeft:
                return Maze.findCell(cells, cell.row + 1, cell.column - 1)
            case Direction.Top:
                return Maze.findCell(cells, cell.row + 1, cell.column)
            case Direction.TopRight:
                return Maze.findCell(cells, cell.row + 1, cell.column + 1)
            case Direction.Left:
                return Maze.findCell(cells, cell.row, cell.column - 1)
            case Direction.Right:
                return Maze.findCell(cells, cell.row, cell.column + 1)
            case Direction.BottomLeft:
                return Maze.findCell(cells, cell.row - 1, cell.column - 1)
            case Direction.Bottom:
                return Maze.findCell(cells, cell.row - 1, cell.column)
            case Direction.BottomRight:
                return Maze.findCell(cells, cell.row - 1, cell.column + 1)
        }
    }

    public static findCells(cells: Cell[], type: CellType): Cell[] {
        return cells.filter(cell => cell.type == type)
    }

    public static findNearestNeighborCells(cells: Cell[], cell: Cell): Cell[] {
        let directions = [
            Direction.TopLeft,
            Direction.Top,
            Direction.TopRight,
            Direction.Left,
            Direction.Right,
            Direction.BottomLeft,
            Direction.Bottom,
            Direction.BottomRight]

        var neighborCells: Cell[] = []
        directions.forEach((direction) => {
            var neighborCell = Maze.findCellAtDirection(cells, cell, direction)

            if (neighborCell) {
                neighborCells.push(neighborCell)
            }
        });

        return neighborCells
    }

    public static removeNearestNeighborCells(cells: Cell[], cell: Cell) {
        let neighborCells = Maze.findNearestNeighborCells(cells, cell)

        neighborCells.forEach(neighborCell => {
            cells.splice(cells.indexOf(neighborCell), 1)            
        });
    }
}
