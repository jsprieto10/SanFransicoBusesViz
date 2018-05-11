import react from "react";
import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import * as d3 from "d3";

class DataBuses extends React.Component {
  constructor() {
    super();
    this.state = {
      data: []
    };
  }

  componentDidUpdate() {
    let nestedBuses = [];
    if (this.props.buses) {
      nestedBuses = d3
        .nest()
        .key(d => d.routeTag)
        .entries(this.props.buses.vehicle);
    }
    let maxNumBuses = 0;
    for (let route of nestedBuses) {
      if (route.values.length > maxNumBuses) maxNumBuses = route.values.length;
      route.total = 0;
      route.values[0].distance = 0;
      for (let i = 1; i < route.values.length; i++) {
        route.values[i].distance = this.getDistance(
          +route.values[i - 1].lat,
          +route.values[i - 1].lon,
          +route.values[i].lat,
          +route.values[i].lon
        );
        route.total += route.values[i].distance;
      }
    }
    nestedBuses = nestedBuses.sort(function(a, b) {
      return Math.abs(b.total - a.total);
    });
    let keys = d3.range(maxNumBuses);
    let stackedBuses = d3
      .stack()
      .keys(keys)
      .value((d, key) => {
        return key < d.values.length ? d.values[key].distance : 0;
      })(nestedBuses);
    console.log(stackedBuses);
    this.graph(stackedBuses, nestedBuses, maxNumBuses, keys);
  }

  graph(stackedBuses, nestedBuses, maxNumBuses, keys) {
    this.svg = d3.select(this.svg);
    var height = this.svg.attr("height");
    var width = this.svg.attr("width");
    this.margin = { top: 20, right: 50, bottom: 30, left: 40 };
    this.g = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

      var x = d3.scaleBand()
      .rangeRound([0, width - this.margin.left - this.margin.right])
      .paddingInner(0.05)
      .align(0.1);
  
  var y = d3.scaleLinear()
      .rangeRound([height - this.margin.top - this.margin.bottom, 0]);
  
  var z = d3.scaleSequential(d3.interpolateBlues);
  
    x.domain(nestedBuses.map(function(d) { return d.key; }));
    y.domain([0, d3.max(nestedBuses, function(d) { return d.total; })]).nice();
    z.domain([0, maxNumBuses]);

    this.g
      .append("g")
      .selectAll("g")
      .data(stackedBuses)
      .enter()
      .append("g")
      .attr("fill", function(d) {
        return z(d.key);
      })
      .attr("stroke", "white")
      .selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.data.key);
      })
      .attr("y", function(d) {
        return y(d[1]);
      })
      .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth());

      this.g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height- this.margin.top - this.margin.bottom) + ")")
      .call(d3.axisBottom(x));

      this.g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Added distance");
      
      var legend = this.g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(-50," + i * 20 + ")"; });

      legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

      legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

      return this.svg.node();

  }

  deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  getDistance(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1); // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  render() {
    return (
      <div>
        <svg width="1000" height="650" ref={svg => (this.svg = svg)} />
      </div>
    );
  }
}

export default DataBuses;
