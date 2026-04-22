/**
 * UTILS: Geometry & Math
 * Standardized classes for positions and dimensions.
 */

window.Point = class {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  
  clone() { return new window.Point(this.x, this.y); }
};

window.Size = class {
  constructor(w = 0, h = 0) {
    this.w = w;
    this.h = h;
  }
};
