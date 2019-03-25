import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { Guarantee } from 'app/models/guarantee';
import { AppConfig } from 'app/config/app.config';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-create-guarantee',
  templateUrl: './create-guarantee.component.html',
  styleUrls: ['./create-guarantee.component.scss']
})
export class CreateGuaranteeComponent implements OnInit {

  guarantee: Guarantee;
  typeGuarantees: any;
  selectedTypeGuarantee: string;

  constructor(public matDialogRef: MatDialogRef<CreateGuaranteeComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo,
              private storage: LocalStorageService) { 
    this.guarantee = new Guarantee();
    this.typeGuarantees = AppConfig.TYPE_GUARANTEES;
    this.selectedTypeGuarantee = 'ELE';
  }

  ngOnInit() {

  }

  saveGuarantee() {
    this.matDialogRef.close();
    const queryInsert = gql`
      mutation {
        createGuarantee(
          branchOfficeId: ${this.storage.retrieve('suc')},
          clientId: ${this._data.clientId} 
          guarantee: {
            brand: "${this.guarantee.brand}"
            code: "${this.guarantee.code}"
            model: "${this.guarantee.model}"
            description: "${this.guarantee.description}"
            typeGuarantee: ${this.selectedTypeGuarantee}
            baseValue: ${this.guarantee.baseValue}
          }) {
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

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        this.matDialogRef.close(data);
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }

}
