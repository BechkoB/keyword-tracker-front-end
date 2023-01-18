import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { IClusters } from 'src/app/interfaces/IClusters.interface';
import { AlertService } from 'src/app/services/alert.service';
import { ClustersService } from 'src/app/services/clusters.service';
import { hideLoading, showLoading } from 'src/app/store/actions';

@Component({
  selector: 'app-assign-clusters',
  templateUrl: './assign-clusters.component.html',
  styleUrls: ['./assign-clusters.component.scss']
})
export class AssignClustersComponent implements OnInit {
  clusters: IClusters[];
  mainClusters: IClusters[] | null;
  subClusters: IClusters[] | null;
  subSubClusters: IClusters[] | null;
  params = new HttpParams()
    .set('order', '')
    .set('direction', '')
    .set('skip', 0)
    .set('take', 10);
  selectedMainCluster: any;
  clusterForm = new FormGroup({
    parent: new FormControl<number | null>(null),
    subCluster: new FormControl<number | null>(null),
    subSubCluster: new FormControl<number | null>(null)
  });

  constructor(
    private clustersService: ClustersService,
    private alert: AlertService,
    private store: Store<{ showLoading: boolean }>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(showLoading());
    this.fetchClusters();
  }

  onSelectionChange(event: MatSelectChange): void {
    if (event.value === undefined) {
      this.selectedMainCluster = undefined;
      this.subClusters = null;
      return;
    }
    this.selectedMainCluster = event.value;
    if (this.selectedMainCluster.children.length > 0) {
      this.subClusters = this.selectedMainCluster.children;
    }
  }

  onSubSelectionChange(event: MatSelectChange): void {
    const selectedSubCluster = event.value;
    if (selectedSubCluster === undefined) {
      this.subClusters = null;
      return;
    }
    if (selectedSubCluster.children.length > 0) {
      this.subSubClusters = selectedSubCluster.children;
    }
  }

  fetchClusters() {
    this.clustersService
      .fetchAll(this.params, { cluster: '' })
      .pipe(take(1))
      .subscribe({
        next: (result) => {
          this.store.dispatch(hideLoading());

          this.mainClusters = result.filter((i: any) => {
            return i.parent === null;
          });
        },
        error: (err) => {
          console.log(err);
          this.store.dispatch(hideLoading());

          this.alert.error(
            'Error while fetching clusters... Please try again later!'
          );
        }
      });
  }
}
