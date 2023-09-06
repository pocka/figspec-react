import {
  FigspecFrameViewer as FigspecFrameViewerElement,
  FigspecFileViewer as FigspecFileViewerElement,
} from "@figspec/components";
import { createComponent } from "@lit-labs/react";

import * as React from "react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export type FigspecPreferences = FigspecFileViewerElement["preferences"];

// Frame viewer

type FigspecFrameViewerElementProps =
  // Required props
  Pick<
    FigspecFrameViewerElement,
    // Element props
    "apiResponse" | "renderedImage"
  > &
    // Optional props
    Partial<
      Pick<
        FigspecFrameViewerElement,
        // HTML attributes
        | "id"
        | "className"
        | "style"
        // Element attributes (will be converted to kebab-case)
        | "link"
        | "preferences"
      >
    >;

interface FigspecFrameViewerEvents {
  onNodeSelect?(ev: CustomEvent<{ selectedNode: unknown | null }>): void;
  onPreferencesUpdate?(
    ev: CustomEvent<{ preferences: FigspecPreferences }>
  ): void;
}

export type FigspecFrameViewerProps = FigspecFrameViewerElementProps &
  FigspecFrameViewerEvents;

// NOTE: These exported components are casted with `as unknown as ...` in order not to break
//       typings accidentally. `as unknown` is required because a component created by
//       `createComponent` has `RefAttributes<unknown>`, which is incompatible with existing
//       type signature (and breaks ref typings). Also the explicit props definition prevents
//       every properties turns into optional.
export const FigspecFrameViewer = createComponent({
  react: React,
  tagName: "figspec-frame-viewer",
  elementClass: FigspecFrameViewerElement,
  events: {
    onNodeSelect: "nodeselect",
    onPreferencesUpdate: "preferencesupdate",
  },
}) as unknown as ForwardRefExoticComponent<
  FigspecFrameViewerProps & RefAttributes<FigspecFrameViewerElement>
>;

// File viewer

type FigspecFileViewerElementProps =
  // Required props
  Pick<
    FigspecFileViewerElement,
    // Element props
    "apiResponse" | "renderedImages"
  > &
    // Optional props
    Partial<
      Pick<
        FigspecFileViewerElement,
        // HTML attributes
        | "id"
        | "className"
        | "style"
        // Element attributes (will be converted to kebab-case)
        | "link"
        | "preferences"
      >
    >;

interface FigspecFileViewerEvents {
  onNodeSelect?(ev: CustomEvent<{ selectedNode: unknown | null }>): void;
  onPreferencesUpdate?(
    ev: CustomEvent<{ preferences: FigspecPreferences }>
  ): void;
}

export type FigspecFileViewerProps = FigspecFileViewerElementProps &
  FigspecFileViewerEvents;

export const FigspecFileViewer = createComponent({
  react: React,
  tagName: "figspec-file-viewer",
  elementClass: FigspecFileViewerElement,
  events: {
    onNodeSelect: "nodeselect",
    onPreferencesUpdate: "preferencesupdate",
  },
}) as unknown as ForwardRefExoticComponent<
  FigspecFileViewerProps & RefAttributes<FigspecFileViewerElement>
>;
