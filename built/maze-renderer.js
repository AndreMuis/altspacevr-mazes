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
const maze_1 = require("./maze");
const utility_1 = require("./utility");
class MazeRenderer {
    constructor(context, maze) {
        this.context = context;
        this.maze = maze;
    }
    draw() {
        var artifactScale = { x: 0.2 * this.maze.scale, y: 0.2 * this.maze.scale, z: 0.2 * this.maze.scale };
        for (let cell of this.maze.cells) {
            var position = this.getPosition(cell);
            this.drawFloor(position, artifactScale);
            this.drawCeiling(position, artifactScale);
            if (cell.type == maze_1.CellType.Wall) {
                this.drawWall(position, artifactScale);
            }
        }
    }
    drawFloor(position, artifactScale) {
        let floorXOffset = this.maze.scale;
        let floorYOffset = 0.0;
        let floorZOffset = this.maze.scale;
        let resourceId;
        if (utility_1.Utility.randomNumber(1, 10) <= 9) {
            resourceId = "artifact:1131741079352116217";
        }
        else {
            resourceId = "artifact:1131747812820648013";
        }
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    position: {
                        x: position.x + floorXOffset,
                        y: position.y + floorYOffset,
                        z: position.z + floorZOffset
                    },
                    rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
                    scale: artifactScale
                }
            }
        });
    }
    drawCeiling(position, artifactScale) {
        var ceilingXOffset = this.maze.scale;
        var ceilingYOffset = this.maze.scale;
        var ceilingZOffset = this.maze.scale;
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1131740277568962631",
            actor: {
                transform: {
                    position: {
                        x: position.x + ceilingXOffset,
                        y: position.y + ceilingYOffset,
                        z: position.z + ceilingZOffset
                    },
                    rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                    scale: artifactScale
                }
            }
        });
    }
    drawWall(position, artifactScale) {
        var wallXOffset = this.maze.scale / 2.0;
        var wallYOffset = this.maze.scale / 2.0;
        var wallZOffset = this.maze.scale / 2.0;
        let resourceId;
        if (utility_1.Utility.randomNumber(1, 10) <= 9) {
            resourceId = "artifact:1131742136107008955";
        }
        else {
            resourceId = "artifact:1131742168336040892";
        }
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    position: {
                        x: position.x + wallXOffset,
                        y: position.y + wallYOffset,
                        z: position.z + wallZOffset
                    },
                    scale: artifactScale
                }
            }
        });
    }
    drawTeleporter() {
        let position = this.getPosition(this.maze.endCell);
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "teleporter:1101096999417021156",
            actor: {
                transform: {
                    position: {
                        x: position.x + this.maze.scale / 2.0,
                        y: position.y,
                        z: position.z + this.maze.scale / 2.0
                    }
                }
            }
        });
    }
    drawOrigin() {
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere,
                radius: 0.1
            },
            actor: {
                transform: {
                    position: { x: this.maze.originX, y: this.maze.originY, z: this.maze.originZ }
                }
            }
        });
    }
    getPosition(cell) {
        let x = this.maze.originX + this.maze.scale * (cell.x - this.maze.startCell.x);
        let y = this.maze.originY;
        let z = this.maze.originZ + this.maze.scale * (cell.y - this.maze.startCell.y);
        return new MRESDK.Vector3(x, y, z);
    }
}
exports.MazeRenderer = MazeRenderer;
//# sourceMappingURL=maze-renderer.js.map