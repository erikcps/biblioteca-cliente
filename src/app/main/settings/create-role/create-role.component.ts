import { Component, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA, 
          MatDialogRef } from '@angular/material';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { Role } from 'app/models/role';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent {

  role: Role;
  
  constructor(public matDialogRef: MatDialogRef<CreateRoleComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo) { 
    this.role = new Role();
  }

  saveRole() {
    this.matDialogRef.close();
    const queryInsert = gql`
      mutation {
        createRole(role: {
          code: "${this.role.code}"
          name: "${this.role.name}"
          description: "${this.role.description}"
          canCreate: ${this.role.canCreate}
          canUpdate: ${this.role.canUpdate}
          canPrint: ${this.role.canPrint}
          canDelete: ${this.role.canDelete}
        }) {
          id
          code
          name
          description
          canCreate
          canUpdate
          canDelete
          canPrint
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
