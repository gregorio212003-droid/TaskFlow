
import { Injectable, signal, computed, effect } from '@angular/core';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  // NAMA PENYIMPANAN LOCALSTORAGE
  private storageKey = 'taskflow_tasks';

  // DATA TUGAS
  private tasksSignal = signal<Task[]>(this.loadTasks());

  // DATA YANG BISA DIAKSES KOMPONEN
  tasks = this.tasksSignal.asReadonly();

  // STATISTIK
  totalTasks = computed(() =>
    this.tasksSignal().length
  );

  activeTasks = computed(() =>
    this.tasksSignal().filter(task => !task.completed).length
  );

  completedTasks = computed(() =>
    this.tasksSignal().filter(task => task.completed).length
  );

  constructor() {

    // OTOMATIS MENYIMPAN PERUBAHAN DATA
    effect(() => {

      const currentTasks = this.tasksSignal();

      localStorage.setItem(
        this.storageKey,
        JSON.stringify(currentTasks)
      );

    });

  }

  // MEMUAT DATA DARI LOCALSTORAGE
  private loadTasks(): Task[] {

    try {

      const savedData = localStorage.getItem(this.storageKey);

      if (savedData !== null) {

        const parsedData: unknown = JSON.parse(savedData);

        if (Array.isArray(parsedData)) {

          return parsedData.map((task: Task) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          }));

        }

      }

    } catch (error) {

      console.error('Gagal memuat data tugas:', error);

    }

    // DATA AWAL JIKA BELUM ADA PENYIMPANAN
    return [
      {
        id: 1,
        title: 'Learn Angular Framework',
        description: 'Study Angular components and basic concepts.',
        completed: false,
        createdAt: new Date()
      },
      {
        id: 2,
        title: 'Build Personal Portfolio',
        description: 'Create a personal portfolio website.',
        completed: false,
        createdAt: new Date()
      },
      {
        id: 3,
        title: 'Read Programming Book',
        description: 'Read one chapter about JavaScript.',
        completed: true,
        createdAt: new Date()
      }
    ];

  }

  // MENAMBAHKAN TUGAS
  addTask(title: string, description: string): void {

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      createdAt: new Date()
    };

    this.tasksSignal.update(tasks => [
      newTask,
      ...tasks
    ]);

  }

  // MENGEDIT TUGAS
  updateTask(
    id: number,
    title: string,
    description: string
  ): void {

    this.tasksSignal.update(tasks =>
      tasks.map(task =>
        task.id === id
          ? {
              ...task,
              title: title.trim(),
              description: description.trim()
            }
          : task
      )
    );

  }

  // MENGUBAH STATUS TUGAS
  toggleTask(id: number): void {

    this.tasksSignal.update(tasks =>
      tasks.map(task =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );

  }

  // MENGHAPUS TUGAS
  deleteTask(id: number): void {

    this.tasksSignal.update(tasks =>
      tasks.filter(task => task.id !== id)
    );

  }

}
