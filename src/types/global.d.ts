import { Game, GameView } from "brick-engine-js";
import p5 from "p5";

declare global {
  interface Window {
    BrickEngineGame: new (p: p5, view: GameView) => Game;
  }
}
