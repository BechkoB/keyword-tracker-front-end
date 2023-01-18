import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClustersComponent } from './assign-clusters.component';

describe('AssignClustersComponent', () => {
  let component: AssignClustersComponent;
  let fixture: ComponentFixture<AssignClustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignClustersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignClustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
