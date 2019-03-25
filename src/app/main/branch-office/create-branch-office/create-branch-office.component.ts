import { Component, OnInit, Inject, ViewEncapsulation  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BranchOffice } from 'app/models/branch-office';
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-create-branch-office',
  templateUrl: './create-branch-office.component.html',
  styleUrls: ['./create-branch-office.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    fuseAnimations
  ]
})
export class CreateBranchOfficeComponent implements OnInit {
  branchOffice: BranchOffice;

  constructor(public matDialogRef: MatDialogRef<CreateBranchOfficeComponent>,
              @Inject(MAT_DIALOG_DATA) private _data: any,
              private apollo: Apollo,
              private _fuseProgressBarService: FuseProgressBarService) {
    this.branchOffice = new BranchOffice();
  }

  ngOnInit() {

  }

  saveBranchOffice() {
    const queryInsert = gql`
      mutation  {
        createBranchOffice(branchOffice: {
          name: "${this.branchOffice.name}"
          address: "${this.branchOffice.address}"
          city: "${this.branchOffice.city}"
          code: "${this.branchOffice.code}"
        }) {
          id
          name
          active
          city
          code
        }
      }
    `;
    
    // Show the progress bar
    this._fuseProgressBarService.show();

    this.apollo.mutate({ mutation: queryInsert })
    .subscribe(
      ({ data }) => {
        this.matDialogRef.close(data);
        // Hide the progress bar
        this._fuseProgressBarService.hide();
      },
      error => {
        console.log("there was an error sending the query", error);
      }
    );
  }
}
