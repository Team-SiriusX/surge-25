declare module "three-globe" {
  import { Object3D } from "three";

  export default class ThreeGlobe extends Object3D {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options?: any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globeMaterial(): any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hexPolygonsData(data: any): this;
    hexPolygonResolution(resolution: number): this;
    hexPolygonMargin(margin: number): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hexPolygonColor(accessor: any): this;
    showAtmosphere(show: boolean): this;
    atmosphereColor(color: string): this;
    atmosphereAltitude(altitude: number): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcsData(data: any[]): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcStartLat(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcStartLng(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcEndLat(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcEndLng(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcColor(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcAltitude(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcStroke(accessor: any): this;
    arcDashLength(length: number): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcDashInitialGap(accessor: any): this;
    arcDashGap(gap: number): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arcDashAnimateTime(accessor: any): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pointsData(data: any[]): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pointColor(accessor: any): this;
    pointsMerge(merge: boolean): this;
    pointAltitude(altitude: number): this;
    pointRadius(radius: number): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ringsData(data: any[]): this;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ringColor(accessor: any): this;
    ringMaxRadius(radius: number): this;
    ringPropagationSpeed(speed: number): this;
    ringRepeatPeriod(period: number): this;
  }
}