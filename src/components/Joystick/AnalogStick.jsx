import { useEffect } from "react";
/**
 * ref: https://bobboteck.github.io/joy/joy.html
 **/

const StickStatus = {
  xPosition: 0,
  yPosition: 0,
  x: 0,
  y: 0,
  cardinalDirection: "C",
};

class AnalogStick {
  /**
   * Principal object that draws a joystick. Initialize the object and specify the HTML container.
   *
   * @constructor
   * @param {string} container - HTML object that contains the Joystick.
   * @param {object} [parameters={}] - Optional parameters to customize the joystick.
   * @param {string} [parameters.title='joystick'] - The ID of canvas.
   * @param {number} [parameters.width] - The width of the canvas.
   * @param {number} [parameters.height] - The height of the canvas.
   * @param {string} [parameters.internalFillColor='#0A0A0A'] - Internal color of the Stick.
   * @param {number} [parameters.internalLineWidth=2] - Border width of the Stick.
   * @param {string} [parameters.internalStrokeColor='#0A0A0A'] - Border color of the Stick.
   * @param {number} [parameters.externalLineWidth=2] - External reference circumference width.
   * @param {string} [parameters.externalStrokeColor='transparent'] - External reference circumference color.
   * @param {boolean} [parameters.autoReturnToCenter=true] - Whether the stick should return to the center when released.
   * @param {function} callback - Function to call with the stick status.
   */
  constructor(container, parameters = {}, callback = () => {}) {
    this.parameters = parameters;
    this.callback = callback;
    this.container = container;
    this.title = parameters.title || "joystick";
    this.width = parameters.width || 0;
    this.height = parameters.height || 0;
    this.internalFillColor = parameters.internalFillColor || "#0A0A0A";
    this.internalLineWidth = parameters.internalLineWidth || 2;
    this.internalStrokeColor = parameters.internalStrokeColor || "#0A0A0A";
    this.externalLineWidth = parameters.externalLineWidth || 2;
    this.externalStrokeColor = parameters.externalStrokeColor || "transparent";
    this.autoReturnToCenter = parameters.autoReturnToCenter ?? true;

    this.initCanvas();
    this.initStick();
  }

  /**
   * Initialize the canvas element.
   */
  initCanvas() {
    this.objContainer = document.getElementById(this.container);
    this.objContainer.style.touchAction = "none";

    this.canvas = document.createElement("canvas");
    this.canvas.id = this.title;
    this.canvas.width = this.width || this.objContainer.clientWidth;
    this.canvas.height = this.height || this.objContainer.clientHeight;
    this.objContainer.appendChild(this.canvas);
    this.context = this.canvas.getContext("2d");
  }

  /**
   * Initialize the joystick stick.
   */
  initStick() {
    this.pressed = 0;
    this.circumference = 2 * Math.PI;
    this.internalRadius =
      (this.canvas.width - (this.canvas.width / 2 + 10)) / 2;
    this.maxMoveStick = this.internalRadius + 5;
    this.externalRadius = this.internalRadius + 30;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
    this.directionHorizontalLimitPos = this.canvas.width / 10;
    this.directionHorizontalLimitNeg = this.directionHorizontalLimitPos * -1;
    this.directionVerticalLimitPos = this.canvas.height / 10;
    this.directionVerticalLimitNeg = this.directionVerticalLimitPos * -1;
    this.movedX = this.centerX;
    this.movedY = this.centerY;

    this.drawExternal();
    this.drawInternal();

    if ("ontouchstart" in document.documentElement) {
      this.canvas.addEventListener(
        "touchstart",
        this.onTouchStart.bind(this),
        false
      );
      document.addEventListener(
        "touchmove",
        this.onTouchMove.bind(this),
        false
      );
      document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
    } else {
      this.canvas.addEventListener(
        "mousedown",
        this.onMouseDown.bind(this),
        false
      );
      document.addEventListener(
        "mousemove",
        this.onMouseMove.bind(this),
        false
      );
      document.addEventListener("mouseup", this.onMouseUp.bind(this), false);
    }
  }

  /**
   * Draw the external circle used as reference position.
   */
  drawExternal() {
    this.context.beginPath();
    this.context.arc(
      this.centerX,
      this.centerY,
      this.externalRadius,
      0,
      this.circumference,
      false
    );
    this.context.lineWidth = this.externalLineWidth;
    this.context.strokeStyle = this.externalStrokeColor;
    this.context.stroke();
  }

  /**
   * Draw the internal stick in the current position the user has moved it.
   */
  drawInternal() {
    this.context.beginPath();
    if (this.movedX < this.internalRadius) {
      this.movedX = this.maxMoveStick;
    }
    if (this.movedX + this.internalRadius > this.canvas.width) {
      this.movedX = this.canvas.width - this.maxMoveStick;
    }
    if (this.movedY < this.internalRadius) {
      this.movedY = this.maxMoveStick;
    }
    if (this.movedY + this.internalRadius > this.canvas.height) {
      this.movedY = this.canvas.height - this.maxMoveStick;
    }
    this.context.arc(
      this.movedX,
      this.movedY,
      this.internalRadius,
      0,
      this.circumference,
      false
    );
    const grd = this.context.createRadialGradient(
      this.centerX,
      this.centerY,
      5,
      this.centerX,
      this.centerY,
      200
    );
    grd.addColorStop(0, this.internalFillColor);
    grd.addColorStop(1, this.internalStrokeColor);
    this.context.fillStyle = grd;
    this.context.fill();
    this.context.lineWidth = this.internalLineWidth;
    this.context.strokeStyle = this.internalStrokeColor;
    this.context.stroke();
  }

  /**
   * Handle touch start event.
   * @param {TouchEvent} event
   */
  onTouchStart(event) {
    this.pressed = 1;
    this.touchId = event.targetTouches[0].identifier;
  }

  /**
   * Handle touch move event.
   * @param {TouchEvent} event
   */
  onTouchMove(event) {
    if (this.pressed === 1 && event.targetTouches[0].target === this.canvas) {
      this.movedX = event.targetTouches[0].pageX;
      this.movedY = event.targetTouches[0].pageY;
      if (this.canvas.offsetParent.tagName.toUpperCase() === "BODY") {
        this.movedX -= this.canvas.offsetLeft;
        this.movedY -= this.canvas.offsetTop;
      } else {
        this.movedX -= this.canvas.offsetParent.offsetLeft;
        this.movedY -= this.canvas.offsetParent.offsetTop;
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawExternal();
      this.drawInternal();

      StickStatus.xPosition = this.movedX;
      StickStatus.yPosition = this.movedY;
      StickStatus.x = (
        100 *
        ((this.movedX - this.centerX) / this.maxMoveStick)
      ).toFixed();
      StickStatus.y = (
        100 *
        ((this.movedY - this.centerY) / this.maxMoveStick) *
        -1
      ).toFixed();
      StickStatus.cardinalDirection = this.getCardinalDirection();
      this.callback(StickStatus);
    }
  }

  /**
   * Handle touch end event.
   * @param {TouchEvent} event
   */
  onTouchEnd(event) {
    if (event.changedTouches[0].identifier !== this.touchId) return;

    this.pressed = 0;
    if (this.autoReturnToCenter) {
      this.movedX = this.centerX;
      this.movedY = this.centerY;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawExternal();
    this.drawInternal();

    StickStatus.xPosition = this.movedX;
    StickStatus.yPosition = this.movedY;
    StickStatus.x = (
      100 *
      ((this.movedX - this.centerX) / this.maxMoveStick)
    ).toFixed();
    StickStatus.y = (
      100 *
      ((this.movedY - this.centerY) / this.maxMoveStick) *
      -1
    ).toFixed();
    StickStatus.cardinalDirection = this.getCardinalDirection();
    this.callback(StickStatus);
  }

  /**
   * Handle mouse down event.
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
    this.pressed = 1;
  }

  /**
   * Handle mouse move event.
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    if (this.pressed === 1) {
      this.movedX = event.pageX;
      this.movedY = event.pageY;
      if (this.canvas.offsetParent.tagName.toUpperCase() === "BODY") {
        this.movedX -= this.canvas.offsetLeft;
        this.movedY -= this.canvas.offsetTop;
      } else {
        this.movedX -= this.canvas.offsetParent.offsetLeft;
        this.movedY -= this.canvas.offsetParent.offsetTop;
      }
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawExternal();
      this.drawInternal();

      StickStatus.xPosition = this.movedX;
      StickStatus.yPosition = this.movedY;
      StickStatus.x = (
        100 *
        ((this.movedX - this.centerX) / this.maxMoveStick)
      ).toFixed();
      StickStatus.y = (
        100 *
        ((this.movedY - this.centerY) / this.maxMoveStick) *
        -1
      ).toFixed();
      StickStatus.cardinalDirection = this.getCardinalDirection();
      this.callback(StickStatus);
    }
  }

  /**
   * Handle mouse up event.
   * @param {MouseEvent} event
   */
  onMouseUp(event) {
    this.pressed = 0;
    if (this.autoReturnToCenter) {
      this.movedX = this.centerX;
      this.movedY = this.centerY;
    }
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawExternal();
    this.drawInternal();

    StickStatus.xPosition = this.movedX;
    StickStatus.yPosition = this.movedY;
    StickStatus.x = (
      100 *
      ((this.movedX - this.centerX) / this.maxMoveStick)
    ).toFixed();
    StickStatus.y = (
      100 *
      ((this.movedY - this.centerY) / this.maxMoveStick) *
      -1
    ).toFixed();
    StickStatus.cardinalDirection = this.getCardinalDirection();
    this.callback(StickStatus);
  }

  /**
   * Get the cardinal direction of the stick.
   * @returns {string} - The cardinal direction (N, NE, E, SE, S, SW, W, NW, C).
   */
  getCardinalDirection() {
    let result = "";
    const horizontal = this.movedX - this.centerX;
    const vertical = this.movedY - this.centerY;

    if (
      vertical >= this.directionVerticalLimitNeg &&
      vertical <= this.directionVerticalLimitPos
    ) {
      result = "C";
    }
    if (vertical < this.directionVerticalLimitNeg) {
      result = "N";
    }
    if (vertical > this.directionVerticalLimitPos) {
      result = "S";
    }

    if (horizontal < this.directionHorizontalLimitNeg) {
      if (result === "C") {
        result = "W";
      } else {
        result += "W";
      }
    }
    if (horizontal > this.directionHorizontalLimitPos) {
      if (result === "C") {
        result = "E";
      } else {
        result += "E";
      }
    }

    return result;
  }

  /**
   * Get the width of the canvas.
   * @returns {number} - The width of the canvas in pixels.
   */
  GetWidth() {
    return this.canvas.width;
  }

  /**
   * Get the height of the canvas.
   * @returns {number} - The height of the canvas in pixels.
   */
  GetHeight() {
    return this.canvas.height;
  }

  /**
   * Get the X position of the cursor relative to the canvas that contains it and to its dimensions.
   * @returns {number} - The relative X position.
   */
  GetPosX() {
    return this.movedX;
  }

  /**
   * Get the Y position of the cursor relative to the canvas that contains it and to its dimensions.
   * @returns {number} - The relative Y position.
   */
  GetPosY() {
    return this.movedY;
  }

  /**
   * Get the normalized value of X move of stick.
   * @returns {number} - Integer from -100 to +100.
   */
  GetX() {
    return (100 * ((this.movedX - this.centerX) / this.maxMoveStick)).toFixed();
  }

  /**
   * Get the normalized value of Y move of stick.
   * @returns {number} - Integer from -100 to +100.
   */
  GetY() {
    return (
      100 *
      ((this.movedY - this.centerY) / this.maxMoveStick) *
      -1
    ).toFixed();
  }

  /**
   * Get the direction of the cursor as a string that indicates the cardinal points where this is oriented.
   * @returns {string} - String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center.
   */
  GetDir() {
    return this.getCardinalDirection();
  }
}

const AnalogStickComponent = ({ onUp, onDown, onRight, onLeft, onIdle }) => {
  useEffect(() => {
    if (window && window.AnalogStickInstance === undefined) {
      window.AnalogStickInstance = new AnalogStick(
        "joyElement",
        { internalFillColor: "#a6a6a6", internalStrokeColor: "#121212" },
        function (stickData) {
          // if (stickData.cardinalDirection === "W") {
          //   onRight();
          // }
          // if (stickData.cardinalDirection === "E") {
          //   onLeft();
          // }
        }
      );

      setInterval(function () {
        if (window === undefined || window?.AnalogStickInstance === undefined) {
          return;
        }

        if (["N"].includes(window.AnalogStickInstance.GetDir())) {
          return onUp();
        }

        if (["NW"].includes(window.AnalogStickInstance.GetDir())) {
          return onUp() && onLeft();
        }

        if (["NE"].includes(window.AnalogStickInstance.GetDir())) {
          return onUp() && onRight();
        }

        if (["W", "SW", "NW"].includes(window.AnalogStickInstance.GetDir())) {
          return onLeft();
        }

        if (["W", "SW", "NW"].includes(window.AnalogStickInstance.GetDir())) {
          return onLeft();
        }

        if (["E", "SE", "NE"].includes(window.AnalogStickInstance.GetDir())) {
          return onRight();
        }

        if (["S"].includes(window.AnalogStickInstance.GetDir())) {
          return onDown();
        }

        if (["SW"].includes(window.AnalogStickInstance.GetDir())) {
          return onDown() && onLeft();
        }

        if (["SE"].includes(window.AnalogStickInstance.GetDir())) {
          return onDown() && onRight();
        }

        if (["C"].includes(window.AnalogStickInstance.GetDir())) {
          return onIdle();
        }
      }, 35);
    }
  });

  return (
    <div className="btn-mnc btn-mnc-size-2 text-white">
      <div
        id="joyElement"
        style={{
          textAlign: "center",
          width: 120,
          height: 120,
          margin: -4,
          padding: -4,
          zIndex: 20,
        }}
      ></div>
    </div>
  );
};

export default AnalogStickComponent;
