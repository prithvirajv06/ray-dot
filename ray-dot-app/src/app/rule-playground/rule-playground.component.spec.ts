import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulePlaygroundComponent } from './rule-playground.component';

describe('RulePlaygroundComponent', () => {
  let component: RulePlaygroundComponent;
  let fixture: ComponentFixture<RulePlaygroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulePlaygroundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RulePlaygroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
