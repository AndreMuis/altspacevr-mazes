import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import * as ROT from 'rot-js'

export default class Mazes {
    private cells: Cell[] = [];

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    
    private async started() {  
        this.createCells(10, 10);

        var mazeXOffset = -3;
        var mazeYOffset = -1.3;
        var mazeZOffset = -3;

        var floorXOffset = 2.0;
        var floorYOffset = 0.0;
        var floorZOffset = 2.0;

        var wallXOffset = 1.0;
        var wallYOffset = 1.0;
        var wallZOffset = 1.0;

        var ceilingXOffset = 2.0;
        var ceilingYOffset = 4.0;
        var ceilingZOffset = 2.0;

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
            var mazeX = 2.0 * cell.x;
            var mazeZ = 2.0 * cell.y; 
            var artifactScale = { x: 0.4, y: 0.4, z: 0.4 };

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

                MRESDK.Actor.CreateFromLibrary(this.context, {
                    resourceId: "1131742136107008955",
                    actor: {
                        transform: {
                            position: { 
                                x: mazeX + mazeXOffset + wallXOffset, 
                                y: mazeYOffset + wallYOffset + 2.0, 
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