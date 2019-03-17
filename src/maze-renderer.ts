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
        var artifactScale = { x: 0.2 * this.maze.scale, y: 0.2 * this.maze.scale, z: 0.2 * this.maze.scale };

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
        let floorXOffset = this.maze.scale;
        let floorYOffset = 0.0;
        let floorZOffset = this.maze.scale;

        let resourceId: string;

        if (Utility.randomNumber(1, 10) <= 9) {
            resourceId = "artifact:1164716299905925950";
        } else {
            resourceId = "artifact:1164716290519073596";
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
                    scale: artifactScale
                }
            }
        });
    }

    private drawCeiling(position: MRESDK.Vector3, artifactScale: {}) {
        var ceilingXOffset = this.maze.scale;
        var ceilingYOffset = this.maze.scale;
        var ceilingZOffset = this.maze.scale;

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1164716295308968765",
            actor: {
                transform: {
                    position: { 
                        x: position.x + ceilingXOffset, 
                        y: position.y + ceilingYOffset, 
                        z: position.z + ceilingZOffset 
                    },
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
            resourceId = "artifact:1164716284772877115";
        } else {
            resourceId = "artifact:1164716304737764160";
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

    public drawLayoutTests() {
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

        // unit cube
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: { x: 1, y: 1, z: 1 }
            },
            actor: {
                transform: {
                    position: { x: 0, y: 0, z: 0 }
                }
            }
        });


        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1164716299905925950",
            actor: {
                transform: {
                    position: { 
                        x: 0, 
                        y: 0, 
                        z: 0 
                    },
                    scale: {x: 0.2, y: 0.2, z: 0.2}
                }
            }
        });

    }
}
