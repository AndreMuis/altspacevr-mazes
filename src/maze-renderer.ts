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
            "1187133602853290886",
            "1187133531910833013",
            "1187133592577246083",
            "1187133657907725201",
            "1187133643378656142",
            "1187133618758091657",
            "1187133537808024438",
            "1187133563628159868",
            "1187133624068080522",
            "1187133548151178104",
            "1187133597929177989",
            "1187133614052082568",
            "1187133648529261455",
            "1187133629067690891",
            "1187133662966055826",
            "1187133633824031628",
            "1187133558527886203",
            "1187133608985363335",
            "1187133542908298103",
            "1187133638462931853",
            "1187133527162880884",
            "1187133587737019266",
            "1187133568669713277",
            "1187133578224337791",
            "1187133573501551486",
            "1187133553645716346",
            "1187133653109441424",
            "1187133582896792448",
            "1187133668099883923"]
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
