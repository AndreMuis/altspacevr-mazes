import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import * as ROT from 'rot-js'
import { Vector3 } from '@microsoft/mixed-reality-extension-sdk';

enum CellType {
    Empty = 0,
    Wall = 1
}

export default class Mazes {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    
    private async started() {  
        var maze = new Maze(20, 20, 3.0);

        maze.populateCells();
        
        maze.setDeadEnds(); 
        maze.setStartAndEnd();

        maze.draw(this.context);
        maze.drawTeleporter(this.context);
        maze.drawOrigin(this.context);
    }
}

class Maze {
    private cells: Cell[];
    private deadEndCells: Cell[]; 

    private startCell: Cell;
    private endCell: Cell;

    public width: number;
    public height: number;
    public scale: number;

    public originX: number;
    public originY: number;
    public originZ: number;
    
    constructor(width: number, height: number, scale: number) {
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

    public populateCells() {
        var map = new ROT.Map.DividedMaze(this.width, this.height);

        var userCallback = (x: number, y: number, value: number) => {
            const cell = new Cell(x, y, value);
            this.cells.push(cell)
        }
        map.create(userCallback);    
    }

    public findCell(x: number, y: number): Cell {
        return this.cells.filter(cell => cell.x == x && cell.y == y)[0];
    } 

    public findCells(type: CellType): Cell[] {
        return this.cells.filter(cell => cell.type == type);
    } 

    public setDeadEnds() {
        var surrondingWalls: number

        for (let cell of this.findCells(CellType.Empty)) {
            surrondingWalls = 0

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

    public setStartAndEnd() {
        let startCellIndex = Math.floor(Math.random() * this.deadEndCells.length)
        this.startCell = this.deadEndCells[startCellIndex];

        var longestDistance: number = 0; 

        for (let cell of this.deadEndCells) {
            let distance = this.distance(this.startCell.x, this.startCell.y, cell.x, cell.y) 

            if (distance > longestDistance) {
                longestDistance = distance;

                this.endCell = cell;
            }
        }
    }

    private distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    public draw(context: MRESDK.Context) {
        var floorXOffset = this.scale;
        var floorYOffset = 0.0;
        var floorZOffset = this.scale;

        var wallXOffset = this.scale / 2.0;
        var wallYOffset = this.scale / 2.0;
        var wallZOffset = this.scale / 2.0;

        var ceilingXOffset = this.scale;
        var ceilingYOffset = this.scale;
        var ceilingZOffset = this.scale;

        var artifactScale = { x: 0.2 * this.scale, y: 0.2 * this.scale, z: 0.2 * this.scale };

        for (let cell of this.cells) {
            var position = this.getPosition(cell)
            
            // wall
            if (cell.type == CellType.Wall) {
                MRESDK.Actor.CreateFromLibrary(context, {
                    resourceId: "artifact:1131742136107008955",
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

            // floor
            MRESDK.Actor.CreateFromLibrary(context, {
                resourceId: "artifact:1131741079352116217",
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

            // ceiling
            MRESDK.Actor.CreateFromLibrary(context, {
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
    }

    private getPosition(cell: Cell): MRESDK.Vector3 {
        let x = this.originX + this.scale * (cell.x - this.startCell.x);
        let y = this.originY;
        let z = this.originZ + this.scale * (cell.y - this.startCell.y); 

        return new Vector3(x, y, z);
    }

    public drawTeleporter(context: MRESDK.Context) {
        let position = this.getPosition(this.endCell);

        MRESDK.Actor.CreateFromLibrary(context, {
            resourceId: "teleporter:1101096999417021156",
            actor: {
                transform: {
                    position: { 
                        x: position.x + this.scale / 2.0, 
                        y: position.y, 
                        z: position.z + this.scale / 2.0
                    }
                }
            }
        });
    }

    public drawOrigin(context: MRESDK.Context) {
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
    constructor(public x: number, public y: number, public type: CellType) {
    }
}