import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';

import { Maze } from "./maze";
import { MazeRenderer } from "./maze-renderer";

export default class App {
    constructor(private context: MRESDK.Context, private baseUrl: string) {
        this.context.onStarted(() => this.started());

        this.started()
    }
    
    public async started() {  
        var maze = new Maze(9, 9, 3.0);

        maze.populateCells();
        maze.populateNeighbors();

        maze.findDeadEnds(); 
        maze.setStartAndEnd();

        maze.populateWallSegments();

        let renderer = new MazeRenderer(this.context, maze); 

        //renderer.drawLayoutTests();

        //renderer.draw();
        //renderer.drawTeleporter();

        renderer.drawToConsole();
    }
}
    