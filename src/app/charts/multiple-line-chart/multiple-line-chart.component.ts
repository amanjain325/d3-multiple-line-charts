import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';
import { UtilService } from '../../utils/common-utils';

@Component({
  selector: 'multiple-line-chart',
  templateUrl: './multiple-line-chart.component.html'
})
export class MultipleLineChartComponent {

  @Input() data: any[] = [];
  @Input() colors: string[] = [];
  @Input() uniqueChartId: string = '';
  @Input() fillAreaBetweenLines: boolean = false;


  public margin = { top: 20, right: 20, bottom: 20, left: 50 };
  public x: any;
  public y: any;
  public svg: any;
  height: any;
  width: any;
  minValue: any;
  maxValue: any;

  constructor() {
  }

  public ngAfterViewInit(): void {
    this.buildSvg();
    this.setAxes();
    this.renderChart();
  }

  private buildSvg() {
    this.svg = d3.select('#' + this.uniqueChartId)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
  }

  private setAxes() {
    this.width = 960 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.minValue = d3Array.min(this.data, (d) => {
      return d3Array.min(d.values);
    });

    this.maxValue = d3Array.max(this.data, (d) => {
      return d3Array.max(d.values);
    });
    this.x = d3Scale.scaleLinear().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.x.domain(d3Array.extent(this.data, (d) => d.label));
    this.y.domain([
      (d3Array.min(this.data, (d) => {
        return d3Array.min(d.values);
      }) - 10),
      (d3Array.max(this.data, (d) => {
        return d3Array.max(d.values);
      }) + 10)]);
    this.svg.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(d3Axis.axisBottom(this.x).tickFormat(d3Axis.format("d")));
    this.svg.append('g')
      .call(d3Axis.axisLeft(this.y));
  }

  private renderChart() {
    let numberOfLines = this.data && this.data.length && this.data[0].values && this.data[0].values.length;
    for (let i = 0; i < numberOfLines; i++) {
      this.drawIndividualLineChart(i);
    }
    if (this.fillAreaBetweenLines) {
      this.fillArea();
    }
  }

  drawIndividualLineChart(index: number) {
    let line = d3Shape.line()
      .x((d: any) => this.x(d.label))
      .y((d: any) => this.y(d.values[index]));

    this.svg.append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', line)
      .style('fill', 'none')
      .style('stroke', this.colors[index] || UtilService.getRandomColor());

    // add circles
    this.svg.append("g")
      .selectAll(".circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("r", 2)
      .attr("cx", (d: any) => this.x(d.label))
      .attr("cy", (d: any) => this.y(d.values[index]))
  }

  fillArea() {
    let line1, line2, temp: any = {};
    d3Axis.extent(this.data, (d: any) => {
      d.values.forEach((v: any) => {
        if (v == this.maxValue) {
          temp.topMostLine = d.values.indexOf(this.maxValue);
        }
        if (v == this.minValue) {
          temp.bottomMostLine = d.values.indexOf(this.minValue);
        }
      });
    });

    line1 = d3Shape
      .line()
      .x((d: any) => this.x(d.label))
      .y((d: any) => this.y(d.values[temp.topMostLine]))

    line2 = d3Shape
      .line()
      .x((d: any) => this.x(d.label))
      .y((d: any) => this.y(d.values[temp.bottomMostLine]));

    // fill area between lines
    let areaAboveTopLine = d3.area()
      .x(line1.x())
      .y0(line1.y())
      .y1(0);
    let areaBelowTopLine = d3.area()
      .x(line1.x())
      .y0(line1.y())
      .y1(this.height);

    let areaAboveBottomLine = d3.area()
      .x(line2.x())
      .y0(line2.y())
      .y1(0);
    let areaBelowBottomLine = d3.area()
      .x(line2.x())
      .y0(line2.y())
      .y1(this.height);

    let defs = this.svg.append('defs');

    defs.append('clipPath')
      .attr('id', 'clip-top-line' + this.uniqueChartId)
      .append('path')
      .datum(this.data)
      .attr('d', areaAboveTopLine);

    defs.append('clipPath')
      .attr('id', 'clip-bottom-line' + this.uniqueChartId)
      .append('path')
      .datum(this.data)
      .attr('d', areaAboveBottomLine);

    this.svg.append('path')
      .datum(this.data)
      .attr('d', areaBelowTopLine)
      .attr('clip-path', 'url(#clip-bottom-line' + this.uniqueChartId + ')')
      .style("fill", "lightgray")
      .style("opacity", "0.3")

    this.svg.append('path')
      .datum(this.data)
      .attr('d', areaBelowBottomLine)
      .attr('clip-path', 'url(#clip-top-line' + this.uniqueChartId + ')')
  }
}
