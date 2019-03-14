import * as MRESDK from '@microsoft/mixed-reality-extension-sdk';
import { Maze } from "./maze";
export declare class MazeRenderer {
    private context;
    private maze;
    constructor(context: MRESDK.Context, maze: Maze);
    draw(): void;
    private drawFloor;
    private drawCeiling;
    private drawWall;
    drawTeleporter(): void;
    drawOrigin(): void;
    private getPosition;
}
//# sourceMappingURL=maze-renderer.d.ts.map