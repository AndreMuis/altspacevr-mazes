import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { MazeRenderer } from './maze-renderer';

export class Sandbox {
    private context: MRESDK.Context

    constructor(context: MRESDK.Context) {
        this.context = context
    }

    public draw() {
        this.drawOrigin()
        this.drawAxes()

        this.drawMainArtifaclts()

        this.drawUnitCube()
        this.drawRandomArtifacts()

        this.drawWallArtifacts()
    }

    private drawMainArtifaclts()
    {
        this.drawArtifact(MazeRenderer.floorResourceId, 2, 0, 1.0)
        this.drawArtifact(MazeRenderer.floorStartResourceId, 2, 1, 1.0)
        this.drawArtifact(MazeRenderer.floorEndResourceId, 2, 2, 1.0)
        this.drawArtifact(MazeRenderer.floorGrateResourceId, 2, 3, 1.0)

        this.drawArtifact(MazeRenderer.wallGrateResourceId, 2, 4, 1.0)

        this.drawArtifact(MazeRenderer.ceilingResourceId, 2, 5, 1.0)
        this.drawArtifact(MazeRenderer.ceilingLightsResourceId, 2, 6, 1.0)
    }

    private drawRandomArtifacts() {
        const renderer = new MazeRenderer(null, null, null)

        var z = 0
        for (const artifact of renderer.randomArtifacts) {
            this.drawArtifact(artifact.resourceId, 4, z, artifact.scale)
            z = z + 1
        }
    }

    private drawWallArtifacts() {
        const renderer = new MazeRenderer(null, null, null)

        var z = 0
        for (const artifactId of renderer.wallArtifactIds) {
            this.drawArtifact("artifact: " + artifactId, 6, z, 1.0)
            z = z + 2
        }
    }

    private drawArtifact(resourceId: string, x: number, z: number, scale: number) {
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(x, 0.0, z),
                        scale: new MRESDK.Vector3(scale, scale, scale)
                    }
                }
            }
        })
    }

    private drawUnitCube() {
        const assetContainer = new MRESDK.AssetContainer(this.context)

        const whiteMaterial = assetContainer.createMaterial('white', {
            color: new MRESDK.Color4(1, 1, 1, 0.7)
        })
        whiteMaterial.alphaMode = MRESDK.AlphaMode.Blend

        MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: { 
                    meshId: assetContainer.createBoxMesh('unitCubeBox', 1.0, 1.0, 1.0).id,
                    materialId: whiteMaterial.id
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(4, 0.5, 0)
                    }
                }
            }
        })
    }

    private drawOrigin() {
        const assetContainer = new MRESDK.AssetContainer(this.context)

        MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: { 
                    meshId: assetContainer.createSphereMesh('sphere', 0.2, 15, 15).id  
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 0.0, 0.0)
                    }
                }
            }
        })
    }

    public drawAxes() {
        const assetContainer = new MRESDK.AssetContainer(this.context)

        const redMaterial = assetContainer.createMaterial('red', {
            color: MRESDK.Color3.FromInts(255, 0, 0)
        })

        MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: { 
                    meshId: assetContainer.createCylinderMesh('xAxisCylinder', 1.0, 0.1, 'x', 10).id,
                    materialId: redMaterial.id 
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.5, 0, 0)
                    }
                }
            }
        })

        const greenMaterial = assetContainer.createMaterial('green', {
            color: MRESDK.Color3.FromInts(0, 255, 0)
        })

        MRESDK.Actor.Create(this.context, {
            actor: {                
                appearance: {
                    meshId: assetContainer.createCylinderMesh('yAxisCylinder', 1.0, 0.1, 'y', 10).id,
                    materialId: greenMaterial.id 
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0, 0.5, 0)
                    }
                }
            }
        })

        const blueMaterial = assetContainer.createMaterial('blue', {
            color: MRESDK.Color3.FromInts(0, 0, 255)
        })

        MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: {
                    meshId: assetContainer.createCylinderMesh('zAxisCylinder', 1.0, 0.1, 'z', 10).id,
                    materialId: blueMaterial.id 
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 0.0, 0.5)
                    }
                }
            }
        })
    }
}
