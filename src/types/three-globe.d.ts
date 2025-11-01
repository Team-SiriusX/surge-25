declare module "three-globe" {
  import { Object3D } from "three";

  export default class ThreeGlobe extends Object3D {
    constructor(options?: any);
    globeMaterial(): any;
    hexPolygonsData(data: any): this;
    hexPolygonResolution(resolution: number): this;
    hexPolygonMargin(margin: number): this;
    hexPolygonColor(accessor: any): this;
    showAtmosphere(show: boolean): this;
    atmosphereColor(color: string): this;
    atmosphereAltitude(altitude: number): this;
    arcsData(data: any[]): this;
    arcStartLat(accessor: any): this;
    arcStartLng(accessor: any): this;
    arcEndLat(accessor: any): this;
    arcEndLng(accessor: any): this;
    arcColor(accessor: any): this;
    arcAltitude(accessor: any): this;
    arcStroke(accessor: any): this;
    arcDashLength(length: number): this;
    arcDashInitialGap(accessor: any): this;
    arcDashGap(gap: number): this;
    arcDashAnimateTime(accessor: any): this;
    pointsData(data: any[]): this;
    pointColor(accessor: any): this;
    pointsMerge(merge: boolean): this;
    pointAltitude(altitude: number): this;
    pointRadius(radius: number): this;
    ringsData(data: any[]): this;
    ringColor(accessor: any): this;
    ringMaxRadius(radius: number): this;
    ringPropagationSpeed(speed: number): this;
    ringRepeatPeriod(period: number): this;
  }
}
