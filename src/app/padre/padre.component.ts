import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'padre',
  templateUrl: './padre.component.html',
  styleUrls: ['./padre.component.css']
})
export class PadreComponent {

  data: any = [];
  ngOnInit() {
    // recupero i dati dal server attraverso una fetch
    fetch('http://localhost:1337/getZips')
      .then(response => response.json())
      .then(json => this.data = json);
  }

  citta: string = '';
  localita: any = '';
  localitaServer: any[] = [];
  pop: string = '';
  stato: string = '';

  async add(){
    this.localitaServer = [];
    this.localitaServer.push(this.localita.split(';'));
    console.log(this.localitaServer);

    let obj: object = {
      city: this.citta,
      loc: this.localitaServer[0] || [1],
      pop: this.pop,
      state: this.stato
    };

    let data = await fetch('http://localhost:1337/addZip',{
      method : 'POST',
      headers:{
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: JSON.stringify(obj)
    });
    
    data = await data.json();
    console.log(data);

    this.data.push(data);
    this.close();
  }

  open(){
    let fog = document.getElementsByClassName('fog')[0];
    let modal = document.getElementsByClassName('modal')[0];

    fog.classList.remove('inactive');
    fog.classList.add('active');
    modal.classList.add('active');
  }

  close(){
    let fog = document.getElementsByClassName('fog')[0];
    let modal = document.getElementsByClassName('modal')[0];

    this.citta = '';
    this.localita = '';
    this.pop = '';
    this.stato = '';

    fog.classList.remove('active');
    modal.classList.remove('active');
    fog.classList.add('inactive');
  }
}
