(function(){

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить задачу';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input)
    form.append(buttonWrapper)

    return {
      form,
      input,
      button
    }
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createTodoItem(name, done = false) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок
    // в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    if (done) {
      item.classList.add(`list-group-item-success`)
    }
    item.textContent = name;
    // newItemParam.done ? item.classList.add('list-group-item-success') : item.classList.remove('list-group-item-success');

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    // вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    }
  }

  function createTodoApp(container, title = 'Список дел', storage = 'myTodos', todosArray = []) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    todosArray.forEach(el => {
      let newTodoItem = createTodoItem(el.name, el.done);

      todoList.append(newTodoItem.item);
      newTodoItem.doneButton.addEventListener('click', function() {
        newTodoItem.item.classList.toggle('list-group-item-success');
        for (let todos of todosArray) {
          if (todos.name === el.name) {
            todos.done = todos.done === false ? true : false;
          }
        }
        localStorage.setItem(storage, JSON.stringify(todosArray));
      });

      newTodoItem.deleteButton.addEventListener('click', function() {
        if(confirm('Вы уверены?')) {
          newTodoItem.item.remove();
          for (let i in todosArray) {
            if (todosArray[i].name === el.name) {
              todosArray.splice(i, 1)
            }
          }
          localStorage.setItem(storage, JSON.stringify(todosArray));
        }
      })
    });

    todoItemForm.input.addEventListener('input', function() {
      todoItemForm.button.disabled = false;
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true
      }
    })

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!todoItemForm.input.value){
        return;
      }

      let todoItem = createTodoItem(todoItemForm.input.value);

      todoItem.doneButton.addEventListener('click', function() {
        todoItem.item.classList.toggle('list-group-item-success');
        for (let todos of todosArray) {
          if (todos.name === todoItem.item.firstChild.textContent) {
            todos.done = todos.done === false ? true : false;
          }
        }
        localStorage.setItem(storage, JSON.stringify(todosArray));
      })

      todoItem.deleteButton.addEventListener('click', function() {
        if (confirm('Вы уверены?')){
          todoItem.item.remove();
          for (let i in todosArray) {
            if (todosArray[i].name === todoItem.item.firstChild.textContent) {
              todosArray.splice(i, 1)
            }
          }
          localStorage.setItem(storage, JSON.stringify(todosArray));
        }
      })

      todoList.append(todoItem.item);
      todosArray.push({name: todoItemForm.input.value, done: false});
      localStorage.setItem(storage, JSON.stringify(todosArray));

      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true
    })
  }

  window.createTodoApp = createTodoApp;

}) ();
