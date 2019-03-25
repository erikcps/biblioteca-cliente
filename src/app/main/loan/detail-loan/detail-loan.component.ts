import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { DetailLoanService } from './detail-loan.service';


@Component({
  selector: 'app-detail-loan',
  templateUrl: './detail-loan.component.html',
  styleUrls: ['./detail-loan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class DetailLoanComponent implements OnInit {
  loan: any;
  pageType: string;
  loanForm: FormGroup;

  //table of payments
  displayedColumns = ['date', 'interest', 'custody', 'total', 'paid'];

  //table of payments
  displayedColumnsAmortizations = ['date', 'amount'];

   // Private
   private _unsubscribeAll: Subject<any>;

  constructor(private detailLoanService: DetailLoanService,
              private _formBuilder: FormBuilder,
              private _location: Location,
              private _matSnackBar: MatSnackBar) { 
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.detailLoanService.onProductChanged
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(loan => {
            if (loan) {
                this.loan = loan;
                console.log(this.loan);
            }
            this.loanForm = this.createLoanForm();
        });
  }
  
  getTotal() {
    return this.loan.payments.map(t => (t.interest + t.custody)).reduce((acc, value) => acc + value, 0);
  }

  getTotalCustody() {
    return this.loan.payments.map(t => t.custody).reduce((acc, value) => acc + value, 0);
  }

  getTotalInterest() {
    return this.loan.payments.map(t => t.interest).reduce((acc, value) => acc + value, 0);
  }

  createLoanForm(): FormGroup
    {
      return this._formBuilder.group({
        title          : [this.loan.title],
        author          : [this.loan.author],
        year          : [this.loan.year],
        edited          : [this.loan.edited],
        pages          : [this.loan.pages],
        language          : [this.loan.language],
        fromDate          : [this.loan.fromDate],
        content          : [this.loan.content],
        copies          : [this.loan.phisicalBook.numberOfCopies],
        download          : [this.loan.digitalBook.pathBook],
      });
    }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
  }
}
