import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TaxService } from '../../services/tax.service';
import { TaxRate } from '../../models/taxrate';

const superAnnuationMinValue = 9.5;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public taxForm: FormGroup;
  public taxRates: TaxRate[];
  public selectedTaxYear: string;
  public selectedTaxRate: any;
  public isSuperChecked: boolean;
  public showGrossWithSuper: boolean;
  public showResult: boolean;

  // input fields
  public superannuation: number;
  public income: number;

  // result
  public superAmount: number;
  public grossWithoutSuper: number;
  public grossPlusSuper: number;
  public taxedAmount: number;
  public netAmount: number;
  public netPlusSuper: number;
  public taxInfo: any;

  constructor(private fb: FormBuilder, private taxService: TaxService) {
    this.createForm();
  }

  public ngOnInit() {
    this.getTaxRates();
  }

  private createForm() {
    this.taxForm = this.fb.group({
      super: ['', Validators.compose([Validators.required, this.superAnnuationValidator])],
      income: ['', Validators.compose([Validators.required, this.incomeValidator])],
    }, { updateOn: 'blur' });
  }

  private getTaxRates() {
    this.taxService.getTaxRates().subscribe(response => {
      this.taxRates = response;
      if (this.taxRates && this.taxRates.length > 0) {
        this.selectedTaxYear = this.taxRates.slice(-1)[0].year || null;
        this.selectedTaxRate = this.taxRates.slice(-1)[0] || null;
      }
    });
  }

  private calculateTax() {
    if (!this.income && !this.superannuation) {
      return;
    }

    let income = this.income;

    const superannuation = (this.superannuation && this.superannuation > 0) ? this.superannuation : superAnnuationMinValue;
    // substract from gross then apply tax
    this.superAmount = (income * superannuation / 100);

    this.showGrossWithSuper = true;
    if (this.isSuperChecked) {
      income -= this.superAmount;
      this.showGrossWithSuper = false;
    }

    this.grossWithoutSuper = income;
    this.grossPlusSuper = income + this.superAmount;

    this.taxInfo = this.selectedTaxRate.data.find((item) => {
      if ((income >= item.min && (income <= item.max) || !item.max)) {
        return item;
      }
    });

    if (!this.taxInfo) {
      return;
    }

    this.taxedAmount = (this.taxInfo.rate === 0) ? 0 : this.taxInfo.base + (income - this.taxInfo.min + 1) * this.taxInfo.rate / 100;
    this.netAmount = income - this.taxedAmount;
    this.netPlusSuper = this.netAmount + this.superAmount;

    this.showResult = true;
  }


  // validators
  private superAnnuationValidator(control: FormControl) {
    const superann = control.value;
    if (superann) {
      if (superann < superAnnuationMinValue) {
        return {
          bellowMin: {
            message: `Superannuation must be >=${superAnnuationMinValue}%.`
          }
        };
      }
    }
    return null;
  }

  private incomeValidator(control: FormControl) {
    const income = control.value;
    if (income === 0 || income < 0) {
      return {
        bellowMin: {
          message: `Income must be greater than 0.`
        }
      };
    }
    return null;
  }

}
