import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonToggle, IonTextarea, NavController, AlertController, LoadingController, IonCardContent, IonButtons, IonButton, IonBackButton, IonCardHeader, IonCard, IonCardSubtitle, IonText, IonList, IonItem, IonInput, IonLabel } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { Todo } from 'src/app/models/todos';
import { AppStateService } from 'src/app/services/app-state.service';
import { LanguageService } from 'src/app/services/language.service';
import { TodosService } from 'src/app/services/todos.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.page.html',
  styleUrls: ['./todo-detail.page.scss'],
  standalone: true,
  imports: [IonLabel, IonInput, IonCardContent, IonToggle, IonContent, IonHeader, IonTitle, IonToolbar,  IonButtons, IonButton, IonBackButton, IonCardHeader, IonCard, IonCardSubtitle, IonText, IonList, IonItem, IonTextarea, CommonModule, FormsModule, TranslateModule, NgIf]
})
export class TodoDetailPage implements OnInit {

  id: string; // Todo ID
  todo = new Todo(); // Todo object
  mode: 'create' | 'update' = 'create'; // Mode of operation: create or update

  @ViewChild("title", { static: false }) title!: IonInput; // Reference to IonTextarea component for todo description
  @ViewChild("toggle", { static: false }) toggle!: IonToggle; // Reference to IonToggle component for todo status
  @ViewChild("textarea", { static: false }) textarea!: IonTextarea; // Reference to IonTextarea component for todo description

  maxlength = 30; // Maximum length for todo description

  /**
   * Constructs the TodoDetailPage component.
   * @param todosService Service for managing todos
   * @param route Activated route for retrieving URL parameters
   * @param navCtrl Navigation controller for programmatic navigation
   * @param alertController Alert controller for displaying alerts
   * @param loadingController Loading controller for managing loading indicators
   * @param appStateService Service for managing application state
   * @param languageService Service for managing language translations
   */
  constructor(
    private todosService: TodosService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private appStateService: AppStateService,
    private languageService: LanguageService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!; // Retrieve todo ID from route parameters
  }

  /**
   * Lifecycle hook called after construction.
   */
  ngOnInit(): void {
    if (this.id == "0") return; // If creating a new todo, exit early

    this.mode = 'update';
    this.loadTodo();
  }

  /**
   * Loads todo details from the server.
   */
  async loadTodo() {
    const loading = await this.loadingController.create(); 
    await loading.present();

    try {
      this.todo = await this.todosService.readTodos(this.id).toPromise() as Todo;
    } catch (error) {
      return this.onError();
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Handles error by displaying an alert.
   */
  private onError = async () => {
    const okHandler = () => { this.close(); };

    const alert = await this.alertController.create({
      header: this.languageService.translate("LOGIN.POPUP.ERROR_HEADER"), 
      message: this.languageService.translate("LOGIN.POPUP.ERROR_MESSAGE"),
      buttons: [{ text: this.languageService.translate("OK"), handler: okHandler }],
    });

    alert.present();
  }

  /**
   * Navigates back to the previous page.
   */
  close() {
    this.navCtrl.back(); // Navigate back
  }

  /**
   * Handles click event of the footer button.
   * Updates todo details based on user input and mode of operation.
   */
  handleFooterButtonClick() {
    const description = this.textarea.value || ""; 
    const done = this.toggle?.checked;

    this.todo.description = description;
    this.todo.completed = done;

    switch (this.mode) {
      case 'create': this.createTodo(); break;
      case 'update': this.updateTodo(); break;
    }
  }

  /**
   * Creates a new todo.
   */
  private async createTodo() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.todo = {
      ...this.todo,
      title: this.title.value?.toString() ?? this.todo.title
    }
    
    try {
      await this.todosService.createTodo(this.todo.title, this.todo.description, this.todo.completed).toPromise(); 
      this.appStateService.setTodosListChanged(true); 
      this.close(); 
    } catch (error) {
      return this.onError(); 
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Updates an existing todo.
   */
  private async updateTodo() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.todo = {
      ...this.todo,
      title: this.title.value?.toString() ?? this.todo.title
    }

    try {
      await this.todosService.updateTodo(this.todo).toPromise();
      this.appStateService.setTodosListChanged(true);
      this.close();
    } catch (error) {
      return this.onError();
    } finally {
      await loading.dismiss();
    }
  }

  /**
   * Handles click event of the delete button.
   * Deletes the todo from the server.
   */
  async handleDeleteButtonClick() {
    const loading = await this.loadingController.create();
    await loading.present();

    try {
      await this.todosService.deleteTodo(this.id).toPromise();
      this.appStateService.setTodosListChanged(true);
      this.close();
    } catch (error) {
      return this.onError();
    } finally {
      await loading.dismiss();
    }
  }

}

