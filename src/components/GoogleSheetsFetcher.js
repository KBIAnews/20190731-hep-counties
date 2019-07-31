import React from "react";
import { GoogleSheetsContext } from "./GoogleSheetsContext";
import sheetsy from "sheetsy";
import PropTypes from "prop-types";

class GoogleSheetsFetcher extends React.Component {
  static contextType = GoogleSheetsContext;

  static propTypes = {
    sheetURL: PropTypes.string
  };

  static getIdForSheetNamed(workbookInfo, sheetName) {
    return workbookInfo.sheets.filter(el => {
      return el.name === sheetName;
    })[0].id;
  }

  componentDidMount() {
    this.requestAndGatherSheetAssets().then(result => {
      this.context.setWorkbookKey(result.workbookKey);
      this.context.setRawWorkbookData(result.rawWorkbookData);
      this.context.setRawSheetsData({
        design: result.design,
        data: result.data,
        labels: result.labels
      });
      this.context.removeSuspense();
    });
  }

  async requestAndGatherSheetAssets() {
    let result = {};
    result.workbookKey = sheetsy.urlToKey(this.props.sheetURL);
    result.rawWorkbookData = await sheetsy.getWorkbook(
      sheetsy.urlToKey(this.props.sheetURL)
    );
    result.labels = await sheetsy.getSheet(
      result.workbookKey,
      GoogleSheetsFetcher.getIdForSheetNamed(result.rawWorkbookData, "labels")
    );
    result.design = await sheetsy.getSheet(
      result.workbookKey,
      GoogleSheetsFetcher.getIdForSheetNamed(result.rawWorkbookData, "design")
    );
    result.data = await sheetsy.getSheet(
      result.workbookKey,
      GoogleSheetsFetcher.getIdForSheetNamed(result.rawWorkbookData, "data")
    );
    return result;
  }

  render() {
    return <React.Fragment />;
  }
}

export default GoogleSheetsFetcher;
