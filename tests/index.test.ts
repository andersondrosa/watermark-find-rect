import { getRect } from "../src";

describe("test", () => {
  //
  it("Should match equal", () => {
    //
    const image = { width: 80, height: 230 };

    const watermark = { width: 30, height: 23 };

    const [x, y, w, h] = getRect(image, watermark, {
      gravity: "right",
      margin: 3,
      size: 22,
    });

    const finalRect = [54, 106, 22, 17];
    
    expect([x, y, w, h]).toEqual(finalRect);
  });
});
