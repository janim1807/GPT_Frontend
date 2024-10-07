import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiGPTComponent } from './wiki-gpt.component';

describe('WikiGPTComponent', () => {
  let component: WikiGPTComponent;
  let fixture: ComponentFixture<WikiGPTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WikiGPTComponent]
    });
    fixture = TestBed.createComponent(WikiGPTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
