
import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from './services/task.service';
import { Task } from './models/task';
import { TaskFormComponent } from './components/task-form/task-form.component';

type TaskFilter = 'all' | 'active' | 'completed';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  // TASK SERVICE
  private taskService = inject(TaskService);

  tasks = this.taskService.tasks;

  totalTasks = this.taskService.totalTasks;
  activeTasks = this.taskService.activeTasks;
  completedTasks = this.taskService.completedTasks;

  // FILTER
  currentFilter = signal<TaskFilter>('all');

  filteredTasks = computed(() => {
    const allTasks = this.tasks();
    const filter = this.currentFilter();

    if (filter === 'active') {
      return allTasks.filter(task => !task.completed);
    }

    if (filter === 'completed') {
      return allTasks.filter(task => task.completed);
    }

    return allTasks;
  });

  // FORM
  isFormOpen = signal(false);
  editingTask = signal<Task | null>(null);

  // MEMBUKA FORM TAMBAH
  openAddForm(): void {
    this.editingTask.set(null);
    this.isFormOpen.set(true);
  }

  // MEMBUKA FORM EDIT
  openEditForm(task: Task): void {
    this.editingTask.set(task);
    this.isFormOpen.set(true);
  }

  // MENYIMPAN TUGAS
  saveTask(data: {
    title: string;
    description: string;
  }): void {

    const task = this.editingTask();

    if (task) {
      this.taskService.updateTask(
        task.id,
        data.title,
        data.description
      );
    } else {
      this.taskService.addTask(
        data.title,
        data.description
      );
    }

    this.closeForm();
  }

  // MENUTUP FORM
  closeForm(): void {
    this.isFormOpen.set(false);
    this.editingTask.set(null);
  }

  // FILTER
  setFilter(filter: TaskFilter): void {
    this.currentFilter.set(filter);
  }

  // CHECKBOX
  toggleTask(id: number): void {
    this.taskService.toggleTask(id);
  }

  // DELETE
  deleteTask(id: number): void {
    const confirmed = window.confirm(
      'Apakah kamu yakin ingin menghapus tugas ini?'
    );

    if (confirmed) {
      this.taskService.deleteTask(id);
    }
  }
}
