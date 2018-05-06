import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { ObservableArray } from 'tns-core-modules/data/observable-array';

@Component({
  selector: 'app-menu',
    moduleId: module.id,
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent extends DrawerPage implements OnInit {
  
  dishes: ObservableArray<Dish>;

  errMess: string;

  constructor(private dishService: DishService,
    private changeDetectorRef:ChangeDetectorRef,
    @Inject('BaseURL') private BaseURL) {
      super(changeDetectorRef);
    }
  
  ngOnInit() {
    this.dishService.getDishes()
    .subscribe(dishes => this.dishes = new ObservableArray(dishes),
      errmess => this.errMess = <any>errmess);
  }

}