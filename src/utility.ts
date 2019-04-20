export class Utility {
    static distance(x1: number, y1: number, x2: number, y2: number): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    }

    static randomNumber(a: number, b: number) {
        return Math.floor(Math.random() * (b - a + 1)) + a
    }

    static delay(milliseconds: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => resolve(), milliseconds);
        });
    }
}

