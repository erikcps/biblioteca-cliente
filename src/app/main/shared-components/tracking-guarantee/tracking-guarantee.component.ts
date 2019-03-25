import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Tracking } from 'app/models/tracking';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { LocalStorageService } from 'ngx-webstorage';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-tracking-guarantee',
  templateUrl: './tracking-guarantee.component.html',
  styleUrls: ['./tracking-guarantee.component.scss'],
  animations: fuseAnimations
})
export class TrackingGuaranteeComponent implements OnInit {
  type: string;
  tracking: Tracking;
  currentDate: Date;
  guarantees: any;

  // GUARANTEES
  dialogRefGuarantee: any;

  columnsToDisplayGuarantee = ['select', 'id', 'brand', 'model', 'description', 'typeTracking', 'guaranteeStatus' ];
  dataSourceGuarantee: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginatorGuarantee: MatPaginator;
  @ViewChild(MatSort) sortGuarantee: MatSort;
  // END GUARANTEES

  selection = new SelectionModel<any>(true, []);

  constructor(public dialogRef: MatDialogRef<TrackingGuaranteeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private apollo: Apollo,
              private storage: LocalStorageService) {
    this.type = data.type;
  }

  ngOnInit() {
    this.tracking = new Tracking();
    this.currentDate = new Date();
    this.getGuarantees();
  }

  addDate(event: MatDatepickerInputEvent<Date>) {
    const date = new Date(event.value);
    this.tracking.date = date;
  }

  getGuarantees() {
    switch (this.type) {
      case 'envio':
        this.getAllGuaranteesToSent();
        break;
      case 'solicitud':
        this.getAllGuaranteesToRequest();
        break;
      case 'devolucion':
        this.getAllGuaranteesDeliveried();
        break;
      case 'inventario':
        this.getAllGuaranteesOnInventory();
        break;
      default:
        break;
    }
  }

  save() {
    switch (this.type) {
      case 'envio':
        this.saveSent();
        break;
      case 'solicitud':
        this.saveRequest();
        break;
      case 'devolucion':
        this.saveDelivery();
        break;
      case 'inventario':
        this.saveInventory();
        break;
      default:
        break;
    }
  }

  saveRequest() {
    this.tracking.guaranteeIds = [];
    this.selection.selected.map(guarantee => {
      this.tracking.guaranteeIds.push(guarantee.id);
    })
    
    const queryInsert = gql`
    mutation {
      createGuaranteeRequest(
        guaranteesId: [${this.tracking.guaranteeIds}],
        branchOfficeId: ${this.storage.retrieve('suc')},
        request: {
          note: "${this.tracking.note}"
        },
        date: "${new Date(this.tracking.date).toISOString().slice(0,10)}"){
          id
          note
          date
          active
        }
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        console.log(data);
        this.dialogRef.close(data);
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

  saveDelivery() {
    this.tracking.guaranteeIds = [];
    this.selection.selected.map(guarantee => {
      this.tracking.guaranteeIds.push(guarantee.id);
    })
    
    const queryInsert = gql`
    mutation {
      createGuaranteeDelivery(
        guaranteesId: [${this.tracking.guaranteeIds}],
        branchOfficeId: ${this.storage.retrieve('suc')},
        delivery: {
          note: "${this.tracking.note}"
        },
        date: "${new Date(this.tracking.date).toISOString().slice(0,10)}"){
          id
          note
          date
          active
        }
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        console.log(data);
        this.dialogRef.close(data);
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

  saveInventory() {
    this.tracking.guaranteeIds = [];
    this.selection.selected.map(guarantee => {
      this.tracking.guaranteeIds.push(guarantee.id);
    })
    
    const queryInsert = gql`
    mutation {
      createGuaranteeInventory(
        guaranteesId: [${this.tracking.guaranteeIds}],
        branchOfficeId: ${this.storage.retrieve('suc')},
        inventory: {
          note: "${this.tracking.note}"
        },
        date: "${new Date(this.tracking.date).toISOString().slice(0,10)}"){
          id
          note
          date
          active
        }
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        console.log(data);
        this.dialogRef.close(data);
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

  saveSent() {
    this.tracking.guaranteeIds = [];
    this.selection.selected.map(guarantee => {
      this.tracking.guaranteeIds.push(guarantee.id);
    })
    
    const queryInsert = gql`
    mutation {
      createGuaranteeSent(
        guaranteesId: [${this.tracking.guaranteeIds}],
        branchOfficeId: ${this.storage.retrieve('suc')},
        sent: {
          note: "${this.tracking.note}"
        },
        date: "${new Date(this.tracking.date).toISOString().slice(0,10)}"){
          id
          note
          date
        }
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        this.dialogRef.close(data);
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }
  


  getAllGuaranteesToSent() {
    const queryAllLoans = gql`
      query {
          guaranteesToSent(branchOfficeId: ${this.storage.retrieve('suc')}) {
            id
            brand
            model
            description
            guaranteeStatus
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.guaranteesToSent)
      .subscribe(data => {
        this.dataSourceGuarantee = new MatTableDataSource(data);
      });
  }

  getAllGuaranteesToRequest() {
    const queryAllLoans = gql`
      query {
        guaranteesToRequest(branchOfficeId: ${this.storage.retrieve('suc')}) {
          id
          brand
          model
          description
          guaranteeStatus
          typeTracking
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.guaranteesToRequest)
      .subscribe(data => {
        this.dataSourceGuarantee = new MatTableDataSource(data);
      });
  }

  getAllGuaranteesOnInventory() {
    const queryAllLoans = gql`
      query {
        guaranteesToInventory(branchOfficeId: ${this.storage.retrieve('suc')}) {
          id
          brand
          model
          description
          guaranteeStatus
          typeTracking
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.guaranteesToDelivery)
      .subscribe(data => {
        this.dataSourceGuarantee = new MatTableDataSource(data);
      });
  }

  getAllGuaranteesDeliveried() {
    const queryAllLoans = gql`
      query {
        guaranteesToDelivery(branchOfficeId: ${this.storage.retrieve('suc')}) {
          id
          brand
          model
          description
          guaranteeStatus
          typeTracking
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.guaranteesToDelivery)
      .subscribe(data => {
        this.dataSourceGuarantee = new MatTableDataSource(data);
      });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceGuarantee.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSourceGuarantee.data.forEach(row => this.selection.select(row));
  }
}
