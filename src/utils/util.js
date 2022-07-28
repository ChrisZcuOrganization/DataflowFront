import * as d3 from "d3";

export const areaGen = d3.area().x(p => p[0]).y0(p => p[1]).y1(p => p[2]).curve(d3.curveBasis)
export const curveGen = d3.line().x(p => p[0]).y(p => p[1]).curve(d3.curveBasis)