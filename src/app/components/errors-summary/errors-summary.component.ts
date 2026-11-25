import { Component, Input } from '@angular/core';
import { ErrorsSummary } from 'src/app/models/errors-summary.class';

@Component({
  selector: 'app-errors-summary',
  templateUrl: './errors-summary.component.html',
  styleUrls: ['./errors-summary.component.scss']
})
export class ErrorsSummaryComponent {

  @Input() errorsSummary: ErrorsSummary = new ErrorsSummary();

}
