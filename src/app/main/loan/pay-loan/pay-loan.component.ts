import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-pay-loan',
  templateUrl: './pay-loan.component.html',
  styleUrls: ['./pay-loan.component.scss']
})
export class PayLoanComponent implements OnInit {

  detailLoan: any;
  currentCapital: any;
  capitalToCancelLoan: any;

  constructor(public matDialogRef: MatDialogRef<PayLoanComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo,
              private _matSnackBar: MatSnackBar) { 
    this.detailLoan = _data.loan;
  }

  ngOnInit() {
    this.getCurrentCapital();
  }

  getCurrentCapital() {
    const queryUpdateDebts = gql`
      {
        debtCapital(loanId: ${this.detailLoan.id})
      }
    `;
    this.apollo
    .watchQuery({
      query: queryUpdateDebts,
      fetchPolicy: "network-only"
    })
    .valueChanges.map((result: any) => result.data.debtCapital)
    .subscribe(data => {
      if(data) {
        this.currentCapital = data;
      }
    });
  }

  saveCancelation() {
    const queryInsert = gql`
      mutation {
        createCancelLoan(loanId: ${this.detailLoan.id}, 
          cancelLoan: {
            amount: ${this.currentCapital}
        })
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        if(data && data.createCancelLoan) {
          this._matSnackBar.open('Cancelacion Guardado', 'OK', {
            verticalPosition: 'top',
            duration        : 3000
          });
        } else {
          this._matSnackBar.open('Cancelacion FALLO', 'OK', {
            verticalPosition: 'top',
            duration        : 3000
          });
        }
        this.matDialogRef.close();
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

}
