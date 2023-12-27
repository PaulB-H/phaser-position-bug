import { parseMap } from "../utility/parseMap";
import { IMAGES, SCENES, SHEETS } from "../constants";

export default class PositionTest extends Phaser.Scene {
  constructor() {
    super(SCENES.position_test);
  }

  preload() {}

  create() {
    this.cameras.roundPixels = false;

    this.lights.enable().setAmbientColor(0x999999);

    // Create Tilemap
    const map = this.make.tilemap({
      key: SCENES.position_test,
      tileWidth: 16,
      tileHeight: 16,
    });
    map.addTilesetImage(IMAGES.BreakoutAssets, SHEETS.Tiles);

    parseMap(this, map);
  }
}
