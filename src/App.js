import React, { Component } from "react";
import { HepChloropleth } from "./components/map";
import {
  GoogleSheetsContextConsumer,
  GoogleSheetsContextProvider
} from "./components/GoogleSheetsContext";
import GoogleSheetsFetcher from "./components/GoogleSheetsFetcher";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <GoogleSheetsContextProvider>
          <GoogleSheetsFetcher
            sheetURL={
              "https://docs.google.com/spreadsheets/d/1ICqV9QxH114EOWT_obc8tYzzm2h0sA2EmxPuGkSAGFk/"
            }
          />
          <GoogleSheetsContextConsumer>
            {context =>
              !context.pageMustSuspend && (
                <>
                  <h1>{context.getLabel("headline")}</h1>
                  <h2
                    dangerouslySetInnerHTML={{
                      __html: context.getLabel("subhed")
                    }}
                  />

                  <div id="locator-map" className="graphic">
                    <HepChloropleth />
                  </div>

                  <div className="footer">
                    <p>Credit: Nathan Lawrence / KBIA</p>
                    <p>
                      Data Source: Missouri Department of Health and Senior
                      Services — March 4, 2019 Report
                    </p>
                  </div>
                </>
              )
            }
          </GoogleSheetsContextConsumer>
        </GoogleSheetsContextProvider>
      </div>
    );
  }
}

export default App;
