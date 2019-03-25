import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { MatDialog } from '@angular/material';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dismiss-loan',
  templateUrl: './dismiss-loan.component.html',
  styleUrls: ['./dismiss-loan.component.scss']
})
export class DismissLoanComponent implements OnInit {
  detailLoan: any;
  note: any;

  constructor(public matDialogRef: MatDialogRef<DismissLoanComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo,
              private _matSnackBar: MatSnackBar) { 
    this.detailLoan = _data.loan;
  }

  ngOnInit() {
  }

  saveDismiss() {
    const queryInsert = gql`
      mutation {
        createDismissLoan(loanId: ${this.detailLoan.id}, 
          dismissLoan: {
            note: "${this.note}"
        })
      }
    `;

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        if(data && data.createDismissLoan) {
          this._matSnackBar.open('Baja Guardado', 'OK', {
            verticalPosition: 'top',
            duration        : 3000
          });
        } else {
          this._matSnackBar.open('Baja FALLO', 'OK', {
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
