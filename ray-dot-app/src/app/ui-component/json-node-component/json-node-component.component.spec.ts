import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonNodeComponentComponent } from './json-node-component.component';

describe('JsonNodeComponentComponent', () => {
  let component: JsonNodeComponentComponent;
  let fixture: ComponentFixture<JsonNodeComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JsonNodeComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JsonNodeComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
