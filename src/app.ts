import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';

export default class Demo {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());
    }
    
    private async started() {
        await MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere,
                radius: 1
            },
            actor: {
                transform: {
                    position: { x: 0, y: 0, z: 0 }
                },
            }
        });
    }
}
