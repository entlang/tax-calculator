import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { map } from 'rxjs/operators';

@Injectable()
export class TaxService {

  constructor(private http: HttpClient) { }

  getTaxRates() {
    return this.http.get('../assets/json/tax_rates.json').pipe(
      map((res: Response) => res))
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
