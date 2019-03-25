import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.component.html',
  styleUrls: ['./sign-out.component.scss']
})
export class SignOutComponent implements OnInit {

  constructor(private storage: LocalStorageService,
              private router: Router) {
  }

  ngOnInit() {
    this.storage.clear();
    this.router.navigate(['/auth/sign-in']);
  }

}
