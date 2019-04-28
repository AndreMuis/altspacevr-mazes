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
        const whiteMaterial = this.context.assetManager.createMaterial('white', {
            color: new MRESDK.Color4(1, 1, 1, 0.5)
        }).value
        whiteMaterial.alphaMode = MRESDK.AlphaMode.Blend

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: new MRESDK.Vector3(1.0, 1.0, 1.0)
            },
            actor: {
                appearance: { materialId: whiteMaterial.id },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0, 0, 0)
                    }
                }
            }
        })
    }

    public drawAxes() {
        const redMaterial = this.context.assetManager.createMaterial('red', {
            color: MRESDK.Color3.FromInts(255, 0, 0)
        }).value

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: new MRESDK.Vector3(1, 0, 0),
                radius: 0.1,
                uSegments: 10
            },
            actor: {
                appearance: { materialId: redMaterial.id },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.5, 0, 0)
                    }
                }
            }
        })

        const greenMaterial = this.context.assetManager.createMaterial('green', {
            color: MRESDK.Color3.FromInts(0, 255, 0)
        }).value

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: new MRESDK.Vector3(0, 1, 0),
                radius: 0.1,
                uSegments: 10
            },
            actor: {
                appearance: { materialId: greenMaterial.id },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0, 0.5, 0)
                    }
                }
            }
        })

        const blueMaterial = this.context.assetManager.createMaterial('blue', {
            color: MRESDK.Color3.FromInts(0, 0, 255)
        }).value

        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Cylinder,
                dimensions: new MRESDK.Vector3(0, 0, 1),
                radius: 0.1,
                uSegments: 10
            },
            actor: {
                appearance: { materialId: blueMaterial.id },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 0.0, 0.5)
                    }
                }
            }
        })
    }
}
