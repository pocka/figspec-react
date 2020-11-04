import { LitElement, property } from "lit-element";

import type { Constructor } from "./utils";

export interface Positioned {
  panX: number;
  panY: number;
  scale: number;
  zoomSpeed: number;
  panSpeed: number;

  isMovable: boolean;
}

/**
 * @property {number} panX
 */
export const PositionedMixin = <T extends Constructor<LitElement>>(
  superClass: T
): T & Constructor<Positioned> => {
  class Positioned extends superClass {
    @property({
      attribute: false,
    })
    panX: number = 0;

    @property({
      attribute: false,
    })
    panY: number = 0;

    @property({
      attribute: false,
    })
    scale: number = 1;

    @property({
      type: Number,
      attribute: "zoom-speed",
    })
    zoomSpeed: number = 500;

    @property({
      type: Number,
      attribute: "pan-speed",
    })
    panSpeed: number = 500;

    get isMovable() {
      return true;
    }

    #isDragModeOn: boolean = false;

    constructor(...args: any[]) {
      super(...args);

      this.addEventListener(
        "wheel",
        (ev) => {
          if (!this.isMovable) return;

          ev.preventDefault();

          if (ev.ctrlKey) {
            // Performs zoom when ctrl key is pressed.
            let { deltaY } = ev;

            if (ev.deltaMode === 1) {
              // Firefox quirk
              deltaY *= 15;
            }

            const prevScale = this.scale;

            this.scale *= 1 - deltaY / ((1000 - this.zoomSpeed) * 0.5);

            // Performs pan to archive "zoom at the point" behavior (I don't know how to call it).
            const offsetX = ev.offsetX - this.offsetWidth / 2;
            const offsetY = ev.offsetY - this.offsetHeight / 2;

            this.panX += offsetX / this.scale - offsetX / prevScale;
            this.panY += offsetY / this.scale - offsetY / prevScale;
          } else {
            // Performs pan otherwise (to be close to native behavior)
            // Adjusting panSpeed in order to make panSpeed=500 to match to the Figma's one.
            const speed = this.panSpeed * 0.002;

            this.panX -= (ev.deltaX * speed) / this.scale;
            this.panY -= (ev.deltaY * speed) / this.scale;
          }
        },
        // This component prevents every native wheel behavior on it.
        { passive: false }
      );

      this.addEventListener("pointermove", (ev) => {
        // Performs pan only when middle buttons is pressed.
        //
        // 4 ... Auxiliary button (usually the mouse wheel button or middle button)
        // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
        if (!(ev.buttons & 4)) return;

        ev.preventDefault();

        // Moving amount of middle button+pointer move panning should matches to the actual
        // pointer travel distance. Since translate goes after scaling, we need to scale
        // delta too.
        this.#movePanel(ev.movementX, ev.movementY);
      });

      // Listen to keyboard events to enable dragging when Space is pressed, just like in Figma
      this.#listenToKeyboardEvents();

      /** @private */
      this.onmousedown = () => {
        if (this.#isDragModeOn) {
          document.body.style.cursor = "grabbing";

          this.onmousemove = ({ movementX, movementY }: MouseEvent) => {
            this.#movePanel(movementX, movementY);
          };

          // cleanup unnecessary listeners when user stops dragging
          this.onmouseup = () => {
            document.body.style.cursor = "grab";
            this.onmousemove = null;
            this.onmouseup = null;
          };
        }
      };
    }

    disconnectedCallback() {
      document.removeEventListener("keyup", this.#keyUp);
      document.removeEventListener("keydown", this.#keyDown);
      super.disconnectedCallback();
    }

    // Dispatch events when the position-related value changes.
    updated(changedProperties: Parameters<LitElement["updated"]>[0]) {
      super.updated(changedProperties);

      if (changedProperties.has("scale")) {
        this.dispatchEvent(
          new CustomEvent<{ scale: number }>("scalechange", {
            detail: {
              scale: this.scale,
            },
          })
        );
      }

      if (changedProperties.has("panX") || changedProperties.has("panY")) {
        this.dispatchEvent(
          new CustomEvent<{ x: number; y: number }>("positionchange", {
            detail: {
              x: this.panX,
              y: this.panY,
            },
          })
        );
      }
    }

    #movePanel = (shiftX: number, shiftY: number) => {
      this.panX += shiftX / this.scale / window.devicePixelRatio;
      this.panY += shiftY / this.scale / window.devicePixelRatio;
    };

    // Enable drag mode when holding the spacebar
    #keyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !this.#isDragModeOn) {
        this.#isDragModeOn = true;
        document.body.style.cursor = "grab";
      }
    };

    // Disable drag mode when space lets the spacebar go
    #keyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" && this.#isDragModeOn) {
        this.#isDragModeOn = false;
        document.body.style.cursor = "auto";
      }
    };

    #listenToKeyboardEvents = () => {
      document.addEventListener("keyup", this.#keyUp);
      document.addEventListener("keydown", this.#keyDown);
    };
  }

  return Positioned;
};
