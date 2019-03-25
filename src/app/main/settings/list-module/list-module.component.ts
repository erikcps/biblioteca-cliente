import { Component, ViewChild} from '@angular/core';
import {  MatPaginator, 
          MatSort, 
          MatTableDataSource,
          MatSnackBar } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';

import { CreateModuleComponent } from '../create-module/create-module.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-list-module',
  templateUrl: './list-module.component.html',
  styleUrls: ['./list-module.component.scss'],
  animations   : fuseAnimations,
})
export class ListModuleComponent {

  dialogRef: any;
  modules: any;
  
  columnsToDisplay = ['id', 'code', 'name', 'description', 'createdAt', 'active'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar) {
    this.getModules();
  }

  private getModules() {
    const queryAllModules = gql`
      {
        modules {
          id
          name
          code
          description
          createdAt
          active
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllModules,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.modules)
      .subscribe(data => {
        this.modules = data;
        this.dataSource = new MatTableDataSource(this.modules);
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
    this.dialogRef = this._matDialog.open(CreateModuleComponent, {
      data      : {
          action: 'new',
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createModule) {
            this.dataSource.data.push(response.createModule);
            this.dataSource.data = this.dataSource.data.slice();
            
            // Show the success message
            this._matSnackBar.open('Modulo Guardado', 'OK', {
              verticalPosition: 'top',
              duration        : 3000
            });
          }
        });
  }

}
