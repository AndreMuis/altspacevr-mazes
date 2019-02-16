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
class Mazes {
    constructor(context, baseUrl) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.cells = [];
        this.context.onStarted(() => this.started());
    }
    async started() {
        this.createCells(10, 10);
        var xOffset = -1;
        var zOffset = -1;
        this.cells.forEach((cell) => {
            if (cell.type == 1) {
                /*
                MRESDK.Actor.CreatePrimitive(this.context, {
                    definition: {
                        shape: MRESDK.PrimitiveShape.Box,
                        dimensions: { x: 1, y: 1, z: 1 }
                    },
                    addCollider: true,
                    actor: {
                        transform: {
                            position: { x: cell.x, y: 0, z: cell.y }
                        }
                    }
                });
                */
                MRESDK.Actor.CreateFromLibrary(this.context, {
                    resourceId: "1131742136107008955",
                    actor: {
                        transform: {
                            position: { x: xOffset + cell.x, y: 0.0, z: zOffset + cell.y },
                            scale: { x: 0.2, y: 0.2, z: 0.2 }
                        }
                    }
                });
            }
        });
    }
    createCells(width, height) {
        var map = new ROT.Map.DividedMaze(width, height);
        var userCallback = (x, y, value) => {
            const cell = new Cell(x, y, value);
            this.cells.push(cell);
        };
        map.create(userCallback);
    }
}
exports.default = Mazes;
class Cell {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
    }
}
//# sourceMappingURL=app.js.map