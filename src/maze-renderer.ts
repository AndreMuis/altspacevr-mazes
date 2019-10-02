import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Cell, CellType, Maze, WallSegment, Orientation, Direction } from "./maze"
import { Utility } from "./utility"
import { Vector3 } from '@microsoft/mixed-reality-extension-sdk';

export class RandomArtifact {
    constructor(public resourceId: string, public scale: number) {
    }
}   

export class MazeRenderer {
    private context: MRESDK.Context
    private maze: Maze
    private scale: number

    private wallArtifactIds: string[]

    private delayInMilliseconds = 100

    static readonly planeZeroScale = 0.001
    static readonly minInterPlanarDistance = 0.005

    static readonly floorResourceId = "artifact: 1189362288939762020"
    static readonly floorStartResourceId = "artifact: 1193698949010030914"
    static readonly floorEndResourceId = "artifact: 1193698953447604547"
    static readonly floorGrateResourceId = "artifact: 1193698970409369928"

    static readonly wallGrateResourceId = "artifact: 1193698962574410055"

    static readonly ceilingResourceId = "artifact: 1189362283956928866"
    static readonly ceilingLightsResourceId = "artifact: 1193698957834846532"

    static readonly springCampfireResourceId = "teleporter: 1148791394312127008"
    
    public randomArtifacts: RandomArtifact[]

    get origin(): MRESDK.Vector3 {
        var vector3 = new MRESDK.Vector3()
    
        vector3.x = -this.scale * (0.5 + this.maze.startCell.column)
        vector3.y = -1.4
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

        this.randomArtifacts = [
            new RandomArtifact("artifact: 1138718566997033797", 1.0), 
            new RandomArtifact("artifact: 1138718799789294497", 1.0), 
            new RandomArtifact("artifact: 1138718794806461341", 0.5),
            new RandomArtifact("artifact: 1138718377389326651", 0.25),
            new RandomArtifact("artifact: 1138718342190727473", 0.5), 
            new RandomArtifact("artifact: 1138718402722923277", 1.0), 
            new RandomArtifact("artifact: 1138718474101588781", 1.0), 
            new RandomArtifact("artifact: 1138718662451004253", 1.0), 
            new RandomArtifact("artifact: 1138718751630295942", 1.0), 
            new RandomArtifact("artifact: 1138718696013824871", 2.0),
            new RandomArtifact("artifact: 1138718851270181821", 1.0), 
            new RandomArtifact("artifact: 1162104634278412488", 1.0), 
            new RandomArtifact("artifact: 1162104847659434229", 0.2),
            new RandomArtifact("artifact: 1162104144006218376", 1.0), 
            new RandomArtifact("artifact: 1162104245290271398", 1.0)]
    }

    public draw() {
        this.drawFloor()
        this.drawCeiling()

        this.drawWalls()

        this.drawStart()
        this.drawEnd()

        this.drawRandomArtifacts()
    }

    private async drawFloor() {
        // floor
        let resourceId = MazeRenderer.floorResourceId
        var scale = new MRESDK.Vector3(39 * this.scale, 39 * this.scale, MazeRenderer.planeZeroScale)
        var position = this.getPosition(0, 0, scale.x / 2.0, 0, scale.y / 2.0)
        var rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians)

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

        // grates
        var emptyCells = Maze.findCells(this.maze.cells, CellType.Empty)

        for (const deadEndCell of this.maze.deadEndCells) {
            var emptyCell = Maze.findCell(emptyCells, deadEndCell.row, deadEndCell.column)

            emptyCells.splice(emptyCells.indexOf(emptyCell), 1)
            Maze.removeNearestNeighborCells(emptyCells, emptyCell)
        }

        let grateCount = emptyCells.length / 20

        for (var count = 1; count <= grateCount; count = count + 1) {
            var randomIndex = Utility.randomNumber(0, emptyCells.length - 1)
            var emptyCell = emptyCells[randomIndex]

            position = this.getPosition(emptyCell.row, emptyCell.column, this.scale / 2.0, MazeRenderer.minInterPlanarDistance, this.scale / 2.0)
            rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
            scale = new MRESDK.Vector3(this.scale, this.scale, MazeRenderer.planeZeroScale)

            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: MazeRenderer.floorGrateResourceId,
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

            emptyCells.splice(emptyCells.indexOf(emptyCell), 1)    
            Maze.removeNearestNeighborCells(emptyCells, emptyCell)
        }
    }

    private async drawCeiling() {
        // ceiling
        let resourceId = MazeRenderer.ceilingResourceId
        var scale = new MRESDK.Vector3(39 * this.scale, 39 * this.scale, MazeRenderer.planeZeroScale)
        var position = this.getPosition(0, 0, scale.x / 2.0, this.scale, scale.y / 2.0)
        var rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)

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

        // lights
        var emptyCells = Maze.findCells(this.maze.cells, CellType.Empty)
        let lightCount = emptyCells.length / 20

        for (var count = 1; count <= lightCount; count = count + 1) {
            var randomIndex = Utility.randomNumber(0, emptyCells.length - 1)
            var emptyCell = emptyCells[randomIndex]

            position = this.getPosition(emptyCell.row, emptyCell.column, this.scale / 2.0, this.scale - MazeRenderer.minInterPlanarDistance, this.scale / 2.0)
            rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), -90 * MRESDK.DegreesToRadians)
            scale = new MRESDK.Vector3(this.scale, this.scale, MazeRenderer.planeZeroScale)

            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: MazeRenderer.ceilingLightsResourceId,
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

            emptyCells.splice(emptyCells.indexOf(emptyCell), 1)    
            Maze.removeNearestNeighborCells(emptyCells, emptyCell)
        }    
    }

    private async drawWalls() {
        // walls
        for (let wallSegment of this.maze.wallSegments) {
            let wallArtifactIdIndex = wallSegment.length - 1
            let wallArtifactId = this.wallArtifactIds[wallArtifactIdIndex]

            if (!wallArtifactId) {
                throw new Error("Wall artifact id not found at index = " + wallArtifactIdIndex)
            }

            let resourceId = "artifact: " + this.wallArtifactIds[wallSegment.length - 1]
            let position = this.getPosition(wallSegment.row, wallSegment.column, 0, 0, 0)
            let scale = new MRESDK.Vector3(this.scale, this.scale, this.scale)

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
            Utility.delay(this.delayInMilliseconds)
        }

        // grates
        var wallCells = Maze.findCells(this.maze.cells, CellType.Wall)
        let grateCount = wallCells.length / 20

        for (var count = 1; count <= grateCount; count = count + 1) {
            var randomIndex = Utility.randomNumber(0, wallCells.length - 1)
            var wallCell = wallCells[randomIndex]

            var position = this.getPosition(wallCell.row, wallCell.column, this.scale / 2.0, this.scale / 2.0, this.scale / 2.0)
            var scale = new Vector3(this.scale + MazeRenderer.minInterPlanarDistance, this.scale + MazeRenderer.minInterPlanarDistance, this.scale + MazeRenderer.minInterPlanarDistance)

            MRESDK.Actor.CreateFromLibrary(this.context, {
                resourceId: MazeRenderer.wallGrateResourceId,
                actor: {
                    transform: {
                        local: {
                            position: position,
                            scale: scale
                        }
                    }
                }
            })
            Utility.delay(this.delayInMilliseconds)

            wallCells.splice(wallCells.indexOf(wallCell), 1)    
            Maze.removeNearestNeighborCells(wallCells, wallCell)
        }     
    }

    private async drawStart() {
        // floor panel
        var position = this.getPosition(this.maze.startCell.row, this.maze.startCell.column, this.scale / 2.0, MazeRenderer.minInterPlanarDistance, this.scale / 2.0)
        var rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
        let scale = new MRESDK.Vector3(this.scale, this.scale, MazeRenderer.planeZeroScale)

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: MazeRenderer.floorStartResourceId,
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

        // text
        let neighborCell = Maze.findCellAtDirection(this.maze.cells, this.maze.startCell, this.maze.startCell.openFaceDirection)
        position = this.getPosition(neighborCell.row, neighborCell.column, this.scale / 2.0, 1.6, this.scale / 2.0)
        rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), this.angleFromDirection(this.maze.startCell.openFaceDirection))

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

    private async drawEnd() {
        // floor panel
        var position = this.getPosition(this.maze.endCell.row, this.maze.endCell.column, this.scale / 2.0, MazeRenderer.minInterPlanarDistance, this.scale / 2.0)
        var rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians)
        var scale = new MRESDK.Vector3(this.scale, this.scale, MazeRenderer.planeZeroScale)

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: MazeRenderer.floorEndResourceId,
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

        // teleporter
        position = this.getPosition(this.maze.endCell.row, this.maze.endCell.column, this.scale / 2.0, 0.0, this.scale / 2.0)
        scale = new MRESDK.Vector3(1.5, 1.5, 1.5)

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

        // text
        position = this.getPosition(this.maze.endCell.row, this.maze.endCell.column, this.scale / 2.0, 2.2, this.scale / 2.0)
        rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), this.angleFromDirection(this.maze.endCell.openFaceDirection) + Math.PI)

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

    private async drawRandomArtifacts() {
        const deadEndCells  = [...this.maze.deadEndCells]
        deadEndCells.splice(deadEndCells.indexOf(this.maze.startCell), 1)    
        deadEndCells.splice(deadEndCells.indexOf(this.maze.endCell), 1)    

        for (const randomArtifact of this.randomArtifacts) {
            if (deadEndCells.length >= 1) {
                var randomIndex = Utility.randomNumber(0, deadEndCells.length - 1)
                var deadEndCell = deadEndCells[randomIndex]

                var position = this.getPosition(deadEndCell.row, deadEndCell.column, this.scale / 2.0, 0.0, this.scale / 2.0)
                var scale = new Vector3(2.0 * randomArtifact.scale, 2.0 * randomArtifact.scale, 2.0 * randomArtifact.scale)
                var rotation = MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Up(), this.angleFromDirection(deadEndCell.openFaceDirection))

                MRESDK.Actor.CreateFromLibrary(this.context, {
                    resourceId: randomArtifact.resourceId,
                    actor: {
                        transform: {
                            local: {
                                position: position,
                                scale: scale,
                                rotation: rotation
                            }
                        }
                    }
                })
                Utility.delay(this.delayInMilliseconds)

                deadEndCells.splice(deadEndCells.indexOf(deadEndCell), 1)    
                Maze.removeNearestNeighborCells(deadEndCells, deadEndCell)
            }
        }
    }

    private getPosition(row: number, column: number, xOffset: number, yOffset: number, zOffset: number) {
        let x = this.origin.x + this.scale * column + xOffset
        let y = this.origin.y + yOffset
        let z = this.origin.z + this.scale * row + zOffset 

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
