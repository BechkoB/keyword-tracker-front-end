import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClustersComponent } from './create-clusters.component';

describe('CreateClustersComponent', () => {
  let component: CreateClustersComponent;
  let fixture: ComponentFixture<CreateClustersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateClustersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateClustersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
