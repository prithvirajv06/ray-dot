export interface ElementConfig {
  label: string;
  properties: Record<string, any>;
}

export interface WorkspaceElement {
  id: string;
  type: string;
  x: number;
  y: number;
  config: ElementConfig;
}

export interface ConnectionPoint {
  elementId: string;
  type: 'input' | 'output';
  element: HTMLElement;
}

export interface Connection {
  id: string;
  from: ConnectionPoint;
  to: ConnectionPoint;
}

export interface PlatformData {
  elements: WorkspaceElement[];
  connections: { id: string; from: string; to: string }[];
}

export interface ViewTransform {
  scale: number;
  translateX: number;
  translateY: number;
}
