import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromRoot from '../state';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  personalGroupIsValid$ = this.store.select(
    fromRoot.selectPersonalGroupIsValid
  );
  addressGroupIsValid$ = this.store.select(fromRoot.selectAddressGroupIsValid);

  constructor(private store: Store<fromRoot.State>) {}
}
