import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonItem, IonSkeletonText, IonFab, IonLabel, RefresherCustomEvent, AlertController, IonRefresher, IonRefresherContent, IonIcon, IonFabButton } from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { Routes } from 'src/app/helper/routes';
import { Todo } from 'src/app/models/todos';
import { AppStateService } from 'src/app/services/app-state.service';
import { LanguageService } from 'src/app/services/language.service';
import { TodosService } from 'src/app/services/todos.service';
import { addCircleOutline, checkmarkCircleOutline, radioButtonOffOutline, arrowDown } from 'ionicons/icons'
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-todos',
  templateUrl: 'todos.page.html',
  styleUrls: ['todos.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonIcon, IonRefresher, IonRefresherContent, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonLabel, IonCardContent, IonItem, IonSkeletonText, IonFab, TranslateModule ],
})
export class TodosPage implements OnInit, OnDestroy {

  todoList : WritableSignal<Todo[] | null> = signal(null)
  refreshDisabled = false;

  private unsubscribe$ = new Subject();

  constructor(
    private todosService: TodosService, // Service for managing todos
    private alertController: AlertController, // Controller for displaying alerts
    private router: Router, // Router for navigation
    private appStateService: AppStateService, // Service for managing application state
    private languageService: LanguageService // Service for managing language translations
  ) {
    addIcons({ addCircleOutline, checkmarkCircleOutline, radioButtonOffOutline, arrowDown });
  }

  ngOnInit(): void {
    this.loadTodos();
  }

  /**
   * Lifecycle hook called just before the component is entered.
   */
  ionViewWillEnter() {
    const refresh = this.appStateService.getTodosListChanged();
    if (!refresh) return;

    this.loadTodos();
    this.appStateService.setTodosListChanged(false);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('destroy');
    this.unsubscribe$.complete();
  }

  /**
   * Handles the scroll event.
   * Disables refresh if scrollTop is less than or equal to 100.
   * @param event The scroll event.
   */
  onScroll(event: CustomEvent) {
    if (event.detail.scrollTop > 100) {
      this.refreshDisabled = false;
    } else {
      this.refreshDisabled = true;
    }
  }

  /**
   * Handles the refresh event.
   * Reloads todos.
   * @param event The refresh event.
   */
  handleRefresh(event: RefresherCustomEvent) {
    this.loadTodos();
    event?.target?.complete();
  };

  /**
   * Loads todos from the server.
   */
  private loadTodos() {
    this.todoList.set(null)

    this.todosService.getTodoList().pipe(
      takeUntil(this.unsubscribe$)
    )
    .subscribe({ next: this.onLoadSuccess, error: this.onLoadError });
  }

  /**
   * Callback function for successful todo list retrieval.
   * @param todos The list of todos retrieved.
   */
  private onLoadSuccess = (todos: Todo[]) => {
    this.todoList.set(todos)
  }

  /**
   * Callback function for error during todo list retrieval.
   * Displays an error alert.
   */
  private onLoadError = async () => {
    const alert = await this.alertController.create({
      header:   this.languageService.translate("HOME.POPUP.ERROR_HEADER"),
      message:  this.languageService.translate("HOME.POPUP.ERROR_MESSAGE"),
      buttons: [this.languageService.translate("OK")],
    });

    await alert.present();
  }

  /**
   * Navigates to the detail page for creating or editing a todo.
   * @param id The ID of the todo to edit. Defaults to '0' for creating a new todo.
   */
  onCreateTodo(id: number = 0) {
    this.router.navigateByUrl(`${Routes.Tabs}${Routes.Home}${Routes.Detail}/${id}`, {});
  }

}
