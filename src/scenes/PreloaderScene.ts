import { SCENES, SHEETS } from "../constants";

export default class PreloaderScene extends Phaser.Scene {
  constructor() {
    super("PreloaderScene");
  }

  preload() {
    this.load.spritesheet({
      key: SHEETS.Tiles,
      url: "assets/main-tileset/breakout-assets.png",
      normalMap: "assets/main-tileset/breakout-assets_n.png",
      frameConfig: {
        frameWidth: 16,
        frameHeight: 16,
      },
    });

    // Load Tilemap
    // prettier-ignore
    this.load.tilemapTiledJSON("position_test", "assets/levels/position_test.json");
  }

  create() {
    this.scene.start(SCENES.position_test);
  }
}
