import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { Module } from 'app/models/module';

@Component({
  selector: 'app-create-module',
  templateUrl: './create-module.component.html',
  styleUrls: ['./create-module.component.scss']
})
export class CreateModuleComponent {

  module: Module;

  constructor(public matDialogRef: MatDialogRef<CreateModuleComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo) { 
    this.module = new Module();
  }

  saveModule() {
    this.matDialogRef.close();
    const queryInsert = gql`
      mutation {
        createModule(module: {
          code: "${this.module.code}"
          name: "${this.module.name}"
          description: "${this.module.description}"
        }) {
          id
          code
          name
          description
          createdAt
          active
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
