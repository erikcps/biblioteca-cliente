import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';
import { CreateBranchOfficeComponent } from '../create-branch-office/create-branch-office.component';
import { BranchOffice } from 'app/models/branch-office';

@Component({
  selector: 'app-list-branch-office',
  templateUrl: './list-branch-office.component.html',
  styleUrls: ['./list-branch-office.component.scss'],
  animations : fuseAnimations
})
export class ListBranchOfficeComponent implements OnInit {
  dialogRef: any;
  branchOffices: any;

  displayedColumns = ['id', 'code', 'name', 'city', 'address', 'active'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar) {
    this.getBranchOffices();
  }

  ngOnInit() { }

  getBranchOffices() {
    const queryAllRoles = gql`
      {
        branchOffices {
          id
          code
          name
          city
          address
          active
        }
      }
    `;

    this.apollo
      .watchQuery({
        query: queryAllRoles,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.branchOffices)
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

  openDialog(): void
    {
        this.dialogRef = this._matDialog.open(CreateBranchOfficeComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                action: 'new',
                branchOffice: new BranchOffice()
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
              this.dataSource.data.push(response.createBranchOffice);
              this.dataSource.data = this.dataSource.data.slice();
              
              // Show the success message
              this._matSnackBar.open('Sucursal Guaradado', 'OK', {
                verticalPosition: 'top',
                duration        : 3000
              });
            });
    }
    
}





