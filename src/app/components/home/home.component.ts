import { Component, OnInit } from '@angular/core';

import { TaxService } from '../../services/tax.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public taxRates: any[] = [];
  public selectedTaxRate: any;

  public timeframes = [
    { value: '0', viewValue: 'Annually' },
    { value: '1', viewValue: 'Monthly' },
    { value: '2', viewValue: 'Fortnightly' },
    { value: '3', viewValue: 'Weekly' },
    { value: '4', viewValue: 'Daily' }
  ];
  public selectedTimeframe;

  public superannuation = 9;
  public salaryAmount = 0;

  constructor(private taxService: TaxService) {
    this.selectedTimeframe = this.timeframes[0];
  }

  public ngOnInit() {
    this.getTaxRates();
  }

  private getTaxRates() {
    this.taxService.getTaxRates().subscribe(response => {
      this.taxRates = response.rates;
      if (this.taxRates && this.taxRates.length > 0) {
        this.selectedTaxRate = this.taxRates.slice(-1)[0].year || null;
      }
    });
  }

}
