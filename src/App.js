import React from "react";
import "./App.css";

//content, todo
class App extends React.Component {
  state = {
    todos: [],
    inputValue: "",
  };

  fetchCreateTask(todoContent) {
    const url = "https://localhost:44316/api/TodoLists";
    const setHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    if (todoContent !== "") {
      fetch(url, {
        method: "POST",
        headers: setHeaders,
        body: JSON.stringify({
          id: Math.floor(Math.random() * 1000000),
          contentTask: todoContent,
          isDone: 0,
        }),
      })
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          this.setState({
            inputValue: "",
          });
          this.componentDidMount();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  fetchGetList() {
    const setHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    const url = "https://localhost:44316/api/TodoLists";

    fetch(url, {
      method: "GET",
      headers: setHeaders,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // console.log(data);
        // window.alert(data[1].id);
        this.setState({
          todos: data,
        });
      });
  }

  fetchDeteleTask(idTaskDelete) {
    const setHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    fetch(`https://localhost:44316/api/TodoLists/${idTaskDelete}`, {
      method: "delete",
      headers: setHeaders,
    })
      .then((res) => {
        res.text();
      })
      .then((res) => {
        this.componentDidMount();
      });
  }

  fetchUpdateStatusTask(idTask, content, status) {
    const setHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    const isFinished = status === true ? 1 : 0;

    fetch(`https://localhost:44316/api/TodoLists/${idTask}`, {
      method: "PUT",
      headers: setHeaders,
      body: JSON.stringify({
        id: idTask,
        contentTask: content,
        isDone: isFinished,
      }),
    })
      .then((res) => {
        res.text();
      })
      .then((data) => {
        this.componentDidMount();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //đầu vào callback luôn là một event
  handleOnSubmit = (event) => {
    event.preventDefault();

    const todoContent = this.state.inputValue;
    this.fetchCreateTask(todoContent);

    // Mỗi lần setState thì hàm render chạy lại một lần
  };
  //onChange sẽ gọi hàm callback nếu xảy ra event
  //liên quan đến js thì phải viết trong dấu ngoặc nhọn

  // xử lý sự kiện thay đổi của input
  handleInputOnChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  componentDidMount() {
    this.fetchGetList();
  }

  // xử lý sự kiện onclick của button
  render() {
    // console.log(this.state.todos);
    return (
      <div>
        <form onSubmit={this.handleOnSubmit} className="form-input">
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputOnChange}
            placeholder="What do you wanna do, today?"
            className="txt-input"
          />
          <input type="submit" value="+" className="btn-submit" />
        </form>

        {this.state.todos.map((item, index) => {
          //item: phần tử của mảng, index: chỉ số của mảng.
          //Hàm map sẽ chạy một vòng for qua các phần tử của mảng, với mỗi 1 item sẽ gọi luôn hàm callback
          return (
            <div key={index} className="task">
              <div className="left-content">
                <input
                  type="checkbox"
                  checked={item.isDone}
                  className="chk-content"
                  onChange={(event) => {
                    const newTodos = this.state.todos.map((todo, i) => {
                      if (index === i) {
                        this.fetchUpdateStatusTask(
                          todo.id,
                          todo.contentTask,
                          event.target.checked
                        );
                        return {
                          contentTask: todo.contentTask,
                          isDone: event.target.checked,
                        };
                      } else {
                        return todo;
                      }
                    });
                    this.setState({
                      todos: newTodos,
                    });
                  }}
                />

                {item.isDone ? (
                  <strike>{item.contentTask}</strike>
                ) : (
                  <span>{item.contentTask}</span>
                )}
              </div>

              <button
                className="btn-delete"
                onClick={(event) => {
                  const newTodos = this.state.todos;
                  newTodos.map((todo, i) => {
                    if (index === i) {
                      this.fetchDeteleTask(todo.id);
                    } else {
                      return todo;
                    }
                  });
                }}
              >
                x
              </button>
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
