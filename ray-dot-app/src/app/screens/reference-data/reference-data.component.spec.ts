import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDataComponent } from './reference-data.component';

describe('ReferenceDataComponent', () => {
  let component: ReferenceDataComponent;
  let fixture: ComponentFixture<ReferenceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
