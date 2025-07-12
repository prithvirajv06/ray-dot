import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecissionBuilderComponent } from './decission-builder.component';

describe('DecissionBuilderComponent', () => {
  let component: DecissionBuilderComponent;
  let fixture: ComponentFixture<DecissionBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecissionBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DecissionBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
