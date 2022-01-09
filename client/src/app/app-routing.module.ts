import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoLandingComponent } from './components/video-landing/video-landing.component';
import { VideoListingComponent } from './components/video-listing/video-listing.component';

const routes: Routes = [
  {
    path: 'list',
    component: VideoListingComponent
  },
  {
    path: 'video/:id',
    component: VideoLandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
