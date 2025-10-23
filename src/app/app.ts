import { Component } from '@angular/core';
import { SidebarComponent } from './components/layout/sidebar/sidebar';
import { TaskBoardComponent } from './components/layout/task-board/task-board';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    TaskBoardComponent
  ]
})
export class AppComponent {}