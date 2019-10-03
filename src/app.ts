import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Maze } from "./maze"
import { MazeRenderer } from "./maze-renderer"
import { Sandbox } from "./sandbox"

export default class App {
    private isSandbox = false

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())
    }

    private started() {
        if (this.isSandbox == false) {
            var maze = new Maze(29, 29)
            maze.setup()
    
            let renderer = new MazeRenderer(this.context, maze, 3.0) 
            renderer.draw()
            //renderer.drawToConsole()
    
            this.playBackgroundMusic()    
        } else {
            let sandbox = new Sandbox(this.context)
            sandbox.draw()
        }
    }

    private playBackgroundMusic() {
        const assetContainer = new MRESDK.AssetContainer(this.context)

        const sphereActor = MRESDK.Actor.Create(this.context, {
            actor: {
                appearance: { 
                    meshId: assetContainer.createSphereMesh('sphere', 0.1, 15, 15).id  
                },
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, 2.0, 0.0)
                    }
                }
            }
        })

        const backgroundMusicAsset = assetContainer.createSound(
            'backgroundMusic',
            { uri: `${this.baseUrl}/Orbit LOOP.ogg` }
        )

        sphereActor.startSound(backgroundMusicAsset.id, 
        {
            volume: 0.02,
            looping: true,
            doppler: 0.0,
            spread: 1.0,
            rolloffStartDistance: 1000.0
        })
    }
}
    