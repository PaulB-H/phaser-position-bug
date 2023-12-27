import { SHEETS } from "../constants";

interface iBlockSprite extends Phaser.Physics.Arcade.Sprite {
  properties: { [key: string]: any };
}
interface iBlock extends Phaser.Types.Tilemaps.TiledObject {
  x: number;
  y: number;
  gid: number;
  properties: { name: string; value: any }[];
}

export const parseMap = (scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) => {
  const blocksLayer = map.getObjectLayer("blocks");
  const wallsLayer = map.getObjectLayer("walls");

  if (blocksLayer) {
    blocksLayer.objects.forEach((block) => {
      const debugBlocks = true;

      //////  Debug Graphics
      if (debugBlocks) {
        const rectX = block.x!;
        const rectY = block.y! - block.height!;
        const rectWidth = block.height!;
        const rectHeight = block.height!;

        const graphics = scene.add.graphics();

        graphics.fillStyle(0xff0000);

        graphics.fillRect(rectX, rectY, rectWidth, rectHeight).setDepth(0);
      }

      const newBlock = block as iBlock;

      const blockSprite = scene.physics.add.sprite(
        newBlock.x,
        newBlock.y,
        SHEETS.Tiles,
        newBlock.gid - 1
      ) as iBlockSprite;

      blockSprite.setOrigin(0, 1);

      // Just takes array of object properties, and turns it into a single object
      if (newBlock.properties) {
        const blockProperties = newBlock.properties.reduce(
          (result, { name, value }) => {
            result[name] = value;
            return result;
          },
          {} as { [key: string]: any }
        );
        blockSprite.properties = blockProperties;
      }

      if (
        blockSprite.properties.color &&
        blockSprite.properties.color === "blue"
      ) {
        blockSprite.setPipeline("Light2D");
      }

      scene.add.text(
        blockSprite.x - 22,
        blockSprite.y - 42,
        `
          x: ${blockSprite.x}
          y: ${blockSprite.y}
        `,
        {
          fontSize: "1.5em",
          color: "black",
          fontFamily: "sans-serif",
        }
      );

      blockSprite.setInteractive();

      blockSprite.on("pointerdown", () => {
        console.log(blockSprite);
      });
    });
  }

  scene.add
    .text(15, 5, `pipeline DISABLED`, {
      fontSize: "1.25em",
      color: "black",
      fontFamily: "sans-serif",
      backgroundColor: "white",
    })
    .setDepth(9999);
  scene.add
    .text(15, 70, `pipeline ENABLED`, {
      fontSize: "1.25em",
      color: "black",
      fontFamily: "sans-serif",
      backgroundColor: "white",
    })
    .setDepth(9999);

  scene.add
    .text(15, 160, `pipeline ENABLED`, {
      fontSize: "1.25em",
      color: "black",
      fontFamily: "sans-serif",
      backgroundColor: "white",
    })
    .setDepth(9999);

  // These were just added to help judge positioning, however if we enabled
  // Light2D on them, they would also be affected by the positioning bug on odd coords
  if (wallsLayer) {
    wallsLayer.objects.forEach((wall: Phaser.Types.Tilemaps.TiledObject) => {
      const collisionGroup = map.tilesets[0].getTileCollisionGroup(
        wall.gid!
      ) as any;

      const collisionObjs = collisionGroup.objects;

      collisionObjs.forEach((collisionObj: any) => {
        if (collisionObj.rectangle) {
          const debugRects = true;

          //////  Debug Graphics
          if (debugRects && process.env.NODE_ENV === "development") {
            const rectX = collisionObj.x + wall.x!;
            const rectY = wall.y! - wall.height! + collisionObj.y;
            const rectWidth = collisionObj.width!;
            const rectHeight = collisionObj.height;

            // console.log(`rectX: ${rectX}, rectY: ${rectY}`);
            // console.log(`rectWidth: ${rectWidth}, rectHeight: ${rectHeight}`);
            // console.log(`wallX: ${wall.x}, wallY: ${wall.y}`);

            const graphics = scene.add.graphics();

            graphics.fillStyle(0xff0000);

            graphics
              .fillRect(rectX, rectY, rectWidth, rectHeight)
              .setDepth(1000);
          }

          const rectX = wall.x! + collisionObj.x;
          const rectY = wall.y! - wall.height! + collisionObj.y;

          const rectSprite = scene.physics.add
            .sprite(rectX, rectY, "null")
            .setOrigin(0, 0);

          let width;
          width = collisionObj.width!;

          rectSprite.setDisplaySize(width, collisionObj.height);

          // We create a graphics object based on the size of the created
          // sprite, and then generate a texture to fit it
          scene.make
            .graphics()
            .fillStyle(0x202020, 1)
            .fillRect(0, 0, rectSprite.width, rectSprite.height)
            .generateTexture("wallTexture");

          // Now apply the texture to the sprite
          rectSprite.setTexture("wallTexture");
        }
      });
    });
  }
};
