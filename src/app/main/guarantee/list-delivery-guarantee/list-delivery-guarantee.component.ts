import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { fuseAnimations } from '@fuse/animations';
import { LocalStorageService } from 'ngx-webstorage';
import { CreateLoanComponent } from 'app/main/loan/create-loan/create-loan.component';
import { TrackingGuaranteeComponent } from 'app/main/shared-components/tracking-guarantee/tracking-guarantee.component';

@Component({
  selector: 'app-list-delivery-guarantee',
  templateUrl: './list-delivery-guarantee.component.html',
  styleUrls: ['./list-delivery-guarantee.component.scss'],
  animations: fuseAnimations
})
export class ListDeliveryGuaranteeComponent implements OnInit {

  dialogRef: any;
  guarantees: any;
  
  displayedColumns = ['id', 'image', 'date', 'active', 'actions'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar,
              private storage: LocalStorageService) { }

  ngOnInit() {
    this.getAllGuarantees();
  }

  private getAllGuarantees() {
    const queryAllLoans = gql`
      {
        branchOfficeById(brandOfficeId: ${this.storage.retrieve('suc')}) {
          guaranteesDelivery {
            id
            date
            active
            note
          }
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.branchOfficeById.guaranteesDelivery)
      .subscribe(data => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(): void {
    this.dialogRef = this._matDialog.open(TrackingGuaranteeComponent, {
      data      : {
        action: 'new',
        type: 'devolucion'
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createGuaranteeDelivery) {
            this.dataSource.data.push(response.createGuaranteeDelivery);
            this.dataSource.data = this.dataSource.data.slice();

            // Show the success message
            this._matSnackBar.open('Devolucion Guardado', 'OK', {
              verticalPosition: 'top',
              duration        : 3000
            });
          }
        });
  }

}
