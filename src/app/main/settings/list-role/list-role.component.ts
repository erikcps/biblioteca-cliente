import { Component, ViewChild} from '@angular/core';
import {  MatPaginator, 
          MatSort, 
          MatTableDataSource,
          MatSnackBar } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';

import { CreateRoleComponent } from '../create-role/create-role.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss'],
  animations   : fuseAnimations,
})
export class ListRoleComponent {

  dialogRef: any;
  roles: any;
  
  columnsToDisplay = ['id', 'code', 'name', 'description', 'canCreate', 'canUpdate', 'canDelete', 'canPrint', 'createdAt', 'active'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar) {
    this.getRoles();
  }

  private getRoles() {
    const queryAllRoles = gql`
      {
        roles {
          id
          name
          code
          description
          canCreate
          canDelete
          canPrint
          canUpdate
          createdAt
          active
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllRoles,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.roles)
      .subscribe(data => {
        this.roles = data;
        this.dataSource = new MatTableDataSource(this.roles);
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
    this.dialogRef = this._matDialog.open(CreateRoleComponent, {
      data      : {
          action: 'new',
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createRole) {
            this.dataSource.data.push(response.createRole);
            this.dataSource.data = this.dataSource.data.slice();

            // Show the success message
            this._matSnackBar.open('Role Guaradado', 'OK', {
              verticalPosition: 'top',
              duration        : 3000
            });
          }
        });
  }
}
