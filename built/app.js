"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRESDK = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
const ROT = __importStar(require("rot-js"));
var CellType;
(function (CellType) {
    CellType[CellType["Empty"] = 0] = "Empty";
    CellType[CellType["Wall"] = 1] = "Wall";
})(CellType || (CellType = {}));
class Mazes {
    constructor(context, baseUrl) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.context.onStarted(() => this.started());
    }
    async started() {
        var maze = new Maze(100, 100, 3.0);
        maze.populateCells();
        maze.setDeadEnds();
        maze.setStartAndEnd();
        maze.draw(this.context);
        maze.drawOrigin(this.context);
    }
}
exports.default = Mazes;
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
    findCell(x, y) {
        return this.cells.filter(cell => cell.x == x && cell.y == y)[0];
    }
    findCells(type) {
        return this.cells.filter(cell => cell.type == type);
    }
    setDeadEnds() {
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
        let startCellIndex = Math.floor(Math.random() * this.deadEndCells.length);
        this.startCell = this.deadEndCells[startCellIndex];
        var longestDistance = 0;
        for (let cell of this.deadEndCells) {
            let distance = this.distance(this.startCell.x, this.startCell.y, cell.x, cell.y);
            if (distance > longestDistance) {
                longestDistance = distance;
                this.endCell = cell;
            }
        }
    }
    distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    draw(context) {
        var floorXOffset = this.scale;
        var floorYOffset = 0.0;
        var floorZOffset = this.scale;
        var wallXOffset = this.scale / 2.0;
        var wallYOffset = this.scale / 2.0;
        var wallZOffset = this.scale / 2.0;
        var ceilingXOffset = this.scale;
        var ceilingYOffset = this.scale;
        var ceilingZOffset = this.scale;
        console.log(this.startCell.type);
        for (let cell of this.cells) {
            var mazeX = this.scale * (cell.x - this.startCell.x);
            var mazeZ = this.scale * (cell.y - this.startCell.y);
            var artifactScale = { x: 0.2 * this.scale, y: 0.2 * this.scale, z: 0.2 * this.scale };
            // wall
            if (cell.type == CellType.Wall) {
                MRESDK.Actor.CreateFromLibrary(context, {
                    resourceId: "artifact:1131742136107008955",
                    actor: {
                        transform: {
                            position: {
                                x: this.originX + mazeX + wallXOffset,
                                y: this.originY + wallYOffset,
                                z: this.originZ + mazeZ + wallZOffset
                            },
                            scale: artifactScale
                        }
                    }
                });
            }
            // floor
            MRESDK.Actor.CreateFromLibrary(context, {
                resourceId: "artifact:1131741079352116217",
                actor: {
                    transform: {
                        position: {
                            x: this.originX + mazeX + floorXOffset,
                            y: this.originY + floorYOffset,
                            z: this.originZ + mazeZ + floorZOffset
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
                        scale: artifactScale
                    }
                }
            });
            // ceiling
            MRESDK.Actor.CreateFromLibrary(context, {
                resourceId: "artifact:1131740277568962631",
                actor: {
                    transform: {
                        position: {
                            x: this.originX + mazeX + ceilingXOffset,
                            y: this.originY + ceilingYOffset,
                            z: this.originZ + mazeZ + ceilingZOffset
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                        scale: artifactScale
                    }
                }
            });
        }
    }
    drawOrigin(context) {
        MRESDK.Actor.CreatePrimitive(context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere,
                radius: 0.1
            },
            actor: {
                transform: {
                    position: { x: this.originX, y: this.originY, z: this.originZ }
                }
            }
        });
    }
}
class Cell {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
//# sourceMappingURL=app.js.map