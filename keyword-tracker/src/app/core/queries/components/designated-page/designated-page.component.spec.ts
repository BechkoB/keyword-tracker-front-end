import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignatedPageComponent } from './designated-page.component';

describe('DesignatedPageComponent', () => {
  let component: DesignatedPageComponent;
  let fixture: ComponentFixture<DesignatedPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignatedPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignatedPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
