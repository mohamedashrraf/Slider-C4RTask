import { Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Slider } from '../../models/slider';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import AOS from 'aos';
import Aos from 'aos';
import { CommonModule } from '@angular/common';
import { SliderService } from '../../services/slider.service';
import { catchError, Observable, of, tap } from 'rxjs';
@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CarouselModule, CommonModule],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',

})
export class SliderComponent implements OnInit {
  @ViewChild('carousel', { static: false }) carousel!: any;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    dotsData: true,
    autoplay: true,
    animateOut: 'fadeOut',
    animateIn: 'fadeIn',
    autoplayTimeout: 5000,
    responsive: {
      0: {
        items: 1,
        dots: true,
      },
      400: {
        items: 1,
        dots: true,
      },
      740: {
        items: 1,

      },
      940: {
        items: 1
      }
    },
    nav: false
  }

  SliderData: Slider[] = [{
    id: '1',
    location: "الأرجنتين والبرازيل",
    title: "شلالات إجوازو (Iguazu Falls) -الأرجنتين والبرازيل",
    miniTitle: "شلالات إجوازو (Iguazu Falls)",
    discription: "مجموعة مذهلة من الشلالات تمتد على الحدود بين الأرجنتين والبرازيل، محاطة بالغابات الاستوائية الكثيفة. تُعد واحدة من أعظم عجائب الطبيعة، حيث تتدفق المياه بقوة وسط ضباب ساحر.",
    image: "../../../../assets/images/Iguazu_Falls.png",
  },
  {
    id: '2',
    location: "سويسرا وإيطاليا",
    title: "جبل ماترهورن (Matterhorn) - سويسرا وإيطاليا",
    miniTitle: "جبل ماترهورن (Matterhorn)",
    discription: "أحد أشهر القمم الجبلية في العالم، يتميز بشكله الهرمي المهيب وقممه المغطاة بالثلوج. تحيط به المراعي الخضراء والبحيرات النقية، مما يجعله وجهة خيالية لعشاق الجبال.",
    image: "../../../../assets/images/Matterhorn.png",
  },
  {
    id: '3',
    location: "الأردن",
    title: "وادي القمر او وادي رم (Wadi Rum) - الأردن",
    miniTitle: "وادي القمر او وادي رم (Wadi Rum) ",
    discription: "صحراء ساحرة تعرف باسم وادي القمر، تحتوي على تشكيلات صخرية فريدة وكثبان رملية حمراء. يعتبر المكان مثاليًا لاستكشاف الطبيعة والتأمل تحت سماء مليئة بالنجوم.",
    image: "../../../../assets/images/Wadi_Rum.png",
  },
  {
    id: '4',
    location: "اسكتلندا",
    title: "جزيرة سكاي (Isle of Skye) - اسكتلندا",
    miniTitle: "جزيرة سكاي (Isle of Skye)",
    discription: "جزيرة خلابة تشتهر بالمناظر الطبيعية الدرامية، من الجبال والوديان إلى البحيرات والشواطئ. توفر تجربة استثنائية لمحبي المغامرات والمشي في الطبيعة.",
    image: "../../../../assets/images/Isle_of_Skye.png",
  },
  {
    id: '5',
    location: "أمريكا الجنوبية",
    title: "غابة الأمازون المطيرة (Amazon Rainforest) - أمريكا الجنوبية",
    miniTitle: "غابة الأمازون (Amazon Rainforest)",
    discription: "أكبر غابة استوائية في العالم، موطن لأنواع لا حصر لها من النباتات والحيوانات. تتميز بتنوعها الحيوي الهائل، وشلالاتها الخفية، وأنهارها العظيمة مثل نهر الأمازون.",
    image: "../../../../assets/images/Amazon.png",
  },
  ]

  // Current slide index and background
  currentSlideIndex: number = 0;
  currentBackground: string = '';
  autoSlideInterval: any;
  sliderService = inject(SliderService)
  sliderData$!: Observable<Slider[]>;
  ngOnInit(): void {
    this.sliderData$ = this.sliderService.getSliderData().pipe(
      tap(data => {
          if (!data.length) {
              console.error('No slides available from API');
          }
      }),
      catchError(error => {
          console.error('Error fetching slider data:', error);
          return of(this.SliderData);
      })
  );
    this.updateBackground(this.currentSlideIndex); // Set initial background
    this.startAutoSlide(); // Start the auto slide
    AOS.init(); // Initialize animations
  }


  //Fake api
  getSliderData() {
    this.sliderService.getSliderData().subscribe({
      next:(data: Slider[]) =>{
        this.sliderData$ = of(data);
        this.updateBackground(this.currentSlideIndex); // Initialize background
        this.startAutoSlide(); // Start auto slide after data is fetched
      },error:(err:any)=>{

      }
    })
  }
  // Function to start auto sliding of the carousel
  startAutoSlide() {
    // Clear any existing interval
    this.clearAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.SliderData.length;
      this.updateSlide(this.currentSlideIndex);
    }, 5000);
  }
  // Clear the auto slide interval to avoid multiple intervals running
  clearAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
  // Update slide based on the index
  updateSlide(index: number) {
    this.updateBackground(index);
    this.updateActiveDot(index);
    Aos.refreshHard()
  }

  // Update the background based on the current slide index
  updateBackground(index: number) {
    const { image } = this.SliderData[index];
    this.currentBackground = `
    linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.8) 100%),
    linear-gradient(180deg, rgba(247, 248, 249, 0) 70.66%, #F7F8F9 100%),
    url(${image}) no-repeat center center / cover
  `;
  }

  // Update the active dot based on the current slide index
  updateActiveDot(activeIndex: number) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      const miniImage = dot.querySelector('.miniimg');
      if (index === activeIndex) {
        dot.classList.add('active');
        miniImage?.classList.remove('grayscale');
      } else {
        dot.classList.remove('active');
        miniImage?.classList.add('grayscale');
      }
    });
  }

  // Change the slide based on the slide ID
  changeSlide(slideId: string) {
    const foundIndex = this.SliderData.findIndex(slide => slide.id === slideId);
    if (foundIndex !== -1) {
      this.currentSlideIndex = foundIndex;
      this.updateSlide(this.currentSlideIndex);
      this.carousel.to(slideId); // Navigate to selected slide
      this.updateActiveDot(this.currentSlideIndex);
      this.startAutoSlide()
      Aos.refreshHard()
    } else {
      console.warn(`Slide with id ${slideId} not found`);
    }
  }
}
