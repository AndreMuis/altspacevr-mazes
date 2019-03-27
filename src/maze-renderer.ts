import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';

import { Cell, CellType, Maze } from "./maze"
import { Utility } from "./utility";

export class MazeRenderer {
    private context: MRESDK.Context
    private maze: Maze

    constructor(context: MRESDK.Context, maze: Maze) {
        this.context = context
        this.maze = maze
    }

    public draw() {
        var artifactScale = { x: this.maze.scale, y: this.maze.scale, z: this.maze.scale };

        for (let cell of this.maze.cells) {
            var position = this.getPosition(cell)

            this.drawFloor(position, artifactScale);
            this.drawCeiling(position, artifactScale);
 
            if (cell.type == CellType.Wall) {
                this.drawWall(position, artifactScale);
            }
        }
    }

    private drawFloor(position: MRESDK.Vector3, artifactScale: {}) {
        let floorXOffset = this.maze.scale / 2.0;
        let floorYOffset = 0.0;
        let floorZOffset = this.maze.scale / 2.0;

        let resourceId: string;

        if (Utility.randomNumber(1, 10) <= 9) {
            resourceId = "artifact:1171073392846045810";
        } else {
            resourceId = "artifact:1171073392846045810";
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

    private drawCeiling(position: MRESDK.Vector3, artifactScale: {}) {
        var ceilingXOffset = this.maze.scale / 2.0;
        var ceilingYOffset = this.maze.scale;
        var ceilingZOffset = this.maze.scale / 2.0;

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1171073388207145585",
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

    private drawWall(position: MRESDK.Vector3, artifactScale: {}) {
        var wallXOffset = this.maze.scale / 2.0;
        var wallYOffset = this.maze.scale / 2.0;
        var wallZOffset = this.maze.scale / 2.0;

        let resourceId: string;

        if (Utility.randomNumber(1, 9) <= 8) {
            resourceId = "artifact:1171073382033130096";
        } else {
            resourceId = "artifact:1171073382033130096";
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

    public drawTeleporter() {
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

    private getPosition(cell: Cell): MRESDK.Vector3 {
        let x = this.maze.originX + this.maze.scale * (cell.x - this.maze.startCell.x);
        let y = this.maze.originY;
        let z = this.maze.originZ + this.maze.scale * (cell.y - this.maze.startCell.y); 

        return new MRESDK.Vector3(x, y, z);
    }

    public async drawLayoutTests() {
        // origin
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere,
                radius: 0.1
            },
            actor: {
                transform: {
                    position: { x: 0, y: 0, z: 0 }
                }
            }
        });

        /*
        // unit cube
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: { x: 0.99, y: 0.99, z: 0.99 }
            },
            addCollider: false,
            actor: {
                transform: {
                    position: { x: 0, y: 0, z: 0 }
                }
            }
        });

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1169875730385862876",
            actor: {
                transform: {
                    position: { 
                        x: 0.0, 
                        y: 0.0, 
                        z: 0.0 
                    },
                    rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                    scale: {x: 1.0, y: 1.0, z: 1.0}
                }
            }
        });
        */

        for (var x = 0; x < 40; x = x + 1) {
            for (var y = 0; y < 40; y = y + 1) {
                /*
                MRESDK.Actor.CreatePrimitive(this.context, {
                    definition: {
                        shape: MRESDK.PrimitiveShape.Box,
                        dimensions: { x: 1.0, y: 1.0, z: 1.0 }
                    },
                    addCollider: true,
                    actor: {
                        transform: {
                            position: { x: 2.0 * x, y: 0, z: 2.0 * y }
                        }
                    }
                });
                */

                /*
                MRESDK.Actor.CreateFromLibrary(this.context, {
                    resourceId: "artifact:1172068420133322845",
                    actor: {
                        transform: {
                            position: { 
                                x: 1.0 * x, 
                                y: 0.0, 
                                z: 1.0 * y
                            },
                            rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
                        }
                    }
                });
                */
            }
        }

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1172114367617958593",
            actor: {
                transform: {
                    position: { 
                        x: 0.0, 
                        y: 0.0, 
                        z: 0.0
                    },
                    rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
                    scale: {x: 1.0, y: 1.0, z: 1.0}
                }
            }
        });
    }
}

// 900 simple cubes - 30 FPS
// 900 textures cubes - 30-40 FPS