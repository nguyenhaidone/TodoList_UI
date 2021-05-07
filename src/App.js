import React from "react";
import "./App.css";
import init from "./initVar";
class App extends React.Component {
  state = {
    todos: [],
    inputValue: "",
  };

  fetchCreateTask(todoContent) {
    if (todoContent !== "") {
      fetch(init.url, {
        method: "POST",
        headers: init.setHeaders,
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
    fetch(init.url, {
      method: "GET",
      headers: init.setHeaders,
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.setState({
          todos: data,
        });
      });
  }

  fetchDeteleTask(idTaskDelete) {
    fetch(`${init.url}/${idTaskDelete}`, {
      method: "delete",
      headers: init.setHeaders,
    })
      .then((res) => {
        res.text();
      })
      .then((res) => {
        this.componentDidMount();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  fetchUpdateStatusTask(idTask, content, status) {
    const isFinished = status === true ? 1 : 0;

    fetch(`${init.url}/${idTask}`, {
      method: "PUT",
      headers: init.setHeaders,
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

  // xử lý sự kiện thay đổi của input
  handleInputOnChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  };

  componentDidMount() {
    this.fetchGetList();
  }

  render() {
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
                    this.state.todos.map((todo, i) => {
                      if (index === i) {
                        this.fetchUpdateStatusTask(
                          todo.id,
                          todo.contentTask,
                          event.target.checked
                        );
                      } else {
                        return todo;
                      }
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
