import Phaser from "phaser";

import PreloaderScene from "./scenes/PreloaderScene";
import PositionTest from "./scenes/Position_Test";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: 160,
  height: 240,
  backgroundColor: "#add8e6",
  pixelArt: true,
  roundPixels: false,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [PreloaderScene, PositionTest],
  scale: {
    mode: Phaser.Scale.FIT,
    min: { width: 160, height: 240 },
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  maxLights: 50,
};

export default new Phaser.Game(config);
