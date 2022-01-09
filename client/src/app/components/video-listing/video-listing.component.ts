import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'app-video-listing',
  templateUrl: './video-listing.component.html',
  styleUrls: ['./video-listing.component.css']
})
export class VideoListingComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['position', 'name', 'size', 'status', 'creation', 'actions'];
  dataSource = [];
  unsubscribeSubject: Subject<boolean> = new Subject();

  constructor(
    private uplaodService: UploadService,
    private datePipe: DatePipe
  ) {
    this.uplaodService.getVideoListing();
  }

  ngOnInit(): void {
    this.uplaodService.videoListDataSubject.pipe(takeUntil(this.unsubscribeSubject)).subscribe(response => {
      if (response.length) {
        this.dataSource = response.map((data, index) => {
          return {
            position: index + 1,
            guid: data.Guid,
            name: data.FileName,
            size: (Number(data.Size) / 1024 / 1024).toFixed(2) + ' MB',
            status: data.Status,
            creationDate: this.datePipe.transform(new Date(data.CreatedOn), 'dd/MM/yyyy')
          }
        });
      }
    });
    this.uplaodService.getVideoStatus();
  }



  ngOnDestroy(): void {
    this.uplaodService.unsubscribeSubject.next(true);
    this.unsubscribeSubject.next(true);
  }

}
