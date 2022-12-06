import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryDetailsComponent } from './query-details.component';

describe('KeywordDetailsComponent', () => {
  let component: QueryDetailsComponent;
  let fixture: ComponentFixture<QueryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueryDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QueryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
