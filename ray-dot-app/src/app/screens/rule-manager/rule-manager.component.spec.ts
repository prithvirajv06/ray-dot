import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleManagerComponent } from './rule-manager.component';

describe('RuleManagerComponent', () => {
  let component: RuleManagerComponent;
  let fixture: ComponentFixture<RuleManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
