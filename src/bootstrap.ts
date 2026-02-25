import * as BrickEngine from "brick-engine-js";
import { bootstrap } from "brick-engine-js";
import p5 from "p5";
import GameMenu from "./core/GameMenu";

(window as any).BrickEngine = BrickEngine;
(window as any).p5 = p5;

const p5Instance = bootstrap(GameMenu);

export default p5Instance;
