import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import * as ROT from 'rot-js'

export default class Mazes {
    private cells: Cell[] = [];

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    
    private async started() {  
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
    
    private createCells(width: number, height: number) {
        var map = new ROT.Map.DividedMaze(width, height);

        var userCallback = (x: number, y: number, value: number) => {
            const cell = new Cell(x, y, value);
            this.cells.push(cell);
        }
        map.create(userCallback);    
    }    
}

class Cell {
    constructor(public x: number, public y: number, public type: number) {
    }
}