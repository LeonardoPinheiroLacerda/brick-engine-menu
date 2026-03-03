import * as BrickEngine from "brick-engine-js";
import { bootstrap } from "brick-engine-js";
import GameMenu from "./core/GameMenu";
import VConsole from "vconsole";
import p5 from "p5";

const vConsole = new VConsole();
(window as any).vConsole = vConsole;
(window as any).p5 = p5;
(window as any).BrickEngine = BrickEngine;

const p5Instance = bootstrap(GameMenu);

export default p5Instance;
