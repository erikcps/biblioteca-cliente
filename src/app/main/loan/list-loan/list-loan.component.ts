import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource, MatSnackBar} from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MatDialog } from '@angular/material';

import {animate, state, style, transition, trigger} from '@angular/animations';
import { CreateLoanComponent } from '../create-loan/create-loan.component';
import { fuseAnimations } from '@fuse/animations';
import { PayInterestLoanComponent } from '../pay-interest-loan/pay-interest-loan.component';
import { PayAmortizationLoanComponent } from '../pay-amortization-loan/pay-amortization-loan.component';
import { load } from '@angular/core/src/render3/instructions';
import { PayLoanComponent } from '../pay-loan/pay-loan.component';
import { DialogConfirmationComponent } from 'app/main/shared-components/dialog-confirmation/dialog-confirmation.component';
import { DismissLoanComponent } from '../dismiss-loan/dismiss-loan.component';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-list-loan',
  templateUrl: './list-loan.component.html',
  styleUrls: ['./list-loan.component.scss'],
  animations: fuseAnimations
})
export class ListLoanComponent {

  dialogRef: any;
  loans: any;
  
  displayedColumns = ['id', 'image', 'title', 'author', 'year', 'active', 'actions'];
  expandedElement: any;
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private apollo: Apollo,
              private _matDialog: MatDialog,
              private _matSnackBar: MatSnackBar,
              private storage: LocalStorageService) {
    this.getAllLoans();
  }

  private getAllLoans() {
    const branchOfficeId = this.storage.retrieve('suc');

    const queryAllLoans = gql`
    query {
      booksByBranchId(brandOfficeId: ${branchOfficeId}) {
        id
        title
        author
        year
        active
       }
    }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.booksByBranchId)
      .subscribe(data => {
        this.loans = data;
        this.dataSource = new MatTableDataSource(this.loans);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  delete(loan) {
    const queryInsert = gql`
      mutation {
        deleteBook(bookId: ${loan.id}) 
        {
          id
          title
          author
          year
          edited
          pages
          language
          content
          active
        }
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        this.getAllLoans();
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
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
    this.dialogRef = this._matDialog.open(CreateLoanComponent, {
      width: '600px',
      data      : {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          if(response && response.createBook) {
            this.dataSource.data.push(response.createBook);
            this.dataSource.data = this.dataSource.data.slice();

            // Show the success message
            this._matSnackBar.open('Libro Guaradado', 'OK', {
              verticalPosition: 'top',
              duration        : 3000
            });
          }
        });
  }

  payInterest(loan): void {
    this.dialogRef = this._matDialog.open(PayInterestLoanComponent, {
      data      : {
        loan: loan,
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          
        });
  }

  payAmortization(loan): void {
    this.dialogRef = this._matDialog.open(PayAmortizationLoanComponent, {
      data      : {
        loan: loan,
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          
        });
  }

  payLoan(loan): void {
    this.dialogRef = this._matDialog.open(PayLoanComponent, {
      data      : {
        loan: loan,
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          
        });
  }

  getDebts(loan) {
    const queryUpdateDebts = gql`
      {
        delayDebts(loanId: ${loan.id})
      }
    `;
    this.apollo
    .watchQuery({
      query: queryUpdateDebts,
      fetchPolicy: "network-only"
    })
    .valueChanges.map((result: any) => result.data.delayDebts)
    .subscribe(data => {
      if(data) {
        this._matSnackBar.open('No permitido Amortizacion Tiene Deudas Pendientes!', 'OK', {
          verticalPosition: 'top',
          duration        : 3000
        });
      } else {
        this.payAmortization(loan);
      }
    });
  }

  getDebtsToPayLoan(loan) {
    const queryUpdateDebts = gql`
      {
        delayDebts(loanId: ${loan.id})
      }
    `;
    this.apollo
    .watchQuery({
      query: queryUpdateDebts,
      fetchPolicy: "network-only"
    })
    .valueChanges.map((result: any) => result.data.delayDebts)
    .subscribe(data => {
      if(data) {
        this._matSnackBar.open('No permitido Cancelacion Tiene Deudas Pendientes!', 'OK', {
          verticalPosition: 'top',
          duration        : 3000
        });
      } else {
        this.payLoan(loan);
      }
    });
  }

  openDialogDismiss(loan) {
    const dialogRef = this._matDialog.open(DialogConfirmationComponent, {
      width: '250px',
      data: { title: 'Esta Seguro Dar de BAJA el Prestamo?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.dissmissLoan(loan);
      } else {

      }
    });
  }

  dissmissLoan(loan) {
    this.dialogRef = this._matDialog.open(DismissLoanComponent, {
      data      : {
        loan: loan,
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
        .subscribe(response => {
          
        });
  }
}
