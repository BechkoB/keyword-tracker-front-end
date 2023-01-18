import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageClustersComponent } from './manage-clusters.component';

describe('ManageClustersComponent', () => {
  let component: ManageClustersComponent;
  let fixture: ComponentFixture<ManageClustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageClustersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageClustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
