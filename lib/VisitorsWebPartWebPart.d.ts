import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IPropertyPaneConfiguration } from '@microsoft/sp-property-pane';
export interface IVisitorsWebPartWebPartProps {
    description: string;
}
export interface ISPLists {
    value: ISPList[];
}
export interface ISPList {
    Title: string;
    PhoneNumber: string;
    VisitReason: string;
    VisitorStatus: string;
    DateTime: string;
    OutDateTime: string;
}
export default class VisitorsWebPartWebPart extends BaseClientSideWebPart<IVisitorsWebPartWebPartProps> {
    existingVisitorItems: any;
    constructor();
    render(): void;
    private getListData();
    private getExistingVisitorData();
    private bindVisitorsToDatatable(items);
    protected readonly dataVersion: Version;
    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration;
}
