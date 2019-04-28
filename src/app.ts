import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Maze } from "./maze"
import { MazeRenderer } from "./maze-renderer"
import { Sandbox } from "./sandbox"

export default class App {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        require('@microsoft/mixed-reality-extension-sdk/built/protocols/protocol').DefaultConnectionTimeoutSeconds = 0

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
    }
}
    