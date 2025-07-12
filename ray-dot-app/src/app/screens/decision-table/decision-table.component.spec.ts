import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionTableComponent } from './decision-table.component';

describe('DecisionTableComponent', () => {
  let component: DecisionTableComponent;
  let fixture: ComponentFixture<DecisionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecisionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
