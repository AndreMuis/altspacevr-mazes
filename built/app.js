"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maze_1 = require("./maze");
const maze_renderer_1 = require("./maze-renderer");
class App {
    constructor(context, baseUrl) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.context.onStarted(() => this.started());
    }
    async started() {
        var maze = new maze_1.Maze(25, 25, 3.0);
        maze.populateCells();
        maze.findDeadEnds();
        maze.setStartAndEnd();
        let renderer = new maze_renderer_1.MazeRenderer(this.context, maze);
        renderer.draw();
        renderer.drawTeleporter();
        // renderer.drawOrigin();
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map