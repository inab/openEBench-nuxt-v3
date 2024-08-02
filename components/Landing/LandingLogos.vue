<template>
  <div class="landing-logos">
    <div class="container">
      <div class="landing-logos__title">
        <h2 class="text-h4 mb-15">Our partners</h2>
      </div>
      <Carousel
        :items-to-show="2.95"
        :wrap-around="true"
        :transition="500"
        :autoplay="2000"
      >
        <Slide
          v-for="(slide, index) in sliderImages"
          :key="index"
          class="landing-logos__box"
        >
          <div class="carousel__item">
            <img :src="slide.src" />
          </div>
        </Slide>

        <template #addons>
          <Navigation />
        </template>
      </Carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Carousel, Navigation, Slide } from "vue3-carousel";
import Img1 from "~/assets/images/partners/elixir.png";
import Img2 from "~/assets/images/partners/eucanimage.png";
import Img3 from "~/assets/images/partners/eucancan.png";
import Img4 from "~/assets/images/partners/permedcoe.png";
import Img5 from "~/assets/images/partners/ipc.png";
import Img6 from "~/assets/images/partners/decider.jpg";

import "vue3-carousel/dist/carousel.css";

const sliderImages = [
  {
    title: "Eucan Image",
    href: "https://eucanimage.eu/",
    src: Img2,
  },
  {
    title: "Elixir",
    href: "https://elixir-europe.org/",
    src: Img1,
  },
  {
    title: "PerMedCoE",
    href: "https://permedcoe.eu/",
    src: Img4,
  },
  {
    title: "EUCANcan",
    href: "https://eucancan.com/",
    src: Img3,
  },
  {
    title: "decider",
    href: "https://www.deciderproject.eu/",
    src: Img6,
  },
  {
    title: "IPC",
    href: "https://ipc-project.eu/",
    src: Img5,
  },
];
</script>

<style scoped lang="scss">
.landing-logos {
  padding-bottom: 50px;
  padding-top: 70px;
  &__box {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px 40px;
    img {
      max-width: 100%;
      max-height: 120px;
      object-fit: contain;
    }
  }
  &__title {
    padding-bottom: 30px;
  }
}
.carousel__slide {
  padding: 5px;
}

.carousel__viewport {
  perspective: 2000px;
}

.carousel__track {
  transform-style: preserve-3d;
}

.carousel__slide--sliding {
  transition: 0.5s;
}

.carousel__slide {
  opacity: 0.9;
  transform: rotateY(-20deg) scale(0.8);
}

.carousel__slide--active ~ .carousel__slide {
  transform: rotateY(20deg) scale(0.8);
}

.carousel__slide--prev {
  opacity: 1;
  transform: rotateY(-10deg) scale(0.8);
}

.carousel__slide--next {
  opacity: 1;
  transform: rotateY(10deg) scale(0.8);
}

.carousel__slide--active {
  opacity: 1;
  transform: rotateY(0) scale(1.1);
}
</style>
