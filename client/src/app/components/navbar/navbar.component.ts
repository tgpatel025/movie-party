import { Component, OnInit } from '@angular/core';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private upload: UploadService
  ) { }

  ngOnInit(): void {
  }

  onAddClick() {
    document.getElementById('movie-file').click();
  }

  onFileUpload(event) {
    this.upload.onFileUpload(event)
  }

}
