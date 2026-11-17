
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnChanges {

  @Input() task: Task | null = null;

  @Output() save = new EventEmitter<{
    title: string;
    description: string;
  }>();

  @Output() cancel = new EventEmitter<void>();

  title = '';
  description = '';

  // MENGISI FORM SAAT EDIT
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.title = this.task?.title ?? '';
      this.description = this.task?.description ?? '';
    }
  }

  // MENYIMPAN DATA FORM
  submitForm(): void {
    const title = this.title.trim();

    if (!title) {
      return;
    }

    this.save.emit({
      title,
      description: this.description.trim()
    });
  }

  // MENUTUP FORM
  closeForm(): void {
    this.cancel.emit();
  }
}
