import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClustersComponent } from './edit-clusters.component';

describe('EditClustersComponent', () => {
  let component: EditClustersComponent;
  let fixture: ComponentFixture<EditClustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditClustersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditClustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
