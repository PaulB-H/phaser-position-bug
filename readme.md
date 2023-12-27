Created for Phaser Issue 6698
[https://github.com/photonstorm/phaser/issues/6698](https://github.com/photonstorm/phaser/issues/6698)

## Version

* Phaser Version:
3.70.0 (WebGL | Web Audio)

* Operating system:
Windows 10 Home 64-bit (10.0, build 19045)

* Browser:
Firefox: 121.0 (64-bit)
Chrome 120.0.6099.130 (Official Build) (64-bit)

## Description

When enabling Light2D pipeline, sprites are shifted incorrectly ONLY if the x or y location is odd.

This was not resolved by trying roundPixels: false;

I used a non-extruded tile-set to ensure that was not related.

Tileset is 16x16px tiles on a 10x10 sheet
The map is 160 x 240
Using scale: ```mode: Phaser.Scale.FIT```

## Example Test Code

<!--
All issues must have source code demonstrating the problem. We automatically close issues after 30 days if no code is provided.

The code can be pasted directly below this comment, or you can link to codepen, jsbin, or similar. The code will ideally be runnable instantly. The more work involved in turning your code into a reproducible test case, the longer it will take the fix the issue.
-->

#### Live Example:
[https://paulbh.com/phaserbug](https://paulbh.com/phaserbug)

#### Repo:
[https://github.com/PaulB-H/phaser-position-bug](https://github.com/PaulB-H/phaser-position-bug)

### Assets:

tileset image & normal map:
breakout-assets.png, breakout-assets_n.png

tiled tileset:
breakout-tileset.tsx

If we look in our map file, position_test.json, we can see our block positions on lines 9 to 81:

Yellow blocks have the light2d pipeline disabled.
Blue block have it enabled.

Yellow
x: 32, y: 80
Yellow
x: 97, y: 81

Blue
x: 32, y: 144
Blue
x: 97, y: 145

Blue
x: 32, y: 208
Blue
x: 97, y: 209

in utility/parseMap.ts we can see the code that actually parses the map from tiled. I am using setOrigin(0, 1) to position the sprite correctly, but I also tried manually doing the alignment with no change.

```ts
export const parseMap = (scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) => {
  const blocksLayer = map.getObjectLayer("blocks");
  const wallsLayer = map.getObjectLayer("walls");

  blocksLayer.objects.forEach((block) => {
  
    const newBlock = block as iBlock;
  
    const blockSprite = scene.physics.add.sprite(
      newBlock.x,
      newBlock.y,
      SHEETS.Tiles,
      newBlock.gid - 1
    ) as iBlockSprite;
  
    blockSprite.setOrigin(0, 1);
  
    blockSprite.setPipeline("Light2D");
  };
};
```

We are also drawing debug rects using the coords from the blocks, which are positioned correctly.
```ts
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
```

## Additional Information

In the below image, left blocks are at even x/y coordinates, and the right blocks have their position shifted right and down by 1 pixel

Only the right blue blocks, which have odd x/y coordinates AND the Light2D pipeline are affected.

We can also note the overflow / sizing issue is not consistent between them, the right middle block seems stretched vertically a bit and too far right, whereas the bottom right block seems shifted down and to the right.

Trying to detect and subtract from the positioning when detecting an odd number does not work either, the overflow just moves to the opposite side, its as if its been moved half a pixel after enabling Light2D.

![image](https://github.com/photonstorm/phaser/assets/51964537/6902ab97-8fb6-4593-bf87-b432e4a7635c)

I think this is a bug because the positioning issue does not happen if the Light2D pipeline is disabled, however we can also see the top right yellow block (odd x/y coordinates, but no Light2D) does appear slightly stretched, but the position is correct.

I do also think it could have something to do with using power of 2 for the map size, so perhaps there is something fundamental about how scaling and map size works that I don't understand.