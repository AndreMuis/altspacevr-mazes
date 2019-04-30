import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'
import * as MREEXT from '@microsoft/mixed-reality-extension-altspacevr-extras'

import { Maze } from "./maze"
import { MazeRenderer } from "./maze-renderer"
import { Sandbox } from "./sandbox"

export default class App {
    private videoPlayerManager: MREEXT.VideoPlayerManager

    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.videoPlayerManager = new MREEXT.VideoPlayerManager(context)

        this.context.onStarted(() => this.started())
    }

    private started() {
        var maze = new Maze(29, 29)
        maze.setup()

        let renderer = new MazeRenderer(this.context, maze, 3.0) 
        renderer.draw()
        //renderer.drawToConsole()

        this.playBackgroundMusic()

        //let sandbox = new Sandbox(this.context)
        //sandbox.draw()
    }

    private async playBackgroundMusic() 
    {
        const videoPlayer = await MRESDK.Actor.CreateEmpty(this.context, {
            actor: {
                transform: {
                    local: {
                        position: { x: 0, y: -5, z: 0 }
                    }
                },
            }
        })

        this.videoPlayerManager.play(
            videoPlayer.id,
            'https://www.youtube.com/watch?v=Uj8DYegtrHg',
            0.0)
    }
}
    