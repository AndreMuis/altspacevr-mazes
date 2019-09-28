import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { MazeRenderer } from './maze-renderer';

export class Sandbox {
    private context: MRESDK.Context

    constructor(context: MRESDK.Context) {
        this.context = context
    }

    public draw() {
        this.drawAxes()

        const renderer = new MazeRenderer(null, null, null)

        var z = 0
        for (const artifact of renderer.randomArtifacts) {
            this.drawArtifact(artifact.resourceId, 0, z, artifact.scale)
            z = z + 1
        }
    }

    private drawArtifact(resourceId: string, x: number, z: number, scale: number) {
        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: resourceId,
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(x, 0.0, z),
                        scale: new MRESDK.Vector3(scale, scale, scale),
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 0 * MRESDK.DegreesToRadians),
                    }
                }
            }
        })
    }

    private drawUnitCube() {
        const assetContainer = new MRESDK.AssetContainer(this.context)

        const whiteMaterial = assetContainer.createMaterial('white', {
            color: new MRESDK.Color4(1, 1, 1, 0.5)
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
                        position: new MRESDK.Vector3(0, 0, 0)
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
