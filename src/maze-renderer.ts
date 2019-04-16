import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Cell, CellType, Maze, WallSegment, Orientation } from "./maze"
import { Utility } from "./utility"

export class MazeRenderer {
    private context: MRESDK.Context
    private maze: Maze
    private scale: number
    private artifactScale: {}
    private wallArtifactIds: string[]

    get origin(): MRESDK.Vector3 {
        var vector3 = new MRESDK.Vector3()
    
        vector3.x = -this.scale * (0.5 + this.maze.startCell.row)
        vector3.y = -1.3
        vector3.z = -this.scale * (0.5 + this.maze.startCell.column)

        return vector3
    }

    constructor(context: MRESDK.Context, maze: Maze, scale: number) {
        this.context = context
        this.maze = maze
        this.scale = scale
        this.artifactScale = { x: scale, y: scale, z: scale }
        this.wallArtifactIds = [
            "1187223826837013125", 
            "1187223756188156525", 
            "1187223731282379368", 
            "1187223846038536840", 
            "1187223746457371243", 
            "1187223685841289817", 
            "1187223785724445300", 
            "1187223736206492265", 
            "1187223717231460966", 
            "1187223702903718499", 
            "1187223660063097424",
            "1187223840518832775", 
            "1187223821241811587", 
            "1187223800773608059", 
            "1187223712382845541", 
            "1187223665247257169", 
            "1187223795606225529", 
            "1187223776329204338", 
            "1187223761917575791", 
            "1187223695806956129", 
            "1187223790841496181", 
            "1187223691134501471", 
            "1187223766682305136", 
            "1187223741843636842", 
            "1187223650055488075", 
            "1187223851658904201", 
            "1187223707852997220", 
            "1187223856692069003", 
            "1187223781043602035", 
            "1187223805714498173", 
            "1187223726333100647", 
            "1187223771111490161", 
            "1187223676051784276", 
            "1187223810521170559", 
            "1187223655214481997", 
            "1187223671085728339", 
            "1187223815898268290", 
            "1187223680707461718", 
            "1187223751498924652"]
    }

    public draw() {
        //this.drawFloor(position, artifactScale)
        //this.drawCeiling(position, artifactScale)

        this.drawWalls()

        this.drawTeleporter()
    }

    private drawFloor(position: MRESDK.Vector3, artifactScale: {}) {
        let floorXOffset = this.scale / 2.0
        let floorYOffset = 0.0
        let floorZOffset = this.scale / 2.0

        let resourceId: string

        if (Utility.randomNumber(1, 10) <= 9) {
            resourceId = "artifact:1171073392846045810"
        } else {
            resourceId = "artifact:1171073392846045810"
        }

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    local: {
                        position: { 
                            x: position.x + floorXOffset, 
                            y: position.y + floorYOffset, 
                            z: position.z + floorZOffset 
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
                        scale: artifactScale
                    }
                }
            }
        })
    }

    private drawCeiling(position: MRESDK.Vector3, artifactScale: {}) {
        var ceilingXOffset = this.scale / 2.0
        var ceilingYOffset = this.scale
        var ceilingZOffset = this.scale / 2.0

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1171073388207145585",
            actor: {
                transform: {
                    local: {
                        position: { 
                            x: position.x + ceilingXOffset, 
                            y: position.y + ceilingYOffset, 
                            z: position.z + ceilingZOffset 
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians),
                        scale: artifactScale
                    }
                }
            }
        })
    }

    private drawWalls() {
        for (let wallSegment of this.maze.wallSegments) {
            let wallArtifactIdIndex = wallSegment.length - 1
            let wallArtifactId = this.wallArtifactIds[wallArtifactIdIndex]

            if (!wallArtifactId) {
                throw new Error("Wall artifact id not found at index = " + wallArtifactIdIndex)
            }

            let resourceId = "artifact: " + this.wallArtifactIds[wallSegment.length - 1]
            let position = this.getPosition(wallSegment.row, wallSegment.column)

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

            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: resourceId,
                actor: {
                    transform: {
                        local: {
                            position: position,
                            scale: this.artifactScale,
                            rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), rotationAngle * MRESDK.DegreesToRadians),
                        }
                    }
                }
            })
        }
    }

    public drawTeleporter() {
        let position = this.getPosition(this.maze.endCell.row, this.maze.endCell.column) 

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "teleporter:1101096999417021156",
            actor: {
                transform: {
                    local: {
                        position: { 
                            x: position.x + this.scale / 2.0, 
                            y: position.y, 
                            z: position.z + this.scale / 2.0
                        }
                    }
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

    public async drawLayoutTests() {
        this.drawAxes()

        // this.drawUnitCube()

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact:1185728423587218204",
            actor: {
                transform: {
                    local: {
                        position: { 
                            x: 1.0, 
                            y: 0.0, 
                            z: 0.0
                        },
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), -90 * MRESDK.DegreesToRadians),
                    }
                }
            }
        })
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
                let cell = this.maze.findCell(row, column)

                if (cell == this.maze.startCell) {
                    line = line + "S"
                } else if (cell == this.maze.endCell) {
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
