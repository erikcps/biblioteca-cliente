import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Loan } from 'app/models/loan';
import { LocalStorageService } from 'ngx-webstorage';

import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { Payment } from 'app/models/payment';
import { fuseAnimations } from '@fuse/animations';

import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { DialogConfirmationComponent } from 'app/main/shared-components/dialog-confirmation/dialog-confirmation.component';

@Component({
  selector: 'app-pay-interest-loan',
  templateUrl: './pay-interest-loan.component.html',
  styleUrls: ['./pay-interest-loan.component.scss'],
  animations: fuseAnimations
})
export class PayInterestLoanComponent implements OnInit {
  detailLoan: any;
  newPayment: Payment;
  currentDate: Date;
  paymentsDebts: any;

  //table of payments
  displayedColumns = ['date', 'interest', 'custody', 'total', 'paid', 'pay'];
  dataSourcePaymentDebts: MatTableDataSource<any>;

  constructor(private _formBuilder: FormBuilder,
              private apollo: Apollo,
              private _matDialog: MatDialog,
              public matDialogRef: MatDialogRef<PayInterestLoanComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private storage: LocalStorageService,
              private _matSnackBar: MatSnackBar) {
    this.detailLoan = _data.loan;
    this.newPayment = new Payment();
    this.calculateDebt();
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.getPayments();
  }

  calculateDebt() {
    const capitalLoan = this.detailLoan.capital;
    const interestLoan = this.detailLoan.interest;
    const custodyLoan = this.detailLoan.custody;

    this.newPayment.interest = (capitalLoan * (interestLoan / 100));
    this.newPayment.custody = (capitalLoan * (custodyLoan / 100));
    this.newPayment.total = this.newPayment.interest + this.newPayment.custody;
  }
  
  daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
  }

  addDate(event: MatDatepickerInputEvent<Date>) {
    const date = new Date(event.value);
    this.newPayment.date = date;
  }

  savePayment() {
    const queryInsert = gql`
      mutation {
        createPayment(
          payment: {
            custody: ${this.newPayment.custody}
            interest: ${this.newPayment.interest}
            typePayment: INTERES
          }, loanId: ${this.detailLoan.id}, 
             datePayment: "${new Date(this.newPayment.date).toISOString().slice(0,10)}") {
          id
          custody
          interest
          typePayment
          createdAt
          datePayment
        }
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        if(data && data.createPayment) {
          this.matDialogRef.close();
          // Show the success message
          this._matSnackBar.open('Pago Guaradado', 'OK', {
            verticalPosition: 'top',
            duration        : 3000
          });
        }
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

  getDebts() {
    const queryUpdateDebts = gql`
      {
        debts(loanId: ${this.detailLoan.id}, date: "${new Date(this.newPayment.date).toISOString().slice(0,10)}")
      }
    `;
    this.apollo
    .watchQuery({
      query: queryUpdateDebts,
      fetchPolicy: "network-only"
    })
    .valueChanges.map((result: any) => result.data.debts)
    .subscribe(data => {
      if(data > 0) {
        this.getPayments();
      }
    });
  }

  getPayments() {
    const queryAllLoans = gql`
      {
        paymentsByLoanId(loanId: ${this.detailLoan.id}) {
          id
          interest
          custody
          datePayment
          isPaid
        }
      }
    `;
  
    this.apollo
      .watchQuery({
        query: queryAllLoans,
        fetchPolicy: "network-only"
      })
      .valueChanges.map((result: any) => result.data.paymentsByLoanId)
      .subscribe(data => {
        // Show the success message
        this._matSnackBar.open('Actualizado Deudas', 'OK', {
          verticalPosition: 'top',
          duration        : 3000
        });
        
        this.dataSourcePaymentDebts = new MatTableDataSource(data);
      });
  }

  getTotal() {
    return this.detailLoan.payments.map(t => (t.interest + t.custody)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCustody() {
    return this.detailLoan.payments.map(t => t.custody).reduce((acc, value) => acc + value, 0);
  }

  getTotalInterest() {
    return this.detailLoan.payments.map(t => t.interest).reduce((acc, value) => acc + value, 0);
  }

  pay(paymentId) {
    const dialogRef = this._matDialog.open(DialogConfirmationComponent, {
      width: '250px',
      data: { title: 'Esta Seguro de Realizar el Pago?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.payDebt(paymentId);
      } else {

      }
    });
  }

  payDebt(paymentId) {
    const queryInsert = gql`
    mutation {
      pay(paymentId: ${paymentId})
    }
  `;

  this.apollo.mutate({ mutation: queryInsert })
  .subscribe(
    ({ data }) => {
      if(data && data.pay) {
        this.matDialogRef.close();
        // Show the success message
        this._matSnackBar.open('Pagado Guaradado', 'OK', {
          verticalPosition: 'top',
          duration        : 3000
        });
      }
    },
    error => {
      console.log("there was an error sending the query", error);
    }
  );
  }
}
