import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrls: ['./dialog-confirmation.component.scss']
})
export class DialogConfirmationComponent {
  content: string;

  constructor(public dialogRef: MatDialogRef<DialogConfirmationComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.content = data.title || '';
  }

  ok() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }
}
