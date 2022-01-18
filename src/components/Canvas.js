import React, { Component } from "react";
import CanvasDraw from "react-canvas-draw";

import classNames from "./Canvas.css";

class Draw extends Component {
    state = {
        color: "black",
        width: 600,
        height: 400,
        brushRadius: 5,
        lazyRadius: 0,
        result: "",
        rowExpr: "",
        colExpr: ""
    };

    render() {
        return (
            <div>
                <h1>Pattern recognition with Go</h1>

                <h2>Draw a pattern!</h2>
                <h4>The 'Recognize' function will try to match the drawing against a set of predefined descriptors (a pattern descriptor is represented by a pair of regular expressions)</h4>
                <h4 >A pair of regular expressions is used to describe the number of continuous intervals depicted from the given drawing (one for row intervals and one for column intervals)</h4>
                <h4> You can also try to describe the pattern using your own expressions </h4>

                <div className={classNames.tools}>

                    <button
                        onClick={() => {
                            this.saveableCanvas.eraseAll();
                            this.setState({ result: "" });
                        }}
                    >
                        Erase
                    </button>

                    <button
                        onClick={() => {
                            this.saveableCanvas.undo();
                            this.setState({ result: "" });
                        }}
                    >
                        Undo
                    </button>

                    <button
                        onClick={() => {

                            const data = this.saveableCanvas.getSaveData();

                            console.log(data);

                            fetch('http://localhost:8081/recognize', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain",
                                    "Accept": "application/json",
                                },
                                mode: "cors",
                                body: data
                            }).then(resp => {
                                return resp.json();
                            }).then(result => {
                                console.log("Matches: ");
                                const matches = [];
                                result.Matches.forEach(m => matches.push(String.fromCharCode(m)));
                                console.log(matches);
                                this.setState({ result: matches.join(" ") })
                            });
                        }}
                    >
                        Recognize
                    </button>

                    <button
                        onClick={() => {

                            const rowExpr = this.state.rowExpr;
                            const colExpr = this.state.colExpr;
                            const data = this.saveableCanvas.getSaveData();

                            const bodyData = { rowExpr, colExpr, data }

                            console.log(bodyData);

                            fetch('http://localhost:8081/matchExpr', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain",
                                    "Accept": "application/json",
                                },
                                mode: "cors",
                                body: JSON.stringify(bodyData)
                            }).then(resp => {
                                return resp.json();
                            }).then(result => {
                                console.log(result);
                                this.setState({ result: result.toString() })
                            });
                        }}
                    >
                        Match expressions
                    </button>

                    <div>
                        <br/>
                        <label>Width </label>
                        <input
                            type="number"
                            value={this.state.width}
                            onChange={e =>
                                this.setState({ width: parseInt(e.target.value, 10) })
                            }
                        />
                    </div>
                    <div>
                        <label>Height </label>
                        <input
                            type="number"
                            value={this.state.height}
                            onChange={e =>
                                this.setState({ height: parseInt(e.target.value, 10) })
                            }
                        />
                    </div>
                    <div>
                        <label>Brush-Radius </label>
                        <input
                            type="number"
                            value={this.state.brushRadius}
                            onChange={e =>
                                this.setState({ brushRadius: parseInt(e.target.value, 10) })
                            }
                        />
                    </div>

                    <div>
                        <label>Row expression </label>
                        <input
                            type="text"
                            value={this.state.rowExpr}
                            onChange={e =>
                                this.setState({ rowExpr: e.target.value.toString() })
                            }
                        />
                    </div>

                    <div>
                        <label>Col expression </label>
                        <input
                            type="text"
                            value={this.state.colExpr}
                            onChange={e =>
                                this.setState({ colExpr: e.target.value.toString() })
                            }
                        />
                    </div>

                    <div>
                        <label>Result</label>
                        <span style={{
                            color: "lightgreen",
                            background: "slategray"
                        }}>{this.state.result}</span>
                    </div>

                    <br/>
                </div>
                <CanvasDraw style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                    ref={canvasDraw => (this.saveableCanvas = canvasDraw)}
                    brushColor={this.state.color}
                    brushRadius={this.state.brushRadius}
                    lazyRadius={this.state.lazyRadius}
                    canvasWidth={this.state.width}
                    canvasHeight={this.state.height}
                />
            </div>
        );
    }
}

export default Draw;
