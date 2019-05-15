var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField } from '@microsoft/sp-property-pane';
import styles from './VisitorsWebPartWebPart.module.scss';
import * as strings from 'VisitorsWebPartWebPartStrings';
import { SPHttpClient } from '@microsoft/sp-http';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as jquery from "jquery";
require("jqueryui");
require('datatables');
var VisitorsWebPartWebPart = /** @class */ (function (_super) {
    __extends(VisitorsWebPartWebPart, _super);
    function VisitorsWebPartWebPart() {
        var _this = _super.call(this) || this;
        //Load jquery-ui.min.css: required for jquery UI datepicker
        SPComponentLoader.loadCss("//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.min.css");
        //Load jquery.dataTables.min.css: required for jquery datatables
        SPComponentLoader.loadCss("//cdn.datatables.net/1.10.18/css/jquery.dataTables.min.css");
        return _this;
    }
    VisitorsWebPartWebPart.prototype.render = function () {
        this.domElement.innerHTML = "\n    <div id=\"spListContainer\" /> ";
        //Load existing visitor items in datatable
        this.getExistingVisitorData();
    };
    //Get existing training data from SharePoint list
    VisitorsWebPartWebPart.prototype.getListData = function () {
        return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + "/_api/web/lists/GetByTitle('VisitorsInformation')/Items?$select=ID,Title,PhoneNumber,VisitReason,VisitorStatus,DateTime,OutDateTime", SPHttpClient.configurations.v1)
            .then(function (response) {
            if (response.ok) {
                return response.json();
            }
            else {
                alert("An error occured while fetching existing trainings. Please contact your administrator!");
                console.log(response.statusText);
            }
        });
    };
    //Get existing visitor data and bind to datatable
    VisitorsWebPartWebPart.prototype.getExistingVisitorData = function () {
        var _this = this;
        this.getListData()
            .then(function (response) {
            if (response) {
                var finalItems = [];
                response.value.forEach(function (item) {
                    var listItem = {
                        Title: item.Title,
                        PhoneNumber: item.PhoneNumber,
                        VisitReason: item.VisitReason,
                        VisitorStatus: item.VisitorStatus,
                        DateTime: item.DateTime ? item.DateTime : "",
                        OutDateTime: item.OutDateTime ? item.OutDateTime : ""
                    };
                    finalItems.push(listItem);
                    _this.existingVisitorItems = finalItems;
                });
                _this.bindVisitorsToDatatable(finalItems);
            }
        });
    };
    //Bind existing visitor data to datatable
    VisitorsWebPartWebPart.prototype.bindVisitorsToDatatable = function (items) {
        var html = "";
        if (items.length) {
            html += "<table id=\"tbVisitors\" class=\"" + styles.Vtable + "\">";
            html += "<thead><tr><th>Visitor Name</th><th>Phone Number</th></th><th>Reason For Visit</th><th>Visitor Status</th><th>Checked In Time</th><th>Checked Out Time</th></tr></thead><tbody>";
            items.forEach(function (item) {
                html += "  \n            <tr>  \n            <td>" + item.Title + "</td>  \n            <td>" + item.PhoneNumber + "</td> \n            <td>" + item.VisitReason + "</td> \n            <td>" + item.VisitorStatus + "</td>  \n            <td>" + item.DateTime + "</td>\n            <td>" + item.OutDateTime + "</td>  \n            </tr>  \n            ";
            });
            html += "</tbody></table>";
        }
        else {
            html += "<p>No existing visitors found.";
        }
        var listContainer = this.domElement.querySelector('#spListContainer');
        listContainer.innerHTML = html;
        //Bind to datatable
        var table = jquery('#tbVisitors').DataTable({
            "orderCellsTop": true,
            "fixedHeader": true,
            "pageLength": 5
        });
        // Setup - add a text input to each footer cell
        jquery('#tbVisitors thead tr').clone(true).appendTo('#tbVisitors thead');
        jquery('#tbVisitors thead tr:eq(1) th').each(function (i) {
            var title = jquery(this).text();
            jquery(this).html('<input type="text" placeholder="Search ' + title + '" />');
            jquery('input', this).on('keyup change', function () {
                if (table.column(i).search() !== this.value) {
                    table
                        .column(i)
                        .search(this.value)
                        .draw();
                }
            });
        });
    };
    Object.defineProperty(VisitorsWebPartWebPart.prototype, "dataVersion", {
        get: function () {
            return Version.parse('1.0');
        },
        enumerable: true,
        configurable: true
    });
    VisitorsWebPartWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                PropertyPaneTextField('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return VisitorsWebPartWebPart;
}(BaseClientSideWebPart));
export default VisitorsWebPartWebPart;
//# sourceMappingURL=VisitorsWebPartWebPart.js.map