
exports.reportCode = {
/**
* This function must be defined in report code block.
*
* Inside function you must:
* 1) Prepare data
* 2) Run method this.buildHTML(reportData); where reportData is data for mustache template
* 3) If need create PDF run method this.transformToPdf(htmlReport); where htmlReport is HTML
* 4) If is server side function must return report as string otherwise Promise or string
*
* @cfg {function} buildReport
* @params {[]|{}} reportParams
* @returns {Promise|Object} If code run on server method must return report data.
* Promise object must resolve report code
*/
  buildReport: function (reportParams) {
    var me = this,
      result = me.buildHTML(reportParams)
    if (me.reportType === 'pdf') {
      result = me.transformToPdf(result)
    }
    return result
  }
}
