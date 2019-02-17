import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import * as ROT from 'rot-js'

export default class Mazes {
    private cells: Cell[] = [];

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    
    private async started() {  
        this.createCells(10, 10);

        var mazeScale = 3.0;

        var mazeXOffset = -(mazeScale + mazeScale / 2.0);
        var mazeYOffset = -1.3;
        var mazeZOffset = -(mazeScale + mazeScale / 2.0);

        var floorXOffset = mazeScale;
        var floorYOffset = 0.0;
        var floorZOffset = mazeScale;

        var wallXOffset = mazeScale / 2.0;
        var wallYOffset = mazeScale / 2.0;
        var wallZOffset = mazeScale / 2.0;

        var ceilingXOffset = mazeScale;
        var ceilingYOffset = mazeScale;
        var ceilingZOffset = mazeScale;

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere,
                radius: 0.1
            },
            actor: {
                transform: {
                    position: { x: mazeXOffset, y: mazeYOffset, z: mazeZOffset }
                }
            }
        });

        this.cells.forEach((cell) => {
            var mazeX = mazeScale * cell.x;
            var mazeZ = mazeScale * cell.y; 
            var artifactScale = { x: 0.2 * mazeScale, y: 0.2 * mazeScale, z: 0.2 * mazeScale };

            if (cell.type == 1) {
                // wall
                MRESDK.Actor.CreateFromLibrary(this.context, {
                    resourceId: "1131742136107008955",
                    actor: {
                        transform: {
                            position: { 
                                x: mazeX + mazeXOffset + wallXOffset, 
                                y: mazeYOffset + wallYOffset, 
                                z: mazeZ + mazeZOffset + wallZOffset 
                            },
                            scale: artifactScale
                        }
                    }
                });
            }

            // floor
            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: "1131741079352116217",
                actor: {
                    transform: {
                        position: { 
                            x: mazeX + mazeXOffset + floorXOffset, 
                            y: mazeYOffset + floorYOffset, 
                            z: mazeZ + mazeZOffset + floorZOffset 
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
                        scale: artifactScale
                    }
                }
            });

            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: "1131740277568962631",
                actor: {
                    transform: {
                        position: { 
                            x: mazeX + mazeXOffset + ceilingXOffset, 
                            y: mazeYOffset + ceilingYOffset, 
                            z: mazeZ + mazeZOffset + ceilingZOffset 
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                        scale: artifactScale
                    }
                }
            });
        });
    }
    
    private createCells(width: number, height: number) {
        var map = new ROT.Map.DividedMaze(width, height);

        var userCallback = (x: number, y: number, value: number) => {
            const cell = new Cell(x, y, value);
            this.cells.push(cell);

            console.log(x);
        }
        map.create(userCallback);    
    }    
}

class Cell {
    constructor(public x: number, public y: number, public type: number) {
    }
}