import * as MRESDK from '@microsoft/mixed-reality-extension-sdk'

import { Maze } from "./maze"
import { MazeRenderer } from "./maze-renderer"

export default class App {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started())
    }
    
    public async started() {  
        var maze = new Maze(5, 5)
        maze.setup()

        let renderer = new MazeRenderer(this.context, maze, 3.0) 
        renderer.draw()
    
        //renderer.drawAxes()

        //renderer.drawLayoutTests()

        renderer.drawToConsole()
    }
}
    