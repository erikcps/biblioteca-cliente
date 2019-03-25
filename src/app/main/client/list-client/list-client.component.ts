import {Component, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { CreateClientComponent } from 'app/main/shared-components/create-client/create-client.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.scss'],
  animations: [
    fuseAnimations,
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ListClientComponent {
  dialogRef: any;
  clients: any;
  
  columnsToDisplay = ['id', 'code', 'name', 'lastName', 'ci', 'createdAt', 'active'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar) {
    this.getClients();
  }

  private getClients() {
    const queryAllClients = gql`
      {
        clients {
          id
          code
          typeClient
          nameToInvoice
          sinNit
          createdAt
          active
          profile {
            id
            name
            lastName
            ci
            address
            telephone
            cellphone
            country
            city
            address
            email
            createdAt
            active      
          }
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllClients,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.clients)
      .subscribe(data => {
        this.clients = data;
        this.dataSource = new MatTableDataSource(this.clients);
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
    this.dialogRef = this._matDialog.open(CreateClientComponent, {
      data      : {
          action: 'new',
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createClient) {
            this.dataSource.data.push(response.createClient);
            this.dataSource.data = this.dataSource.data.slice();

            // Show the success message
            this._matSnackBar.open('Cliente Guaradado', 'OK', {
              verticalPosition: 'top',
              duration        : 3000
            });
          }
        });
  }
}