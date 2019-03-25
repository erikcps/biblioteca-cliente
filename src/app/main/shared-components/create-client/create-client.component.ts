import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Apollo } from "apollo-angular";
import gql from "graphql-tag";

import { Client } from 'app/models/client';
import { Profile } from 'app/models/profile';
import { AppConfig } from 'app/config/app.config';

@Component({
  selector: 'app-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss']
})
export class CreateClientComponent implements OnInit {

  client: Client;
  profile: Profile;
  selectedTypeClient: string;

  typeClients: any;
  
  constructor(public matDialogRef: MatDialogRef<CreateClientComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo) { 
    this.client = new Client();
    this.profile = new Profile();
    this.typeClients = AppConfig.TYPE_CLIENTS;
    this.selectedTypeClient = 'EMP'
  }

  ngOnInit() {

  }

  saveClient() {
    this.matDialogRef.close();
    const queryInsert = gql`
      mutation {
        createClient(
          client: {
            nameToInvoice: "${this.client.nameToInvoice}"
            typeClient: ${this.selectedTypeClient} 
            code: "${this.client.code}"
            sinNit: "${this.client.sinNit}"
          },
          profile: {
            name: "${this.profile.name}"
            lastName: "${this.profile.lastName}"
            ci: "${this.profile.ci}"
            address: "${this.profile.address}"
            telephone : "${this.profile.telephone}"
            cellphone: "${this.profile.cellphone}"
            country: "${this.profile.country}"
            city : "${this.profile.city}"
            email: "${this.profile.email}"
          }
        ) {
          id
          code
          nameToInvoice
          typeClient
          code
          sinNit
          createdAt
          active
          profile {
            name
            lastName
            ci
            address
            telephone
            cellphone
            country
            city
            email
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
