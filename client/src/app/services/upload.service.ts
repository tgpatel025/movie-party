import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  videoListData: any[] = [];
  videoListDataSubject: BehaviorSubject<any> = new BehaviorSubject([]);
  unsubscribeSubject: Subject<boolean> = new Subject();

  constructor(
    private http: HttpClient,
    private webSocketService: WebsocketService
  ) { }

  onFileUpload(event): void {
    const file = {
      chosenFile: event.target.files[0],
      totalFileSize: event.target.files[0].size,
      singleChunkSize: 512000,
      currentChunk: 1,
      alreadyLoadedChunkSize: 0
    };
    this.addOrEditVideoMetadata(file).then(guid => {
      const slice = file.chosenFile.slice(0, file.singleChunkSize);
      const reader = new FileReader();
      reader.readAsArrayBuffer(slice);
      reader.onload = (ev) => {
        this.uploadFileChunk(slice, file, guid);
      };
    });
  }

  addOrEditVideoMetadata(file) {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:3000/api/video/video-metadata/', {
        originalFileName: file.chosenFile.name,
        size: file.chosenFile.size,
      }).subscribe((response: any) => {
        resolve(response ? response.guid : null);
      });
    });
  }

  uploadFileChunk(slice, file, guid): void {
    const formData = new FormData();
    const filename = file.currentChunk.toString();
    formData.append('chunk', slice, filename);
    formData.append('totalChunks', Math.ceil(file.totalFileSize / file.singleChunkSize).toString());
    formData.append('chunkNo', file.currentChunk.toString());
    formData.append('originalFileName', file.chosenFile.name);
    formData.append('filename', filename);
    formData.append('connectionId', this.webSocketService.webSocketConnectionId);
    this.http.post(`http://localhost:3000/api/video/upload/${guid}`, formData).subscribe(response => {
      file.alreadyLoadedChunkSize += file.singleChunkSize;
      file.currentChunk++;
      if (file.currentChunk <= Math.ceil(file.totalFileSize / file.singleChunkSize)) {
        const nextSlice = file.chosenFile.slice(file.alreadyLoadedChunkSize, file.alreadyLoadedChunkSize + file.singleChunkSize);
        const reader = new FileReader();
        reader.readAsBinaryString(nextSlice);
        reader.onload = (ev) => {
          this.uploadFileChunk(nextSlice, file, guid);
        };
      } else {
        this.getVideoListing();
      }
    });
  }

  getVideoStatus() {
    this.webSocketService.videoStatusSubject.pipe(takeUntil(this.unsubscribeSubject)).subscribe(response => {
      if (this.videoListData.length) {
        const index = this.videoListData.findIndex(video => video.Guid === response.videoId);
        if (index > -1) {
          this.videoListData[index].Status = response.videoStatus;
          this.videoListDataSubject.next(this.videoListData);
        }
      }
    });
  }

  getVideoListing() {
    this.http.get('http://localhost:3000/api/video/get-video-list').subscribe((response: any) => {
      this.videoListData = response.result;
      this.videoListDataSubject.next(response.result);
    });
  }
}
