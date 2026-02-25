import * as BrickEngine from "brick-engine-js";
import {
  bootstrap,
  setActiveGame,
  Game,
  ControlKey,
  ControlEventType,
} from "brick-engine-js";
import p5 from "p5";
import GameMenu from "./core/GameMenu";
import GameMenuSingleton from "./core/GameMenuSingleton";

(window as any).BrickEngine = BrickEngine;
(window as any).p5 = p5;

let _game: Game;

const _switchHandler = (newGame: Game) => {
  try {
    // Note: oldGame.destroy() is already called by Game.switchGame()
    // which unbinds previous controls and calls noLoop()

    // Propagate the switch handler to the new game
    newGame.propagateSwitchHandler(_game);

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
        newGame.switchGame(GameMenuSingleton.getInstance());
      });

      control.subscribe(ControlKey.POWER, ControlEventType.PRESSED, () => {
        // Only return to menu if turning OFF
        if (state.isOn()) {
          newGame.switchGame(GameMenuSingleton.getInstance());
          // Note: The menu will start in the OFF state because we call state.turnOff() below
          // or because of the default state logic.
          state.turnOff();
        }
      });
    }
    _game = newGame;
  } catch (error) {
    console.error("Error switching game:", error);
  }
};

const p5Instance = bootstrap(GameMenu);

// When the GameMenu is instantiated, it will be available in the singleton.
// We need to set the switch handler to the menu instance.
if (GameMenuSingleton.hasInstance()) {
  const menu = GameMenuSingleton.getInstance();
  _game = menu;
  menu.setSwitchHandler(_switchHandler);
}

export default p5Instance;
