import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-pay-amortization-loan',
  templateUrl: './pay-amortization-loan.component.html',
  styleUrls: ['./pay-amortization-loan.component.scss']
})
export class PayAmortizationLoanComponent implements OnInit {
  detailLoan: any;
  currentCapital: any;
  capitalToAmortizate: any;

  constructor(public matDialogRef: MatDialogRef<PayAmortizationLoanComponent>,
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

  saveAmortization() {
    const queryInsert = gql`
      mutation {
        createAmortization(loanId: ${this.detailLoan.id}, 
          amortization: {
            amount: ${this.capitalToAmortizate}
        })
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        if(data && data.createAmortization) {
          this._matSnackBar.open('Amortizacion Guaradado', 'OK', {
            verticalPosition: 'top',
            duration        : 3000
          });
          this.matDialogRef.close();
        } else {
          this._matSnackBar.open('Amortizacion FALLO', 'OK', {
            verticalPosition: 'top',
            duration        : 3000
          });
          this.matDialogRef.close();
        }
        
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

  
}
