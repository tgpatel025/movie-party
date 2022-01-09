import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-landing',
  templateUrl: './video-landing.component.html',
  styleUrls: ['./video-landing.component.css']
})
export class VideoLandingComponent implements OnInit {

  videoId: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videoId = params.id;
    });
    document.addEventListener('shaka-ui-loaded', () => {
      this.loadVideo();
    });
  }

  loadVideo() {
    const video = document.querySelector('video');
    const ui = video['ui'];
    const config = {
      addBigPlayButton: true,
      controlPanelElements: ["time_and_duration", "spacer", "mute", "volume", "fullscreen", "overflow_menu"],
      seekBarColors: {
        base: 'rgba(66, 133, 244, 0.35)',
        buffered: 'rgba(66, 133, 244, 0.6)',
        played: 'rgba(66, 133, 244, 0.8)',
      },
      volumeBarColors: {
        base: 'rgba(66, 133, 244, 0.8)',
        level: 'rgb(66, 133, 244)',
      }
    };
    ui.configure(config);
    document.querySelector('.shaka-overflow-menu-button').innerHTML = 'settings';
    document.querySelector('.shaka-back-to-overflow-button .material-icons-round').innerHTML = 'arrow_back_ios_new';
    const controls = ui.getControls();
    const player = controls.getPlayer();
    (window as any).player = player;
    (window as any).ui = ui;
    player.load(`http://localhost:3000/api/video/get-file/${this.videoId}/manifest.mpd`);
  }

}
