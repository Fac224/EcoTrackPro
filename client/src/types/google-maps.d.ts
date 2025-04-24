declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      panTo(latLng: LatLng | LatLngLiteral): void;
      panBy(x: number, y: number): void;
      fitBounds(bounds: LatLngBounds | LatLngBoundsLiteral): void;
      getBounds(): LatLngBounds;
      getCenter(): LatLng;
      getZoom(): number;
      getDiv(): Element;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
      toString(): string;
      toUrlValue(precision?: number): string;
      toJSON(): LatLngLiteral;
    }

    class LatLngBounds {
      constructor(sw?: LatLng | LatLngLiteral, ne?: LatLng | LatLngLiteral);
      contains(latLng: LatLng | LatLngLiteral): boolean;
      equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      extend(point: LatLng | LatLngLiteral): LatLngBounds;
      getCenter(): LatLng;
      getNorthEast(): LatLng;
      getSouthWest(): LatLng;
      intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
      isEmpty(): boolean;
      toJSON(): LatLngBoundsLiteral;
      toSpan(): LatLng;
      toString(): string;
      toUrlValue(precision?: number): string;
      union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    }

    class Marker {
      constructor(opts?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      setTitle(title: string): void;
      setLabel(label: string | MarkerLabel): void;
      setIcon(icon: string | Icon | Symbol): void;
      setDraggable(draggable: boolean): void;
      setVisible(visible: boolean): void;
      setZIndex(zIndex: number): void;
      getPosition(): LatLng;
      getMap(): Map;
      getTitle(): string;
      getLabel(): MarkerLabel;
      getIcon(): string | Icon | Symbol;
      getDraggable(): boolean;
      getVisible(): boolean;
      getZIndex(): number;
      addListener(eventName: string, handler: Function): MapsEventListener;
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      heading?: number;
      tilt?: number;
      streetView?: any;
      styles?: any[];
      mapTypeControl?: boolean;
      mapTypeControlOptions?: any;
      zoomControl?: boolean;
      zoomControlOptions?: any;
      panControl?: boolean;
      panControlOptions?: any;
      scaleControl?: boolean;
      scaleControlOptions?: any;
      streetViewControl?: boolean;
      streetViewControlOptions?: any;
      rotateControl?: boolean;
      rotateControlOptions?: any;
      fullscreenControl?: boolean;
      fullscreenControlOptions?: any;
      gestureHandling?: string;
      disableDoubleClickZoom?: boolean;
      disableDefaultUI?: boolean;
      clickableIcons?: boolean;
      draggable?: boolean;
      draggableCursor?: string;
      draggingCursor?: string;
      keyboardShortcuts?: boolean;
      maxZoom?: number;
      minZoom?: number;
      restriction?: any;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    interface LatLngBoundsLiteral {
      east: number;
      north: number;
      south: number;
      west: number;
    }

    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      label?: string | MarkerLabel;
      icon?: string | Icon | Symbol;
      draggable?: boolean;
      clickable?: boolean;
      visible?: boolean;
      zIndex?: number;
      animation?: Animation;
      opacity?: number;
      optimized?: boolean;
      shape?: MarkerShape;
    }

    interface MarkerLabel {
      color: string;
      fontFamily: string;
      fontSize: string;
      fontWeight: string;
      text: string;
    }

    interface Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
      labelOrigin?: Point;
    }

    interface Symbol {
      path: string | number;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }

    interface MarkerShape {
      coords: number[];
      type: string;
    }

    interface Size {
      height: number;
      width: number;
      equals(other: Size): boolean;
      toString(): string;
    }

    interface Point {
      x: number;
      y: number;
      equals(other: Point): boolean;
      toString(): string;
    }

    interface MapsEventListener {
      remove(): void;
    }

    interface MapMouseEvent {
      latLng?: LatLng;
    }

    enum Animation {
      BOUNCE,
      DROP
    }
  }
}