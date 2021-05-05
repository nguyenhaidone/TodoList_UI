import React from "react";
import './App.css'

//content, todo
class App extends React.Component {
  state = {
    todos: [],
    inputValue: "",
  };

  //đầu vào callback luôn là một event
  handleOnSubmit = (event) => {
    event.preventDefault();

    const todoContent = this.state.inputValue;
    
    if(todoContent!==""){
      const newTodo = {
        content: todoContent,
        finished: false,
      };
  
      this.setState({
        todos: [...this.state.todos, newTodo],
        inputValue: "",
      });
    }
    
    // Mỗi lần setState thì hàm render chạy lại một lần
  };
  //onChange sẽ gọi hàm callback nếu xảy ra event
  //liên quan đến js thì phải viết trong dấu ngoặc nhọn

  // xử lý sự kiện thay đổi của input
  handleInputOnChange = (event) => {
    this.setState({
      inputValue: event.target.value,
    });
  }


  componentDidMount(){
    const setHeaders = {
      'Access-Control-Allow-Origin':'*',
      'Content-Type':'application/json',
    };

    const url = "https://localhost:44316/api/TodoLists";

    fetch(url,{
      method:'GET',
      headers: setHeaders,
    })
      .then((res)=>{
        return res.json();
      })
      .then((data)=>{
        console.log(data);
        this.setState({
          todos: data,
        });
      })
  }

  // xử lý sự kiện onclick của button
  render() {
    console.log(this.state.todos);
    return (
      <div>
        <form onSubmit={this.handleOnSubmit} 
              className="form-input">
          <input
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputOnChange}
            placeholder="What do you wanna do, today?"
            className="txt-input"
          />
          <input type="submit" value="+" className="btn-submit"/>
        </form>

        {this.state.todos.map((item, index) => {
          //item: phần tử của mảng, index: chỉ số của mảng.
          //Hàm map sẽ chạy một vòng for qua các phần tử của mảng, với mỗi 1 item sẽ gọi luôn hàm callback
          return (
            <div key={index} className="task">
              <div className="left-content">
                <input 
                  type='checkbox'
                  checked={item.finished}
                  className="chk-content"
                  onChange={(event)=>{
                    const newTodos = this.state.todos.map((todo,i)=>{
                      if(index === i){
                        return{
                          content: todo.content,
                          finished:  event.target.checked
                        }
                      }
                      else {
                        return todo;
                      }
                    });
                    this.setState({
                      todos:newTodos,
                    });
                  }}
                />

                {item.finished ? 
                  <strike>{item.content}</strike>
                  : <span>{item.content}</span>
                }
              </div>
              
              <button className="btn-delete" onClick={(event)=>{
                const newTodos = this.state.todos;
                newTodos.map((todo,i)=>{
                  if(index === i){
                    return newTodos.splice(i,1);
                  }
                  else {
                    return todo;
                  }
                });
                this.setState({
                  todos:newTodos,
                });
                console.log(this.state.todos.length);
              }}>x</button>
            </div>);
        })}
      </div>
    );
  }
}

export default App;
