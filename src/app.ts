import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Maze } from "./maze"
import { MazeRenderer } from "./maze-renderer"
import { Sandbox } from "./sandbox"

export default class App {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())
    }

    private started() {
        var maze = new Maze(29, 29)
        maze.setup()

        let renderer = new MazeRenderer(this.context, maze, 3.0) 
        renderer.draw()
        //renderer.drawToConsole()

        //let sandbox = new Sandbox(this.context)
        //sandbox.draw()

        this.playBackgroundMusic()
    }

    private playBackgroundMusic() {
        const sphereActor = MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere
            },
            actor: {
                transform: {
                    local: {
                        position: new MRESDK.Vector3(0.0, -5.0, 0.0)
                    }
                }
            }

        }).value

        const backgroundMusicAsset = this.context.assetManager.createSound(
            'backgroundMusic',
            { uri: `${this.baseUrl}/Orbit LOOP.ogg` }
        )

        sphereActor.startSound(backgroundMusicAsset.value.id, 
        {
            volume: 0.01,
            looping: true,
            doppler: 0.0,
            spread: 1.0,
            rolloffStartDistance: 1000.0
        },
        0.0)
    }
}
    