"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utility {
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    static randomNumber(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a;
    }
}
exports.Utility = Utility;
//# sourceMappingURL=utility.js.map