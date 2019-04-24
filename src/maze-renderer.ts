import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Cell, CellType, Maze, WallSegment, Orientation, Direction } from "./maze"
import { Utility } from "./utility"
import { Vector3 } from '@microsoft/mixed-reality-extension-sdk';

export class MazeRenderer {
    private context: MRESDK.Context
    private maze: Maze
    private scale: number

    private wallArtifactIds: string[]
    static readonly floorResourceId = "artifact: 1189362288939762020"
    static readonly ceilingResourceId = "artifact: 1189362283956928866"

    static readonly springCampfireResourceId = "teleporter:1148791394312127008"
    
    get origin(): MRESDK.Vector3 {
        var vector3 = new MRESDK.Vector3()
    
        vector3.x = -this.scale * (0.5 + this.maze.startCell.column)
        vector3.y = -1.35
        vector3.z = -this.scale * (0.5 + this.maze.startCell.row)

        return vector3
    }

    constructor(context: MRESDK.Context, maze: Maze, scale: number) {
        this.context = context
        this.maze = maze
        this.scale = scale
        this.wallArtifactIds = [
            "1190185992926003579", 
            "1190186022999163337", 
            "1190186065059644248", 
            "1190186148257858423", 
            "1190186050278916948", 
            "1190186163139249019", 
            "1190186142780097397", 
            "1190186060160697175", 
            "1190186114443379567", 
            "1190185982968725881", 
            "1190186085636899680", 
            "1190186007648010622", 
            "1190186100174357356", 
            "1190186074958201690", 
            "1190186045245752147", 
            "1190186003042664829", 
            "1190186123746345841", 
            "1190186055446299478", 
            "1190186070268969817", 
            "1190186133720400755", 
            "1190186012605677951", 
            "1190185977826509176", 
            "1190185988060610938", 
            "1190186039767991121", 
            "1190186168298242940", 
            "1190186090510680929", 
            "1190186080142361438", 
            "1190186158391296890", 
            "1190186119182943088", 
            "1190186033384260301",
            "1190186138426409844", 
            "1190186109703816046", 
            "1190186095510291306", 
            "1190185998345044348", 
            "1190186128855008114", 
            "1190186028434981459", 
            "1190186153140028281", 
            "1190186017596899714", 
            "1190186105090081645"]
    }

    public draw() {
        this.drawFloor()
        this.drawCeiling()

        this.drawWalls()

        this.drawStart()
        this.drawEnd()
    }

    private drawFloor() {
        let resourceId = MazeRenderer.floorResourceId
        let scale = {x: this.scale * this.maze.columns, y: this.scale * this.maze.rows, z: 1.0}

        let position = this.getPosition(0, 0)
        position = new Vector3(position.x + scale.x / 2.0, position.y, position.z + scale.y / 2.0)

        let rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians)

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    local: {
                        position: position,
                        rotation: rotation,
                        scale: scale
                    }
                }
            }
        })
    }

    private drawCeiling() {
        let resourceId = MazeRenderer.ceilingResourceId
        let scale = {x: this.scale * this.maze.columns, y: this.scale * this.maze.rows, z: 1.0}

        let position = this.getPosition(0, 0)
        position = new Vector3(position.x + scale.x / 2.0, position.y + this.scale, position.z + scale.y / 2.0)

        let rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    local: {
                        position: position,
                        rotation: rotation,
                        scale: scale
                    }
                }
            }
        })
    }

    private async drawWalls() {
        for (let wallSegment of this.maze.wallSegments) {
            let wallArtifactIdIndex = wallSegment.length - 1
            let wallArtifactId = this.wallArtifactIds[wallArtifactIdIndex]

            if (!wallArtifactId) {
                throw new Error("Wall artifact id not found at index = " + wallArtifactIdIndex)
            }

            let resourceId = "artifact: " + this.wallArtifactIds[wallSegment.length - 1]
            let position = this.getPosition(wallSegment.row, wallSegment.column)
            let scale = {x: this.scale, y: this.scale, z: this.scale }

            var rotationAngle: number

            switch (wallSegment.orientation) {
                case Orientation.Horizontal:
                    rotationAngle = 0                    
                    break;
            
                case Orientation.Vertical:
                    position.x = position.x + this.scale
                    rotationAngle = -90
                    break;
            }

            let rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), rotationAngle * MRESDK.DegreesToRadians)

            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: resourceId,
                actor: {
                    transform: {
                        local: {
                            position: position,
                            scale: scale,
                            rotation: rotation,
                        }
                    }
                }
            })

            await Utility.delay(30)
        }
    }

    public drawStart() {
        let neighborCell = Maze.findCellAtDirection(this.maze.cells, this.maze.startCell, this.maze.startCell.openFaceDirection)
        var position = this.getPosition(neighborCell.row, neighborCell.column)
        position = new Vector3(position.x + this.scale / 2.0, position.y + 1.6, position.z + this.scale / 2.0)

        let rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), this.angleFromDirection(this.maze.startCell.openFaceDirection))

        MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                transform: {
                    local: {
                        position: position,
                        rotation: rotation
                    }
                },
                text: {
                    contents: "Try and find the exit!\n\nCreated by Andre Muis",
                    anchor: MRESDK.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                    height: 0.23
                }
            }
        })   
    }

    public drawEnd() {
        var position = this.getPosition(this.maze.endCell.row, this.maze.endCell.column) 
        position = new Vector3(position.x + this.scale / 2.0, position.y, position.z + this.scale / 2.0)

        let scale = new Vector3(1.5, 1.5, 1.5)

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: MazeRenderer.springCampfireResourceId,
            actor: {
                transform: {
                    local: {
                        position: position,
                        scale: scale
                    }
                }
            }
        })

        var position = this.getPosition(this.maze.endCell.row, this.maze.endCell.column)
        position = new Vector3(position.x + this.scale / 2.0, position.y + 2.2, position.z + this.scale / 2.0)

        let rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), this.angleFromDirection(this.maze.startCell.openFaceDirection) + Math.PI)

        MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                transform: {
                    local: {
                        position: position,
                        rotation: rotation
                    }
                },
                text: {
                    contents: "Congratulations! You made it!\n\nBe sure to favorite this world.\n\nA new maze is created each day.",
                    anchor: MRESDK.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                    height: 0.18
                }
            }
        })   

    }

    private getPosition(row: number, column: number): MRESDK.Vector3 {
        let x = this.origin.x + this.scale * column
        let y = this.origin.y
        let z = this.origin.z + this.scale * row 

        return new MRESDK.Vector3(x, y, z)
    }

    private angleFromDirection(direction: Direction): number {
        var angle: number
        
        switch (direction) {
            case Direction.Top:
                angle = 0
                break
            case Direction.Left:
                angle = -90
                break
            case Direction.Bottom:
                angle = -180
                break
            case Direction.Right:
                angle = -270
                break
        }

        return angle * MRESDK.DegreesToRadians
    }

    public async drawLayoutTests() {
        this.drawAxes()

        // this.drawUnitCube()

        MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                transform: {
                    local: {
                        position: { x: 0.5, y: 1, z: 0.5 },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), -90 * MRESDK.DegreesToRadians),
                    }
                },
                text: {
                    contents: "Try and find the exit!\n\nCreated by Andre Muis",
                    anchor: MRESDK.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                    height: 0.1
                }
            }
        })

        /*
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:" + MazeRenderer.floorArtifactId,
            actor: {
                transform: {
                    local: {
                        position: { 
                            x: 1.0, 
                            y: 0.0, 
                            z: 1.0
                        },
                        scale: {x: 2.0, y: 2.0, z: 1.0},
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                    }
                }
            }
        })
        */
    }

    public async drawAxes() {
        const redMaterial = await this.context.assetManager.createMaterial('red', {
            color: MRESDK.Color3.FromInts(255, 0, 0)
        })

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: { x: 1, y: 0, z: 0 },
                radius: 0.1,
                uSegments: 10
            },
            actor: {
                appearance: { materialId: redMaterial.id },
                transform: {
                    local: {
                        position: { x: 0.5, y: 0, z: 0 }
                    }
                }
            }
        })

        const greenMaterial = await this.context.assetManager.createMaterial('green', {
            color: MRESDK.Color3.FromInts(0, 255, 0)
        })

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: { x: 0, y: 1, z: 0 },
                radius: 0.1,
                uSegments: 10
            },
            actor: {
                appearance: { materialId: greenMaterial.id },
                transform: {
                    local: {
                        position: { x: 0, y: 0.5, z: 0 }
                    }
                }
            }
        })

        const blueMaterial = await this.context.assetManager.createMaterial('blue', {
            color: MRESDK.Color3.FromInts(0, 0, 255)
        })

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: { x: 0, y: 0, z: 1 },
                radius: 0.1,
                uSegments: 10
            },
            actor: {
                appearance: { materialId: blueMaterial.id },
                transform: {
                    local: {
                        position: { x: 0, y: 0.0, z: 0.5 }
                    }
                }
            }
        })
    }

    private drawUnitCube() {
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: { x: 1.01, y: 1.01, z: 1.01 }
            },
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: 0, z: 0 }
                    }
                }
            }
        })
    }

    public drawToConsole() {
        for (var row = this.maze.rows - 1; row >= 0; row = row - 1) {
            var line = ""

            for (var column = 0; column < this.maze.columns; column = column + 1) {
                let cell = Maze.findCell(this.maze.cells, row, column)

                if (cell.equals(this.maze.startCell)) {
                    line = line + "S"
                } else if (cell.equals(this.maze.endCell)) {
                    line = line + "E"
                } else if (cell.type == CellType.Wall) {
                    line = line + "W"
                } else if (cell.type == CellType.Empty) {
                    line = line + " "
                }
            }

            console.log(line)
        }
    }
}
