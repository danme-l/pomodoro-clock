import React from 'react';


class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        breakLength: 5,
        sessionLength:  25,
        timerSeconds: 1500,
        currTimer: "Session",
        timerState: 'stopped',
      }
      this.increment = this.increment.bind(this);
      this.decrement = this.decrement.bind(this);
      this.toggleTimerRunning = this.toggleTimerRunning.bind(this);
      this.reset = this.reset.bind(this);
      this.formatTime = this.formatTime.bind(this);
    }
    
    // +/- buttons in the lengthCard components
    // increment and decrement both adjust the length in the state
    // and then call adjustCurrentTimer()
    increment = (whichToInc) => {
      if (whichToInc==="Break") {
        if (this.state.breakLength < 60) { // length control
          this.setState({
            breakLength: this.state.breakLength + 1,
          })        
        }   
      }
      else if (whichToInc==="Session") {
        if (this.state.sessionLength < 60) {
          this.setState({
            sessionLength: this.state.sessionLength + 1,
          })
        }     
      }
      if(this.state.timerSeconds<3600){
        this.adjustCurrTimer(whichToInc, 'inc');  
      }    
    }
    decrement = (whichToDec) => {
      if (whichToDec==="Break") {
        if (this.state.breakLength > 1) { // length control
          this.setState({
            // perform decrements
            breakLength: this.state.breakLength - 1,
          })
        }
      }
      else if (whichToDec==="Session") {
        if (this.state.sessionLength > 1) {
          this.setState({
            sessionLength: this.state.sessionLength - 1,
          })
        }     
      }
      if(this.state.timerSeconds>60){
        this.adjustCurrTimer(whichToDec, 'dec');
      }   
    }
    
    // changes the timer to reflect the changed break/session lengths
    adjustCurrTimer(whichToAdjust, adjustType) {
      // gets called whenever the inc/dec buttons are pressed
      // adds/subtracts 60 seconds from the current timer
      if (this.state.currTimer == whichToAdjust) {
        if (adjustType === 'dec') {
          this.setState({
            timerSeconds: this.state.timerSeconds - 60,
          })
        } else if (adjustType === 'inc') {
          this.setState({
            timerSeconds: this.state.timerSeconds + 60,
          })
        }      
      }
    }
    
    // changes running/stopped timer state
    // when running, uses Window setInterval() method
    toggleTimerRunning = () => {
      if (this.state.timerState === 'stopped') {
        this.setState({timerState: 'running'})
        setInterval(() => {this.countdown()}, 1000);
      }
      else if (this.state.timerState === 'running') {
        this.setState({timerState: 'stopped'})
      }
    }
    
    // setInterval in toggleTimerRunning() fires this once per second
    // calls the controller to see if the session/break is over
    countdown() {
      this.timerController()
      if (this.state.timerSeconds>0 && this.state.timerState==='running') {
        this.setState({
          timerSeconds: this.state.timerSeconds - 1,
        });
      }
    }
    
    timerController() {
      // fires whenever the timer counts down to check if the timer needs switching
      if (this.state.timerSeconds == 0) {
        this.playBeep.play();
        // flips the timer: Session <=> Break
        if (this.state.currTimer === "Session") {
          this.setState({
            currTimer: "Break",
            timerSeconds: this.state.breakLength*60 + 1,
          })
        } else if (this.state.currTimer === "Break") {
          this.setState({
            currTimer: "Session",
            timerSeconds:this.state.sessionLength*60 + 1,
          })
        }
      }
    }
    
    // resets to default, resets the beep
    reset() {
      this.setState({
        breakLength: 5,
        sessionLength: 25,
        timerSeconds: 1500,
        currTimer: "Session",
        timerState: 'stopped',
      });
      this.playBeep.pause();
      this.playBeep.currentTime = 0;
    }  
    
    // mm:ss format
    formatTime() {
      // timer is denoted in seconds, so for mm:ss format we calculate the
      // minutes remaining and the seconds remaining in each minute
      let min = Math.floor(this.state.timerSeconds / 60);
      let sec = this.state.timerSeconds - min * 60;
      // keep them double digits
      min = min < 10 ? '0'+min : min;
      sec = sec < 10 ? '0'+sec : sec;
      // nicely formatted
      return min + ':' + sec;
    }
    
    render() {
      return (
        <div id="wrapper">
          <h1>Pomodoro Clock App </h1>
          <div id="cardBox">
            <LengthCard 
              labelId="break-label"
              cardHeader="Break"
              length={this.state.breakLength}
              lengthId="break-length" 
              decId="break-decrement"
              dec = {()=>{this.decrement("Break")}}
              incId="break-increment"
              inc = {()=>{this.increment("Break")}}  />
            <LengthCard 
              labelId="session-label"
              cardHeader="Session"
              length={this.state.sessionLength}
              lengthId="session-length"
              decId="session-decrement"
              dec = {()=>{this.decrement("Session")}}
              incId="session-increment"
              inc = {()=>{this.increment("Session")}}  />
          </div>
          <Timer 
            currentTimer={this.state.currTimer}
            timerStatus={this.state.timerState}
            startStop={this.toggleTimerRunning}
            timerSecondsLeft={this.formatTime(this.state.timerSeconds)}
            reset={this.reset}
            />
          <audio
            id="beep"
            preload="auto"
            ref={(audio) => {
              this.playBeep = audio;
            }}
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          />
        </div>
      );
    };
  };
  
const LengthCard = (props) => {
    return (
      <div id="length-card" className="card">
        <span id={props.labelId}>{props.cardHeader}</span>
        <div className='card-bottom-row'>
          <button id={props.decId} onClick={props.dec}> - </button>
          <span id={props.lengthId}>{props.length}</span>
          <button id={props.incId} onClick={props.inc}> + </button>
        </div>
      </div>
    )
}

const Timer = (props) => {
    return (
      <div className="card">
        <p id="timer-label">{props.currentTimer} / {props.timerStatus}</p>
        <p id="time-left">{props.timerSecondsLeft}</p>
        <div id="buttons">
          <button id="start_stop" onClick={props.startStop}>Start/Stop</button>
          <button id="reset" onClick={props.reset}>Reset</button>
        </div>
      </div>
    )
}

export default App;