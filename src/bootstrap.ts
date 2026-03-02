import * as BrickEngine from "brick-engine-js";
import { bootstrap } from "brick-engine-js";
import p5 from "p5";
import GameMenu from "./core/GameMenu";
import VConsole from "vconsole";

const vConsole = new VConsole();

try {
  (window as any).BrickEngine = BrickEngine;
} catch (error) {
  console.error(error);
}

const p5Instance = bootstrap(GameMenu);

export default p5Instance;
