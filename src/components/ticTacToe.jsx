import React from "react";
import { Component } from "react";
export default class TicTacToe extends Component {
  constructor() {
    super();
    this.state = {
      data: this.createData(),
      count: 1,
      track: { x: [], o: [] },
      paint: [],
      playMode: 'manual',
      ps: [
        [1, 2, 3],
        [3, 6, 9],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [4, 5, 6],
        [1, 5, 9],
        [3, 5, 7],
      ],
      id: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
  }
  // create empty table
  createData() {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(
        Array(3)
          .fill(0)
          .map((t) => t)
      );
    }
    return arr;
  }
  // check if someone completes a row, column or diagonal
  checkCompletion(track) {
    const { ps } = this.state;
    let paint = [];
    for (let i = 0; i < ps.length; i++) {
      if (track.x.length >= 3) {
        paint = [];
        for (let j = 0; j < 3; j++) {
          let key = ps[i][j].toString();
          if (track.x.includes(key)) {
            if (paint.length < 3) {
              paint.push(ps[i][j]);
              if (paint.length === 3) return paint;
            }
          }
        }
      }
      if (track.o.length >= 3) {
        paint = [];
        for (let j = 0; j < 3; j++) {
          let key = ps[i][j].toString();
          if (track.o.includes(key)) {
            if (paint.length < 3) {
              paint.push(ps[i][j]);
              if (paint.length === 3) return paint;
            }
          }
        }
      }
    }
    return [];
  }
  // fill horizonal, vertical or diagonal boxes with one color
  paintBox(p) {
    const { id } = this.state;
    if (p.length >= 3) {
      p.forEach((item) => {
        document.getElementById(item).classList.add("tic_paint");
      });
      id.forEach((x) => {
        document.getElementById(x).classList.add("tic_cell_unclick");
      });
    }
  }
  // Playing manula mode
  manualMode(count, track, t) {
    if (count % 2 === 0) {
      const ele = document.createElement("div");
      const div = t.appendChild(ele);
      div.classList.add("tic_DivCell", "tic_show");
      t.classList.add("tic_cell_unclick");
      track.o.push(t.id);
    } else {
      const ele = document.createElement("div");
      const text = document.createTextNode("X");
      ele.appendChild(text);
      const div = t.appendChild(ele);
      div.classList.add("tic_DivCell", "tic_DivCell_X", "tic_show");
      t.classList.add("tic_cell_unclick");
      track.x.push(t.id);
    }
  }
  // removes already occupied boxes
  ticOccupied() {
    const { id } = this.state;
    let arr = [];
    id.forEach(item => {
      if(!document.getElementById(item).childNodes[0]) {
        arr.push(item);
      }
    });
    return arr;
  }
  // System paint box
  systemPaint(track, num) {
    const t = document.getElementById(num[0]);
    if(t) {
      const ele = document.createElement("div");
      const div = t.appendChild(ele);
      div.classList.add("tic_DivCell", "tic_show");
      t.classList.add("tic_cell_unclick");
      track.o.push(t.id);
      this.ticOccupied();
    }
  }
  // Playing system mode
  systemMode(track, t) {
    const ele = document.createElement("div");
    const text = document.createTextNode("X");
    ele.appendChild(text);
    const div = t.appendChild(ele);
    div.classList.add("tic_DivCell", "tic_DivCell_X", "tic_show");
    t.classList.add("tic_cell_unclick");
    track.x.push(t.id);
    const num = this.ticOccupied();
    this.systemPaint(track, num);
  }
  // Click box to play
  clickBox(e) {
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
    let { count } = this.state;
    const { track, playMode } = this.state;
    const t = e.target;
    if(playMode === 'manual') {
      this.manualMode(count, track, t)
    } else if(playMode === 'system') {
      this.systemMode(track, t);
    }
    
    this.setState({
      count: count < 9 ? count + 1 : 1,
      track: { ...track },
      paint: this.checkCompletion({ ...track }),
    });
    this.paintBox(this.checkCompletion({ ...track }));
  }
  // Reset game to default state
  resetGame() {
    const { id, track } = this.state;
    if (track.x.length || track.o.length) {
      id.forEach((item) => {
        const node = document.getElementById(item);
        if (node.classList.value.includes("tic_paint")) {
          node.classList.remove("tic_paint");
        }
        if (node.classList.value.includes("tic_cell_unclick")) {
          node.classList.remove("tic_cell_unclick");
        }
        if (node.childNodes[0]) {
          node.removeChild(node.childNodes[0]);
        }
      });
    }
    this.setState({
      track: { x: [], o: [] },
      count: 1,
      paint: [],
      playMode: 'manual',
    });
  }
  // Play with system mode
  setSysFlag() {
    this.setState({
      playMode: 'system'
    })
  }
  // render table 
  renderTable() {
    const { data } = this.state;
    let k = 0;
    return data.map((item) => {
      return (
        <tr key={`row_${k}`}>
          {item.map(() => {
            k++;
            return (
              <td
                className="tic_cell"
                id={k}
                key={`cell_${k}`}
                onClick={(e) => this.clickBox(e)}
              ></td>
            );
          })}
        </tr>
      );
    });
  }
  render() {
    return (
      <>
        <h1>Tic Tac Toe</h1>
        <div className="tic_div">
          <table className="tic_table">
            <tbody>{this.renderTable()}</tbody>
          </table>
        </div>
        <button
          className="rotate-button get-country tic_reset"
          onClick={() => this.resetGame()}
        >
          Reset
        </button>
        <button
          className="rotate-button get-country sys_mode"
          onClick={() => this.setSysFlag()}
        >
          System Mode
        </button>
      </>
    );
  }
}
