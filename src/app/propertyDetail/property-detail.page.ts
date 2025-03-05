import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PropertyService, Property } from '../services/property.service';
import Swiper from 'swiper';
import 'swiper/css';

declare const google: any;

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.page.html',
  styleUrls: ['./property-detail.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PropertyDetailPage implements OnInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  swiper!: Swiper;
  map!: any;

  property: Property | null = null;
  images: string[] = [];

  // Mapping of facility icons
  facilityIcons: { [key: string]: string } = {
    gym: 'assets/icons/dumbell.png',
    petfriendly: 'assets/icons/dog.png',
    swimmingPool: 'assets/icons/swim.png',
    wifi: 'assets/icons/wifi.png',
    parking: 'assets/icons/car-park.png',
    restaurant: 'assets/icons/cutlery.png',
    laundry: 'assets/icons/laundry.png',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.propertyService.getPropertyById(propertyId).then((property) => {
        if (property) {
          this.property = property;
          this.images = property.imageUrls;
          this.initMap();
        }
      });
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.swiper = new Swiper(this.swiperContainer.nativeElement, {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        pagination: { clickable: true },
        navigation: true,
      });
    }, 500);
  }

  initMap() {
    setTimeout(() => {
      if (!this.mapElement || !this.mapElement.nativeElement) {
        console.error('Map element not found!');
        return;
      }

      // latitude and longitude
      const lat = Number(this.property?.latitude);
      const lng = Number(this.property?.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        console.error('Invalid latitude or longitude values');
        return;
      }

      const mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      };
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      //  marker uses correct latitude and longitude
      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: this.map,
        title: this.property?.name,
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `<div style="text-align:center;"><h3>${this.property?.name}</h3><p>${this.property?.location}</p><strong>Price: ${this.property?.price}</strong></div>`,
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });
    }, 500);
  }

  goBack() {
    this.router.navigate(['/explore']);
  }

  bookNow() {
    if (!this.property) return;

    this.router.navigate(['/booking'], {
      queryParams: {
        propertyName: this.property.name,
        agentName: this.property.agent.name,
      },
    });
  }
  tooltipType: string | null = null;

  toggleTooltip(type: string) {
    this.tooltipType = this.tooltipType === type ? null : type; // Toggle visibility
  }
}
