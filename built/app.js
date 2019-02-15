"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRESDK = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
class Demo {
    constructor(context, baseUrl) {
        this.context = context;
        this.baseUrl = baseUrl;
        this.context.onStarted(() => this.started());
    }
    async started() {
        await MRESDK.Actor.CreatePrimitive(this.context, {
            definition: {
                shape: MRESDK.PrimitiveShape.Sphere,
                radius: 1
            },
            actor: {
                transform: {
                    position: { x: 0, y: 0, z: 0 }
                },
            }
        });
    }
}
exports.default = Demo;
//# sourceMappingURL=app.js.map