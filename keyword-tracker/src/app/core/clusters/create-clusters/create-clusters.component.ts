import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { IClusters } from 'src/app/interfaces/IClusters.interface';

interface ICluster {
  id: number;
  name: string;
  parent_id: null | number;
  queries: any;
}

@Component({
  selector: 'app-create-clusters',
  templateUrl: './create-clusters.component.html',
  styleUrls: ['./create-clusters.component.scss']
})
export class CreateClustersComponent implements OnInit {
  mainClusters: IClusters[] | null;
  subClusters: IClusters[] | null;
  selectedMainCluster: any;
  clusterForm = new FormGroup({
    name: new FormControl<string>(''),
    parent: new FormControl<number | null>(null),
    subCluster: new FormControl<number | null>(null)
  });
  constructor(@Inject(MAT_DIALOG_DATA) private data: any) {}

  ngOnInit(): void {
    if (this.data) {
      this.mainClusters = this.data.filter((i: any) => {
        return i.parent === null;
      });
    }
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
}
