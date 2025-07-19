import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RulePlaygroundComponent } from './rule-playground/rule-playground.component';
import { Navigation as FoxNavigation } from './interface/navigation';
import { NgClass } from '@angular/common';
import { navigation as mockNavigation } from './mock/navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgClass, RulePlaygroundComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ray-dot';
  navigationItems!: FoxNavigation[];

  constructor() {
    this.mockContents();
  }

  mockContents() {
    this.navigationItems = mockNavigation;
  }
}
