import React from 'react'
import './index.css'

class Wit extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      text:"",
      intent:null,
      search_term:null,
      date:null,
      time:null,
      start:true
    };
  }
  handleTextChange(e){
    this.setState(
      {
        text:e.target.value,
      }
    );
  }
  changeOutput(e){
    e.preventDefault();
    setTimeout(() => {this.outputBox.className="outputContainer center inactive";},1000);
    if(this.state.text.length){
      fetch('https://api.bouquet44.hasura-app.io/intent', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text:this.state.text})
    }).then(response => response.json())
    .then((output) => {
         console.log(output);
         this.setState({
           intent:output['intent'],
           search_term:output['search_term'],
           date:output['date'],
           time:output['time'],
           location:output['location'],
           start:false
         });
         this.outputBox.className="outputContainer center active";
       }).catch(err => {
      console.error(err);
    });
  }
}
  showOutput() {
      var intent,date,time,search_term,classes,location;
      classes = "outputbox center";
      if(this.state.intent && !this.state.start){
        intent = <tr><td><b className="bold">Intent</b></td><td>{this.state.intent}</td></tr>
      }
      else if(!this.state.start){
        intent = <tr><td>Couldn't find one</td></tr>
        classes = "outputbox center alert";
      }
      if(this.state.search_term){
        search_term = <tr><td><b className="bold">Search term</b></td><td>{this.state.search_term}</td></tr>
      }
      if(this.state.date){
        date = <tr><td><b className="bold">Date</b></td><td>{this.state.date}</td></tr>
      }
      if(this.state.time){
        time = <tr><td><b className="bold">Time</b></td><td>{this.state.time}</td></tr>
      }
      if(this.state.location){
        location = <tr><td><b className="bold">Location</b></td><td>{this.state.location}</td></tr>
      }
      return(
        <table className={classes}>
          <tbody>
            {intent}
            {search_term}
            {location}
            {date}
            {time}
          </tbody>
        </table>
      );
  }
  showPlaceholder(){
    var text_list = [
      "Hello",
      "What's up in Mumbai at 4pm today?",
      "Tell me about Tesla",
      "How is the weather today?",
      "Tell me about the next IPL match",
      "What's trending?",
      "Bye!"];
    return text_list[Math.floor(Math.random() * Math.floor(text_list.length))];
  }
  render(){
    return(
      <div className="Wit">
        <form className="WitForm" onSubmit={this.changeOutput.bind(this)}>
          <input className="text-input center" placeholder={this.showPlaceholder()} type="text" value={this.state.text} onChange={this.handleTextChange.bind(this)}/>
          <br />
          <div className="button-container center">
            <input className="button center" type="submit" value="Get intent" />
          </div>
        </form>
        <div className="outputContainer center" ref={(output) => { this.outputBox = output; }}>
          {this.showOutput()}
        </div>
      </div>
    );
  }
}

export default Wit;
