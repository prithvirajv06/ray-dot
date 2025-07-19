import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  WorkspaceElement,
  ElementConfig,
  ConnectionPoint,
  PlatformData,
  Connection,
  ViewTransform,
} from './../interface/ruleInterfaces';
import { from } from 'rxjs';

@Component({
  selector: 'fox-rule-playground',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rule-playground.component.html',
  styleUrl: './rule-playground.component.scss',
})
export class RulePlaygroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('workspace', { static: true })
  workspaceRef!: ElementRef<HTMLDivElement>;

  elements: WorkspaceElement[] = [];
  connections: Connection[] = [];
  selectedElement: WorkspaceElement | null = null;

  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private workspace!: HTMLDivElement;

  private draggedElement: WorkspaceElement | null = null;
  private dragOffset = { x: 0, y: 0 };
  private connecting = false;
  private connectionStart: ConnectionPoint | null = null;
  private nextId = 1;

  private resizeObserver!: ResizeObserver;

  // Zoom and pan properties
  private viewTransform: ViewTransform = {
    scale: 1,
    translateX: 0,
    translateY: 0,
  };
  private isPanning = false;
  private lastPanPoint = { x: 0, y: 0 };
  private minScale = 0.1;
  private maxScale = 3;

  toolbarItems = [
    { type: 'input', label: 'Input Field' },
    { type: 'button', label: 'Button' },
    { type: 'text', label: 'Text Block' },
    { type: 'api', label: 'API Call' },
    { type: 'condition', label: 'Condition' },
  ];

  jsonOutput = '';

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.workspace = this.workspaceRef.nativeElement;

    this.resizeCanvas();
    this.updateJSON();

    // Setup resize observer
    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
    });
    this.resizeObserver.observe(this.workspace);
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  onDragStart(event: DragEvent, type: string) {
    event.dataTransfer?.setData('text/plain', type);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    const type = event.dataTransfer?.getData('text/plain');
    if (!type) return;

    const rect = this.workspace.getBoundingClientRect();
    const x =
      (event.clientX - rect.left - this.viewTransform.translateX) /
      this.viewTransform.scale;
    const y =
      (event.clientY - rect.top - this.viewTransform.translateY) /
      this.viewTransform.scale;

    this.createElement(type, x, y);
  }

  onWorkspaceClick(event: MouseEvent) {
    if (
      this.connecting &&
      !(event.target as HTMLElement).classList.contains('connection-point')
    ) {
      this.cancelConnection();
    }
  }

  onWorkspaceMouseDown(event: MouseEvent) {
    if (event.target === this.workspace || event.target === this.canvas) {
      this.isPanning = true;
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      this.workspace.classList.add('panning');
      event.preventDefault();
    }
  }

  onWorkspaceMouseUp(event: MouseEvent) {
    if (this.isPanning) {
      this.isPanning = false;
      this.workspace.classList.remove('panning');
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.isPanning) {
      const deltaX = event.clientX - this.lastPanPoint.x;
      const deltaY = event.clientY - this.lastPanPoint.y;

      this.viewTransform.translateX += deltaX;
      this.viewTransform.translateY += deltaY;

      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      this.drawConnections();
      return;
    }

    if (this.connecting && this.connectionStart) {
      this.drawConnections();
      this.drawConnectionPreview(event);
    }
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();

    const rect = this.workspace.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate zoom
    const zoomIntensity = 0.1;
    const zoom = event.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

    const newScale = Math.max(
      this.minScale,
      Math.min(this.maxScale, this.viewTransform.scale * zoom)
    );

    if (newScale !== this.viewTransform.scale) {
      // Zoom towards mouse position
      const scaleFactor = newScale / this.viewTransform.scale;

      this.viewTransform.translateX =
        mouseX - (mouseX - this.viewTransform.translateX) * scaleFactor;
      this.viewTransform.translateY =
        mouseY - (mouseY - this.viewTransform.translateY) * scaleFactor;
      this.viewTransform.scale = newScale;

      this.drawConnections();
    }
  }

  onElementMouseDown(event: MouseEvent, element: WorkspaceElement) {
    if ((event.target as HTMLElement).classList.contains('connection-point')) {
      return;
    }

    this.selectElement(element);
    this.draggedElement = element;

    const elementRect = (
      event.currentTarget as HTMLElement
    ).getBoundingClientRect();
    this.dragOffset.x = event.clientX - elementRect.left;
    this.dragOffset.y = event.clientY - elementRect.top;

    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.handleDragEnd);
  }

  onElementClick(event: MouseEvent, element: WorkspaceElement) {
    if (!(event.target as HTMLElement).classList.contains('connection-point')) {
      this.selectElement(element);
    }
  }

  onConnectionPointClick(
    event: MouseEvent,
    elementId: string,
    type: 'input' | 'output'
  ) {
    event.stopPropagation();

    const connectionPoint: ConnectionPoint = {
      elementId,
      type,
      element: event.target as HTMLElement,
    };

    if (!this.connecting) {
      this.startConnection(connectionPoint);
    } else {
      this.completeConnection(connectionPoint);
    }
  }

  private handleDrag = (event: MouseEvent) => {
    if (!this.draggedElement) return;

    const rect = this.workspace.getBoundingClientRect();
    const x =
      (event.clientX -
        rect.left -
        this.dragOffset.x -
        this.viewTransform.translateX) /
      this.viewTransform.scale;
    const y =
      (event.clientY -
        rect.top -
        this.dragOffset.y -
        this.viewTransform.translateY) /
      this.viewTransform.scale;

    this.draggedElement.x = Math.max(0, x);
    this.draggedElement.y = Math.max(0, y);

    this.drawConnections();
    this.updateJSON();
  };

  private handleDragEnd = () => {
    this.draggedElement = null;
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.handleDragEnd);
  };

  private createElement(type: string, x: number, y: number) {
    const id = `element_${this.nextId++}`;
    const config = this.getElementConfig(type);

    const element: WorkspaceElement = {
      id,
      type,
      x: Math.max(0, x),
      y: Math.max(0, y),
      config,
    };

    this.elements.push(element);
    this.updateJSON();
  }

  private getElementConfig(type: string): ElementConfig {
    const configs: Record<string, ElementConfig> = {
      input: {
        label: 'Input Field',
        properties: { placeholder: 'Enter text' },
      },
      button: { label: 'Button', properties: { text: 'Click me' } },
      text: { label: 'Text Block', properties: { content: 'Sample text' } },
      api: { label: 'API Call', properties: { url: '', method: 'GET' } },
      condition: {
        label: 'Condition',
        properties: { operator: '==', value: '' },
      },
    };
    return configs[type] || { label: type, properties: {} };
  }

  private selectElement(element: WorkspaceElement) {
    this.selectedElement = element;
  }

  private startConnection(connectionPoint: ConnectionPoint) {
    this.connecting = true;
    this.connectionStart = connectionPoint;
    this.workspace.classList.add('connecting');
    connectionPoint.element.style.background = '#28a745';
  }

  private completeConnection(connectionEnd: ConnectionPoint) {
    if (!this.connectionStart) return;

    if (this.canConnect(this.connectionStart, connectionEnd)) {
      this.createConnection(this.connectionStart, connectionEnd);
    }

    this.cancelConnection();
  }

  private canConnect(start: ConnectionPoint, end: ConnectionPoint): boolean {
    // Can't connect to self
    if (start.elementId === end.elementId) return false;

    // Output to input only
    if (start.type !== 'output' || end.type !== 'input') return false;

    // Check if connection already exists
    return !this.connections.some(
      (conn) =>
        conn.from.elementId === start.elementId &&
        conn.to.elementId === end.elementId
    );
  }

  private createConnection(start: ConnectionPoint, end: ConnectionPoint) {
    const connection: Connection = {
      id: `connection_${this.nextId++}`,
      from: start,
      to: end,
    };

    this.connections.push(connection);
    this.drawConnections();
    this.updateJSON();
  }

  private cancelConnection() {
    this.connecting = false;
    this.workspace.classList.remove('connecting');

    if (this.connectionStart) {
      this.connectionStart.element.style.background = '#007bff';
      this.connectionStart = null;
    }

    this.drawConnections();
  }

  private resizeCanvas() {
    const rect = this.workspace.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    this.drawConnections();
  }

  private drawConnections() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply transform to canvas
    this.ctx.save();
    this.ctx.scale(this.viewTransform.scale, this.viewTransform.scale);
    this.ctx.translate(
      this.viewTransform.translateX / this.viewTransform.scale,
      this.viewTransform.translateY / this.viewTransform.scale
    );

    this.connections.forEach((connection) => {
      const fromElement = this.workspace.querySelector(
        `[data-id="${connection.from.elementId}"]`
      ) as HTMLElement;
      const toElement = this.workspace.querySelector(
        `[data-id="${connection.to.elementId}"]`
      ) as HTMLElement;

      if (fromElement && toElement) {
        const fromRect = fromElement.getBoundingClientRect();
        const toRect = toElement.getBoundingClientRect();
        const workspaceRect = this.workspace.getBoundingClientRect();

        const fromX =
          (fromRect.right -
            workspaceRect.left -
            this.viewTransform.translateX) /
          this.viewTransform.scale;
        const fromY =
          (fromRect.top +
            fromRect.height / 2 -
            workspaceRect.top -
            this.viewTransform.translateY) /
          this.viewTransform.scale;
        const toX =
          (toRect.left - workspaceRect.left - this.viewTransform.translateX) /
          this.viewTransform.scale;
        const toY =
          (toRect.top +
            toRect.height / 2 -
            workspaceRect.top -
            this.viewTransform.translateY) /
          this.viewTransform.scale;

        this.drawConnection(fromX, fromY, toX, toY);
      }
    });

    this.ctx.restore();
  }

  private drawConnectionPreview(event: MouseEvent) {
    if (!this.connectionStart) return;

    const fromElement = this.workspace.querySelector(
      `[data-id="${this.connectionStart.elementId}"]`
    ) as HTMLElement;
    if (!fromElement) return;

    const fromRect = fromElement.getBoundingClientRect();
    const workspaceRect = this.workspace.getBoundingClientRect();

    this.ctx.save();
    this.ctx.scale(this.viewTransform.scale, this.viewTransform.scale);
    this.ctx.translate(
      this.viewTransform.translateX / this.viewTransform.scale,
      this.viewTransform.translateY / this.viewTransform.scale
    );

    const fromX =
      (fromRect.right - workspaceRect.left - this.viewTransform.translateX) /
      this.viewTransform.scale;
    const fromY =
      (fromRect.top +
        fromRect.height / 2 -
        workspaceRect.top -
        this.viewTransform.translateY) /
      this.viewTransform.scale;
    const toX =
      (event.clientX - workspaceRect.left - this.viewTransform.translateX) /
      this.viewTransform.scale;
    const toY =
      (event.clientY - workspaceRect.top - this.viewTransform.translateY) /
      this.viewTransform.scale;

    this.ctx.setLineDash([5, 5]);
    this.ctx.strokeStyle = '#007bff';
    this.drawConnection(fromX, fromY, toX, toY);
    this.ctx.setLineDash([]);

    this.ctx.restore();
  }

  private drawConnection(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
  ) {
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);

    // Draw curved line
    const controlPoint1X = fromX + (toX - fromX) * 0.5;
    const controlPoint1Y = fromY;
    const controlPoint2X = fromX + (toX - fromX) * 0.5;
    const controlPoint2Y = toY;

    this.ctx.bezierCurveTo(
      controlPoint1X,
      controlPoint1Y,
      controlPoint2X,
      controlPoint2Y,
      toX,
      toY
    );
    this.ctx.strokeStyle = this.ctx.strokeStyle || '#007bff';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Draw arrow
    const angle = Math.atan2(toY - controlPoint2Y, toX - controlPoint2X);
    const arrowLength = 10;

    this.ctx.beginPath();
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - arrowLength * Math.cos(angle - Math.PI / 6),
      toY - arrowLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - arrowLength * Math.cos(angle + Math.PI / 6),
      toY - arrowLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();
  }

  private updateJSON() {
    const data: PlatformData = {
      elements: this.elements,
      connections: this.connections.map((conn) => ({
        id: conn.id,
        from: conn.from.elementId,
        to: conn.to.elementId,
      })),
    };

    this.jsonOutput = JSON.stringify(data, null, 2);
  }

  getTransform(): string {
    return `translate(${this.viewTransform.translateX}px, ${this.viewTransform.translateY}px) scale(${this.viewTransform.scale})`;
  }
}
