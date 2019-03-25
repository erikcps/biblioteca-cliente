import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { CreateGuaranteeComponent } from 'app/main/shared-components/create-guarantee/create-guarantee.component';
import { fuseAnimations } from '@fuse/animations';
import { CreateGuaranteeClientComponent } from '../create-guarantee-client/create-guarantee-client.component';

@Component({
  selector: 'app-list-guarantee',
  templateUrl: './list-guarantee.component.html',
  styleUrls: ['./list-guarantee.component.scss'],
  animations: [
    fuseAnimations,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListGuaranteeComponent implements OnInit {
  dialogRef: any;
  guarantees: any;
  
  columnsToDisplay = ['id', 'code', 'brand', 'model', 'createdAt', 'guaranteeStatus'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar) {
    this.getGuarantees();
  }

  private getGuarantees() {
    const queryGuarantees = gql`
      {
        guarantees {
          id
          code
          brand
          model
          description
          baseValue
          typeGuarantee
          guaranteeStatus
          active
          createdAt
          branchOffice {
            name
            city
            address
          }
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryGuarantees,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.guarantees)
      .subscribe(data => {
        this.guarantees = data;
        this.dataSource = new MatTableDataSource(this.guarantees);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  ngOnInit() {
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
    this.dialogRef = this._matDialog.open(CreateGuaranteeClientComponent, {
      data      : {
          action: 'new',
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createGuarantee) {
            this.dataSource.data.push(response.createGuarantee);
            this.dataSource.data = this.dataSource.data.slice();

             // Show the success message
             this._matSnackBar.open('Garantia Guaradado', 'OK', {
              verticalPosition: 'top',
              duration        : 3000
            });
          }
        });
  }
}
