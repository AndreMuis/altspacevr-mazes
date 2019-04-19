import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Cell, CellType, Maze, WallSegment, Orientation } from "./maze"
import { Utility } from "./utility"
import { Vector3 } from '@microsoft/mixed-reality-extension-sdk';

export class MazeRenderer {
    private context: MRESDK.Context
    private maze: Maze
    private scale: number

    private wallArtifactIds: string[]
    static readonly floorArtifactId = "1189362288939762020"
    static readonly ceilingArtifactId = "1189362283956928866"
    
    get origin(): MRESDK.Vector3 {
        var vector3 = new MRESDK.Vector3()
    
        vector3.x = -this.scale * (0.5 + this.maze.startCell.row)
        vector3.y = -1.35
        vector3.z = -this.scale * (0.5 + this.maze.startCell.column)

        return vector3
    }

    constructor(context: MRESDK.Context, maze: Maze, scale: number) {
        this.context = context
        this.maze = maze
        this.scale = scale
        this.wallArtifactIds = [
            "1188788462526923420", 
            "1188788467887243933", 
            "1188788540004106928", 
            "1188788534996107951", 
            "1188788616793424576", 
            "1188788626499044034", 
            "1188788556143788723", 
            "1188788491853496995", 
            "1188788565916517046", 
            "1188788611902866111", 
            "1188788525013664427", 
            "1188788575571804856", 
            "1188788520257323690", 
            "1188788452645143194", 
            "1188788529862279852", 
            "1188788473155289758", 
            "1188788570748355255", 
            "1188788621868532417", 
            "1188788561042735796", 
            "1188788457703473819", 
            "1188788603178713789", 
            "1188788487197819553", 
            "1188788584572781242", 
            "1188788501282292389", 
            "1188788545146323633", 
            "1188788631565763268", 
            "1188788514972500648", 
            "1188788551387447986", 
            "1188788580110041785", 
            "1188788648082932425", 
            "1188788447788139161", 
            "1188788641439154886", 
            "1188788636338881221", 
            "1188788607742116542", 
            "1188788496618226340", 
            "1188788505803752102", 
            "1188788482198209184", 
            "1188788510434263719", 
            "1188788477743858335"]
    }

    public draw() {
        this.drawFloor()
        this.drawCeiling()

        this.drawWalls()

        this.drawTeleporter()
    }

    private drawFloor() {
        let resourceId = "artifact: " + MazeRenderer.floorArtifactId
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
        let resourceId = "artifact: " + MazeRenderer.ceilingArtifactId
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

            await Utility.delay(10)
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
