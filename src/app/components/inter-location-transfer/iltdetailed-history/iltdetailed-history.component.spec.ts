import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ILTDetailedHistoryComponent } from './iltdetailed-history.component';

describe('ILTDetailedHistoryComponent', () => {
  let component: ILTDetailedHistoryComponent;
  let fixture: ComponentFixture<ILTDetailedHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ILTDetailedHistoryComponent]
    });
    fixture = TestBed.createComponent(ILTDetailedHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
