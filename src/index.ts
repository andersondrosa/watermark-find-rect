type Options = {
  gravity?:
    | "center"
    | "bottom-right"
    | "bottom"
    | "bottom-left"
    | "left"
    | "top-left"
    | "top"
    | "top-right"
    | "right";
  margin?: number;
  size?: number;
};

export type Logo = { width: number; height: number };
export type Rect = [x: number, y: number, width: number, height: number];

export const getRect = (
  { width, height }: Logo,
  logo: Logo,
  options: Options = {}
): Rect => {
  //
  const imgRect = width > height ? height : width;

  const gravity = options.gravity || "bottom-right";

  const margin = (options.margin >= 0 ? options.margin : 4) / 100;

  const size = (options.size || 20) / 100;

  const marginPx = margin * imgRect;
  const sizePx = size * imgRect;

  let x, y, w, h;

  if (logo.width >= logo.height) {
    const rect = logo.height;
    w = (sizePx / rect) * logo.width;
    h = sizePx;
  } else {
    const rect = logo.width;
    w = sizePx;
    h = (sizePx / rect) * logo.height;
  }

  if (w > width) {
    h = (width / w) * h;
    w = width;
  }

  if (h > height) {
    w = (height / h) * w;
    h = height;
  }

  switch (gravity) {
    case "center":
      x = width / 2 - w / 2;
      y = height / 2 - h / 2;
      break;
    case "bottom-right":
      x = width - w - marginPx;
      y = height - h - marginPx;
      break;
    case "bottom":
      x = width / 2 - w / 2;
      y = height - h - marginPx;
      break;
    case "bottom-left":
      x = marginPx;
      y = height - h - marginPx;
      break;
    case "left":
      x = marginPx;
      y = height / 2 - h / 2;
      break;
    case "top-left":
      x = marginPx;
      y = marginPx;
      break;
    case "top":
      x = width / 2 - w / 2;
      y = marginPx;
      break;
    case "top-right":
      x = width - w - marginPx;
      y = marginPx;
      break;
    case "right":
      x = width - w - marginPx;
      y = height / 2 - h / 2;
      break;
  }

  if (x + w > width) x = width - w < 0 ? 0 : width - w;

  if (y + h > height) y = height - h < 0 ? 0 : height - w;

  return [
    x > 0 ? Math.floor(x) : 0,
    y > 0 ? Math.floor(y) : 0,
    w > 0 ? Math.floor(w) : 0,
    h > 0 ? Math.floor(h) : 0,
  ];
};
