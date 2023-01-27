import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueriesListComponent } from './queries-list.component';

describe('QueriesListComponent', () => {
  let component: QueriesListComponent;
  let fixture: ComponentFixture<QueriesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueriesListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
