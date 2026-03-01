import {
  Game,
  GameView,
  ControlEventType,
  ControlKey,
  FontAlign,
  FontSize,
  FontVerticalAlign,
  Sound,
  StateProperty,
} from "brick-engine-js";
import GameRepository from "../data/GameRepository";
import GameManager from "../manager/GameManager";
import GameMenuSingleton from "./GameMenuSingleton";

export default class GameMenu extends Game {
  private _gameSelectionPointer = 0;
  private _isLoading = false;

  private _gameRepository = new GameRepository();
  private _gameManager = new GameManager();

  constructor(view: GameView) {
    super(view);
    GameMenuSingleton.setInstance(this);
  }

  setupGame() {
    this.gameId = "game-menu";

    const { state, control, sound, session } = this.modules;

    session.setSessionEnabled(false);

    control.subscribe(ControlKey.ACTION, ControlEventType.PRESSED, () => {
      if (this._isLoading) return;

      if (state.isStarted()) {
        const selectedGame =
          this._gameRepository.games[this._gameSelectionPointer];
        this._gameManager.handleGameSwitch(selectedGame, this);
      }
    });

    control.subscribe(ControlKey.LEFT, ControlEventType.PRESSED, () => {
      if (state.isPlaying()) {
        sound.play(Sound.ACTION_1);
        if (this._gameSelectionPointer === 0) {
          this._gameSelectionPointer = this._gameRepository.games.length - 1;
        } else {
          this._gameSelectionPointer--;
        }
      }
    });

    control.subscribe(ControlKey.RIGHT, ControlEventType.PRESSED, () => {
      if (state.isPlaying()) {
        sound.play(Sound.ACTION_1);
        if (
          this._gameSelectionPointer ===
          this._gameRepository.games.length - 1
        ) {
          this._gameSelectionPointer = 0;
        } else {
          this._gameSelectionPointer++;
        }
      }
    });

    state.subscribe(StateProperty.ON, (on) => {
      if (on) {
        sound.play(Sound.START_THEME);
      }
    });
  }

  update() {}

  render() {
    const { text } = this.modules;

    const { p } = this;
    p.push();

    text.setTextSize(FontSize.LARGE);
    text.setActiveText();
    text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);

    text.textOnDisplay("Menu", { x: 0.5, y: 0.15 });

    text.setTextSize(FontSize.SMALL);

    text.textOnDisplay("Choose a game and", { x: 0.5, y: 0.25 });
    text.textOnDisplay("Press action to play", { x: 0.5, y: 0.32 });

    text.setTextAlign(FontAlign.RIGHT, FontVerticalAlign.BOTTOM);
    text.textOnDisplay("<", { x: 0.1, y: 0.54 });

    text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);
    text.textOnDisplay(">", { x: 0.9, y: 0.54 });

    text.setTextSize(FontSize.MEDIUM);
    text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.BOTTOM);
    text.textOnDisplay(
      this._gameRepository.games[this._gameSelectionPointer].name,
      { x: 0.5, y: 0.55 },
    );

    text.setTextSize(FontSize.EXTRA_SMALL);
    text.setTextAlign(FontAlign.LEFT, FontVerticalAlign.BOTTOM);

    text.textOnDisplay("Left:    Previous option", { x: 0.05, y: 0.78 });
    text.textOnDisplay("Right:   Next option", { x: 0.05, y: 0.84 });
    text.textOnDisplay("Action:  Select", { x: 0.05, y: 0.9 });

    p.pop();
  }

  drawTitleScreen() {
    const { text } = this.modules;

    this.p.push();

    text.setTextSize(FontSize.LARGE);
    text.setActiveText();
    text.setTextAlign(FontAlign.CENTER, FontVerticalAlign.TOP);

    text.textOnDisplay("Menu", { x: 0.5, y: 0.15 });

    text.setTextSize(FontSize.SMALL);

    text.textOnDisplay("Wellcome to your", { x: 0.5, y: 0.25 });
    text.textOnDisplay("favorite brick game", { x: 0.5, y: 0.32 });
    text.textOnDisplay("simulator!", { x: 0.5, y: 0.39 });

    text.setTextSize(FontSize.MEDIUM);

    text.pulsingTextOnDisplay(
      "Press start",
      { x: 0.5, y: 0.64 },
      this.modules.time.elapsedTime,
    );
    text.pulsingTextOnDisplay(
      "to continue.",
      { x: 0.5, y: 0.72 },
      this.modules.time.elapsedTime,
    );

    this.p.pop();
  }

  drawGameOverScreen() {
    // Menu doesn't have a game over screen
  }
}
