import { Component } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainComponent } from './components/main/main.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SidebarComponent, MainComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  selectedCategory: string | null = null;

  onCategorySelected(category: string | null) {
    this.selectedCategory = category;
  }
}
