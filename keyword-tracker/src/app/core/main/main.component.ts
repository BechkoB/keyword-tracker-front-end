import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
interface Checks {
  name: string;
  completed: boolean;
  color: string;
  checkboxes: { id: number; checked: boolean | null }[];
}

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // setTable() {
  //   this.sharedService.data
  //     .pipe(takeUntil(this._destroy$))
  //     .subscribe((res: any) => {
  //       if (res.data === undefined) {
  //         return;
  //       }
  //       this.length = res.length;
  //       if (this.type === 'pages' && res.data) {
  //         res.data = this.calculate(res.data);
  //         this.dataSource = new MatTableDataSource(res.data);
  //         this.store.dispatch(hideLoading());
  //         return;
  //       }
  //       this.dataSource = new MatTableDataSource(res.data);
  //       this.dataSource.sort = this.sort;
  //       if (res.result) {
  //         this.totalImpressions = res.result.totalImpressions;
  //         this.totalClicks = res.result.totalClicks;
  //         this.avgPosition = res.result.avgPosition;
  //         this.avgCtr = res.result.avgCtr;
  //       }
  //       this.store.dispatch(hideLoading());
  //     });
  // }

  // isAllRelevantSelected() {
  //   const numSelected = this.relevantSelect.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // check(event: MatCheckboxChange, row: IQuery, type: string) {
  //   if (type === 'relevant') {
  //     if (event.checked) {
  //       row.relevant = true;
  //     } else {
  //       row.relevant = null;
  //     }
  //     this.updateRelevant(row);
  //     this.relevantSelect.toggle(row);
  //     if (this.irrelevantSelect.isSelected(row)) {
  //       this.irrelevantSelect.deselect(row);
  //     }
  //   } else {
  //     if (event.checked) {
  //       row.relevant = false;
  //     } else {
  //       row.relevant = null;
  //     }
  //     this.updateRelevant(row);
  //     this.irrelevantSelect.toggle(row);
  //     if (this.relevantSelect.isSelected(row)) {
  //       this.relevantSelect.deselect(row);
  //     }
  //   }
  //   this.table.renderRows();
  // }

  // updateRelevant(query: IQuery) {
  //   return this.queryService
  //     .edit(query, query.id)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: () => {
  //         this.alert.success('Edited successfully');
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.alert.error('Error while editing...Please try again later');
  //       }
  //     });
  // }

  // isAllIrrelevantSelected() {
  //   const numSelected = this.irrelevantSelect.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  // selectAllRelevant(event: MatCheckboxChange) {
  //   this.irrelevantSelect.clear();
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   this.isAllRelevantSelected()
  //     ? this.relevantSelect.clear()
  //     : this.dataSource.data.forEach((row: IQuery) => {
  //         row.relevant = true;
  //         this.relevantSelect.select(row);
  //       });
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   event.checked
  //     ? this.bulkEdit(this.dataSource.data, true)
  //     : this.bulkEdit(this.dataSource.data, null);
  // }

  // selectAllIrelevand(event: MatCheckboxChange) {
  //   this.relevantSelect.clear();
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   this.isAllIrrelevantSelected()
  //     ? this.irrelevantSelect.clear()
  //     : this.dataSource.data.forEach((row: IQuery) => {
  //         row.relevant = false;
  //         this.irrelevantSelect.select(row);
  //       });
  //   // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  //   event.checked
  //     ? this.bulkEdit(this.dataSource.data, false)
  //     : this.bulkEdit(this.dataSource.data, null);
  // }

  // bulkEdit(data: IQuery[], type: boolean | null) {
  //   this.queryService
  //     .bulkEdit(data, type)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: () => {
  //         this.alert.success('Edited successfully');
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         this.alert.error('Error while editing...Please try again later');
  //       }
  //     });
  // }
}
