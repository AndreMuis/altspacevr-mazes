export declare enum CellType {
    Empty = 0,
    Wall = 1
}
export declare class Cell {
    x: number;
    y: number;
    type: CellType;
    constructor(x: number, y: number, type: CellType);
}
export declare class Maze {
    cells: Cell[];
    private deadEndCells;
    startCell: Cell;
    endCell: Cell;
    width: number;
    height: number;
    scale: number;
    originX: number;
    originY: number;
    originZ: number;
    constructor(width: number, height: number, scale: number);
    populateCells(): void;
    findDeadEnds(): void;
    setStartAndEnd(): void;
    findCell(x: number, y: number): Cell;
    findCells(type: CellType): Cell[];
}
//# sourceMappingURL=maze.d.ts.map