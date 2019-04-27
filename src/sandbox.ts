import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

export class Sandbox {
    private context: MRESDK.Context

    constructor(context: MRESDK.Context) {
        this.context = context
    }

    public draw() {
        this.drawAxes()

        // this.drawUnitCube()

        MRESDK.Actor.CreateFromLibrary(this.context, {
            resourceId: "artifact: 1193698962574410055",
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 0.0, 0.0),
                        scale: new MRESDK.Vector3(1.0, 1.0, 1.0),
                        rotation: MRESDK.Quaternion.RotationAxis(MRESDK.Vector3.Right(), 90 * MRESDK.DegreesToRadians),
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
                        position: new MRESDK.Vector3(0, 0.0, 0.5)
                    }
                }
            }
        })
    }

    private drawUnitCube() {
        MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Box,
                dimensions: new MRESDK.Vector3(1.01, 1.01, 1.01)
            },
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0, 0, 0)
                    }
                }
            }
        })
    }
}
