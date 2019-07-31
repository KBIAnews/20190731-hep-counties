import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import React from "react";
import { GoogleSheetsContext } from "./GoogleSheetsContext";
import { scaleLog } from "d3-scale";
import ReactTooltip from "react-tooltip";

export class HepChloropleth extends React.Component {
  constructor(props) {
    super(props);
    this.getCountyFillColor = this.getCountyFillColor.bind(this);
    this.getCountyHoverFillColor = this.getCountyHoverFillColor.bind(this);
    this.getCountyCases = this.getCountyCases.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      ReactTooltip.rebuild();
    }, 100);
  }

  static contextType = GoogleSheetsContext;

  getCountyCases(countyName) {
    let data = this.context.rawSheetsData.data.rows.map(row => ({
      countyName: row.countyname,
      cases: parseInt(row.cases)
    }));
    let relevant = data.filter(row => {
      return row.countyName.includes(countyName);
    });
    return relevant.reduce((total, row) => total + row.cases, 0);
  }

  getCountyFillColor(countyName) {
    let data = this.context.rawSheetsData.data.rows.map(row => ({
      countyName: row.countyname,
      cases: parseInt(row.cases)
    }));

    let relevant = data.filter(row => {
      return row.countyName.includes(countyName);
    });
    if (relevant.length > 0) {
      let domain = [
        data.reduce((min, p) => (p.cases < min ? p.cases : min), data[0].cases),
        data.reduce((max, p) => (p.cases > max ? p.cases : max), data[0].cases)
      ];
      let scale = scaleLog()
        .domain(domain)
        .range(["#F1C696", "#D8472B"]);
      let totalCountyCases = relevant.reduce(
        (total, row) => total + row.cases,
        0
      );
      return scale(totalCountyCases);
    }

    return "#fafafa";
  }

  getCountyHoverFillColor(countyName) {
    let data = this.context.rawSheetsData.data.rows.map(row => ({
      countyName: row.countyname,
      cases: parseInt(row.cases)
    }));

    let relevant = data.filter(row => {
      return row.countyName.includes(countyName);
    });
    if (relevant.length > 0) {
      let domain = [
        data.reduce((min, p) => (p.cases < min ? p.cases : min), data[0].cases),
        data.reduce((max, p) => (p.cases > max ? p.cases : max), data[0].cases)
      ];
      let scale = scaleLog()
        .domain(domain)
        .range(["#e4ba8f", "#bc452b"]);
      let totalCountyCases = relevant.reduce(
        (total, row) => total + row.cases,
        0
      );
      return scale(totalCountyCases);
    }

    return "#fafafa";
  }

  render() {
    console.log(this.context.getLabel("headline"));

    return (
      <>
        <ComposableMap
          // projection={"mercator"}
          projectionConfig={{
            scale: 4500,
            rotation: [10, 0, 0],
            xOffset: 2625,
            yOffset: 660
          }}
          width={740}
          height={400}
          style={{
            width: "100%",
            height: "auto",
            backgroundColor: "#fff"
          }}
        >
          <ZoomableGroup center={[0, 20]} disablePanning>
            <Geographies geography="https://s3.amazonaws.com/apps.kbia.org/js/gadm36_USA_2.json">
              {(geographies, projection) =>
                geographies.map(
                  (geography, i) =>
                    geography.id !== "ATA" && (
                      <Geography
                        key={i}
                        geography={geography}
                        projection={projection}
                        data-tip={`${
                          geography.properties.NAME_2
                        } County <br> ${this.getCountyCases(
                          geography.properties.NAME_2
                        )} Total Cases`}
                        style={{
                          default: {
                            fill: this.getCountyFillColor(
                              geography.properties.NAME_2
                            ),
                            stroke: "#ddd",
                            strokeWidth: 1,
                            outline: "none"
                          },
                          hover: {
                            fill: this.getCountyHoverFillColor(
                              geography.properties.NAME_2
                            ),
                            stroke: "#ddd",
                            strokeWidth: 1,
                            outline: "none"
                          },
                          click: {
                            fill: this.getCountyHoverFillColor(
                              geography.properties.NAME_2
                            ),
                            stroke: "#ddd",
                            strokeWidth: 1,
                            outline: "none"
                          }
                        }}
                      />
                    )
                )
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        <ReactTooltip multiline={true} type={"light"} />
        <svg
          width={"100%"}
          height={"15"}
          style={{
            backgroundColor: "#fff"
          }}
        >
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset={"0%"}
                style={{ stopColor: "#F1C696", stopOpacity: 1 }}
              />
              <stop
                offset={"100%"}
                style={{ stopColor: "#D8472B", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          <g transform={"translate(40,0)"}>
            <g transform={"translate(0,0)"}>
              <text
                fill={"#aaa"}
                x={0}
                y={9}
                fontSize={"8px"}
                fontFamily={"'Gotham SSm', Helvetica, Arial, sans-serif"}
                fontWeight={400}
              >
                {this.context.rawSheetsData.data.rows
                  .map(row => ({
                    countyName: row.countyname,
                    cases: parseInt(row.cases)
                  }))
                  .reduce((min, p) => (p.cases < min ? p.cases : min), 99999)}
              </text>
            </g>
            <g transform={"translate(80,0)"}>
              <text
                fill={"#aaa"}
                x={0}
                y={9}
                fontSize={"8px"}
                fontFamily={"'Gotham SSm', Helvetica, Arial, sans-serif"}
                fontWeight={400}
              >
                {this.context.rawSheetsData.data.rows
                  .map(row => ({
                    countyName: row.countyname,
                    cases: parseInt(row.cases)
                  }))
                  .reduce(
                    (max, p) => (p.cases > max ? p.cases : max),
                    -99999
                  )}{" "}
                cases
              </text>
            </g>

            <g transform={"translate(15,2)"}>
              <rect
                width="60"
                height="8"
                stroke={"#ccc"}
                fill={"url(#grad1)"}
              />
            </g>
          </g>
        </svg>
      </>
    );
  }
}
