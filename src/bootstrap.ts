import * as BrickEngine from "brick-engine-js";
import { bootstrap } from "brick-engine-js";
import GameMenu from "./core/GameMenu";
import VConsole from "vconsole";

const vConsole = new VConsole();

const p5Instance = bootstrap(GameMenu);

export default p5Instance;
