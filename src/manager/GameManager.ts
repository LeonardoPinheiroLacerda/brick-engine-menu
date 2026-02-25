import {
  Game,
  GameEntry,
  setActiveGame,
  ControlKey,
  ControlEventType,
} from "brick-engine-js";
import GameMenuSingleton from "../core/GameMenuSingleton";

export default class GameManager {
  public async handleGameSwitch(entry: GameEntry, actualGame: Game) {
    try {
      await this._loadGameScript(entry.url);

      if (window.BrickEngineGame) {
        const gameInstance = new window.BrickEngineGame(
          actualGame.p,
          actualGame.view,
        );

        // Set properly the Game ID using the GameRepository fetch ID
        gameInstance.gameId = entry.id;

        this.switchTo(gameInstance, actualGame);

        // Cleanup
        delete window.BrickEngineGame;
      } else {
        console.error(
          "Game bundle loaded but window.BrickEngineGame was not set.",
        );
      }
    } catch (e) {
      console.error("Failed to load game:", e);
    }
  }

  public switchTo(newGame: Game, oldGame: Game) {
    try {
      // Clean up current game
      oldGame.destroy();

      // Set the engine's active game so the p5 loop draws it
      setActiveGame(newGame);

      // Set up the new game (initializes modules, including control subscribers)
      newGame.setup();

      const { control, state } = newGame.modules;

      // Update debugger
      newGame.view.updateDebuggerGameModules(newGame.modules);

      // Ensure the p5 loop is running (since destroy() calls noLoop())
      newGame.p.loop();

      // Bind the new game controls to the view
      newGame.view.bindControls(control);
      state.turnOn();

      // Setup exit and power buttons specifically for client games (to return to menu)
      if (
        GameMenuSingleton.hasInstance() &&
        newGame !== GameMenuSingleton.getInstance()
      ) {
        control.subscribe(ControlKey.EXIT, ControlEventType.PRESSED, () => {
          this.switchTo(GameMenuSingleton.getInstance(), newGame);
        });

        control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => {
          // Only return to menu if turning OFF
          if (state.isOn()) {
            this.switchTo(GameMenuSingleton.getInstance(), newGame);
            // Note: The menu will start in the OFF state because we call state.turnOff() below
            // or because of the default state logic.
            state.turnOff();
          }
        });
      }
    } catch (error) {
      console.error("Error switching game:", error);
    }
  }

  private _loadGameScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const existingScript = document.getElementById("game-client-script");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.src = url;
      script.id = "game-client-script";
      script.crossOrigin = "anonymous";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script ${url}`));
      document.head.appendChild(script);
    });
  }
}
