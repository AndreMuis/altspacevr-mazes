"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ROT = __importStar(require("rot-js"));
const utility_1 = require("./utility");
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Wall"] = 1] = "Wall";
})(CellType = exports.CellType || (exports.CellType = {}));
class Cell {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
exports.Cell = Cell;
class Maze {
    constructor(width, height, scale) {
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
    populateCells() {
        var map = new ROT.Map.DividedMaze(this.width, this.height);
        var userCallback = (x, y, value) => {
            const cell = new Cell(x, y, value);
            this.cells.push(cell);
        };
        map.create(userCallback);
    }
    findDeadEnds() {
        var surrondingWalls;
        for (let cell of this.findCells(CellType.Empty)) {
            surrondingWalls = 0;
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
    setStartAndEnd() {
        let startCellIndex = utility_1.Utility.randomNumber(0, this.deadEndCells.length - 1);
        this.startCell = this.deadEndCells[startCellIndex];
        var longestDistance = 0;
        for (let cell of this.deadEndCells) {
            let distance = utility_1.Utility.distance(this.startCell.x, this.startCell.y, cell.x, cell.y);
            if (distance > longestDistance) {
                longestDistance = distance;
                this.endCell = cell;
            }
        }
    }
    findCell(x, y) {
        return this.cells.filter(cell => cell.x == x && cell.y == y)[0];
    }
    findCells(type) {
        return this.cells.filter(cell => cell.type == type);
    }
}
exports.Maze = Maze;
//# sourceMappingURL=maze.js.map