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
        recognized: null
    };

    render() {
        return (
            <div>
                <h1>Pattern recognition with Go</h1>

                <h3>Load an image from the filesystem</h3>
                <h3>Draw a pattern</h3>
                <h3>The recognizer will try to find all occurrences of the given pattern</h3>

                <div className={classNames.tools}>

                    <button
                        onClick={() => {
                            this.saveableCanvas.eraseAll();
                        }}
                    >
                        Erase
                    </button>

                    <button
                        onClick={() => {
                            this.saveableCanvas.undo();
                        }}
                    >
                        Undo
                    </button>

                    <button
                        onClick={() => {

                            const data = this.saveableCanvas.getSaveData();

                            fetch('http://localhost:8081/recognize', {
                                method: "POST",
                                headers: {
                                    "Content-Type": "text/plain",
                                    "Accept": "application/json",
                                },
                                mode: "cors",
                                body: JSON.stringify({"data":data})
                            }).then(resp => {
                                return resp.json();
                            }).then(result => {
                                console.log(result);
                            });
                        }}
                    >
                        Recognize
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
                    <br/>
                </div>
                <CanvasDraw
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