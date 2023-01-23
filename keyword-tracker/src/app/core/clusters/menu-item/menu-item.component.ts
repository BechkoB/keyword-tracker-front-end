import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatMenuPanel } from '@angular/material/menu';
import { Router } from '@angular/router';
import { IClusters } from 'src/app/interfaces/IClusters.interface';
import { IQuery } from 'src/app/interfaces/IQueries.interfaces';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit, AfterViewInit {
  @Input() items: any;
  @Input() from: string;

  @ViewChild('childMenu') public childMenu: MatMenuPanel<any>;

  constructor(public router: Router, private cd: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }
}
