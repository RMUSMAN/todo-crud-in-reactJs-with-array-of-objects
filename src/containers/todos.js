import React from "react";

import Create from "../components/todos/create";
import Update from "../components/todos/update";
import TodoList from "../components/todos/TodoList";
import axios from "axios";
class Todos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      id: "",
      task: "",
      edit: false,
      add: true,
      error: false
    };
    this.addTodos = this.addTodos.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.updateHandler = this.updateHandler.bind(this);
  }
  // constructer end
  componentDidMount() {
    this.updateTodos();
  }

  updateTodos() {
    axios.get("http://localhost:3000/todos").then(response => {
      this.setState({
        todos: response.data
      });
    });
  }
  changeHandler(e) {
    this.setState({
      task: e.target.value,
      error: false
    });
  }
  editHandler(id) {
    var array = [...this.state.todos];
    var index = array.findIndex(x => x.id === id);
    this.setState({
      id: array[index].id,
      task: array[index].task,
      edit: true
    });
  }

  updateHandler() {
    if (this.state.task === "") {
      this.setState({
        error: true
      });
    } else {
      var id = this.state.id;
      var task = this.state.task;
      var obj = { id: id, task: task };
      axios.put("http://localhost:3000/todos/" + id, obj).then(response => {
        console.log(response);
        this.setState({
          id: "",
          task: "",
          edit: false
        });
        this.updateTodos();
      });
    }
  }
  addTodos() {
    if (this.state.task === "") {
      this.setState({
        error: true
      });
    } else {
      var array = [...this.state.todos];
      var task = this.state.task;
      var len = array.length;
      var obj = { id: len + 1, task: task };
      axios.post("http://localhost:3000/todos", obj).then(response => {
        this.setState({
          todos: response.data,
          task: ""
        });
        this.updateTodos();
      });
    }
  }
  deleteHandler(id) {
    axios.delete("http://localhost:3000/todos/" + id).then(response => {
      console.log(response);
      this.updateTodos();
    });
  }

  render() {
    return (
      <div className="App">
        <div className="container ">
          {this.state.todos.length > 0 ? (
            <table className="table table-sm shadow ">
              <thead class="thead-light">
                <tr>
                  <th>ID</th>
                  <th>TASK</th>
                  <th>EDIT</th>
                  <th>DELETE</th>
                </tr>
              </thead>
              <tbody>
                {this.state.todos.map((item, i) => (
                  <TodoList
                    key={item.id}
                    todos={item}
                    delete={this.deleteHandler}
                    edit={this.editHandler}
                  />
                ))}
              </tbody>
            </table>
          ) : (
            <h2 className="p-4 mt-4 text-danger shadow-lg">
              No data to display
            </h2>
          )}
        </div>
        {this.state.edit ? (
          <Update
            task={this.state.task}
            taskChange={this.changeHandler}
            update={this.updateHandler}
            error={this.state.error}
          />
        ) : (
          <Create
            task={this.state.task}
            taskChange={this.changeHandler}
            add={this.addTodos}
            error={this.state.error}
          />
        )}
      </div>
    );
  }
}

export default Todos;
