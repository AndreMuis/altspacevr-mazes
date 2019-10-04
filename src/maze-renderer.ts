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

    private delayInMilliseconds = 1000

    static readonly planeZeroScale = 0.001
    static readonly minInterPlanarDistance = 0.005

    static readonly floorResourceId = "artifact: 1310377349564334600"
    static readonly floorStartResourceId = "artifact: 1310377356510102026 "
    static readonly floorEndResourceId = "artifact: 1310377342090084870"
    static readonly floorGrateResourceId = "artifact: 1310377363724304908"

    static readonly wallGrateResourceId = "artifact: 1310377332787118596"

    static readonly ceilingResourceId = "artifact: 1310377318895583744"
    static readonly ceilingLightsResourceId = "artifact: 1310377325967180290"

    static readonly springCampfireResourceId = "teleporter: 1148791394312127008"
    
    public wallArtifactIds: string[]
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
            "1310391102276109047", 
            "1310391007510004445", 
            "1310391245536756524", 
            "1310391015764394719", 
            "1310391057581605611", 
            "1310391147230659339", 
            "1310391188393558809", 
            "1310391041198654183", 
            "1310391066490307309", 
            "1310390978804187859", 
            "1310391180264997654", 
            "1310391254059582255", 
            "1310391294693998692", 
            "1310391196522119963", 
            "1310391155493438221", 
            "1310391032415781605", 
            "1310391138842051336", 
            "1310390993484251864", 
            "1310391228759540517", 
            "1310391049453044457", 
            "1310391164007875345", 
            "1310391205170774813", 
            "1310391237022319399", 
            "1310391261928096561", 
            "1310391113281962752", 
            "1310391212770853663", 
            "1310391093627454196", 
            "1310391171742171924", 
            "1310390985749955286", 
            "1310391085238846194", 
            "1310391075273179887", 
            "1310391130327614213", 
            "1310391122333270787", 
            "1310391278705312711", 
            "1310391000430019290", 
            "1310391024027173603", 
            "1310391270182486896", 
            "1310391286959702040", 
            "1310391220765197089"]

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
        await Utility.delay(this.delayInMilliseconds)

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
            await Utility.delay(this.delayInMilliseconds)

            emptyCells.splice(emptyCells.indexOf(emptyCell), 1)    
            Maze.removeNearestNeighborCells(emptyCells, emptyCell)
        }
    }

    private async drawCeiling() {
        // ceiling
        let resourceId = MazeRenderer.ceilingResourceId
        var scale = new MRESDK.Vector3(39 * this.scale, 39 * this.scale, MazeRenderer.planeZeroScale)
        var position = this.getPosition(0, 0, scale.x / 2.0, this.scale, scale.y / 2.0)
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
        await Utility.delay(this.delayInMilliseconds)

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
            await Utility.delay(this.delayInMilliseconds)

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
            await Utility.delay(this.delayInMilliseconds)
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
            await Utility.delay(this.delayInMilliseconds)

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
        await Utility.delay(this.delayInMilliseconds)

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
                    contents: "Try and find the exit!\n\nCreated by Happy Endings",
                    anchor: MRESDK.TextAnchorLocation.MiddleCenter,
                    color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                    height: 0.23
                }
            }
        })   
        await Utility.delay(this.delayInMilliseconds)
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
        await Utility.delay(this.delayInMilliseconds)

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
        await Utility.delay(this.delayInMilliseconds)

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
        await Utility.delay(this.delayInMilliseconds)
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
                await Utility.delay(this.delayInMilliseconds)

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
