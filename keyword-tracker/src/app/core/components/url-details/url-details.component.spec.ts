import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlDetailsComponent } from './url-details.component';

describe('UrlsComponent', () => {
  let component: UrlDetailsComponent;
  let fixture: ComponentFixture<UrlDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UrlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
