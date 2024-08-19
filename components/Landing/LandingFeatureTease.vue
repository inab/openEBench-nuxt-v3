<template>
  <div class="landing-feature-tease">
    <div class="container">
      <h2 class="text-h4 mb-15">What can you do in OpenEBench?</h2>
      <div class="row landing-feature-tease__container">
        <div
          class="col-12 col-md-6 col-lg-3 landing-feature-tease__col"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <div class="landing-feature-tease__box">
            <div class="landing-feature-tease__box__image">
              <div
                class="landing-feature-tease__box__image__1"
                title="Scientific Benchmarking"
              ></div>
            </div>
          </div>
          <div class="landing-feature-tease__text-container-box">
            <div class="landing-feature-tease__title">Benchmarks</div>
            <p class="landing-feature-tease__body body-1">
              Explore existing community-driven scientific benchmark results for
              Life Sciences software
            </p>
            <NuxtLink
              to="/benchmarking"
              class="custom-btn primary btn-empty-filled landing-feature-btn"
              title="Go to Benchmarks"
            >
              Explore
            </NuxtLink>
          </div>
        </div>
        <div
          class="col-12 col-md-6 col-lg-3 landing-feature-tease__col"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="300"
        >
          <div class="landing-feature-tease__box">
            <div class="landing-feature-tease__box__image">
              <div
                class="landing-feature-tease__box__image__2"
                title="Scientific Benchmarking"
              >
                <font-awesome-icon :icon="['fas', 'list-ol']" />
              </div>
            </div>
          </div>
          <div class="landing-feature-tease__text-container-box">
            <div class="landing-feature-tease__title">Tools & Metrics</div>
            <p class="landing-feature-tease__body body-1">
              Individually browse technical metrics for popular research
              software in Life Sciences
            </p>
            <NuxtLink
              to="/tool"
              class="custom-btn primary btn-empty-filled landing-feature-btn"
              title="Go to Tools & Metrics"
            >
              Explore
            </NuxtLink>
          </div>
        </div>
        <div
          class="col-12 col-md-6 col-lg-3 landing-feature-tease__col"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="400"
        >
          <div class="landing-feature-tease__box">
            <div class="landing-feature-tease__box__image">
              <div
                class="landing-feature-tease__box__image__3"
                title="Scientific Benchmarking"
              ></div>
            </div>
          </div>
          <div class="landing-feature-tease__text-container-box">
            <div class="landing-feature-tease__title">Tools Observatory</div>
            <p class="landing-feature-tease__body body-1">
              Quantitative monitoring of the technical quality of software in
              Life Sciences
            </p>
            <NuxtLink
              to="/observatory"
              class="custom-btn primary btn-empty-filled landing-feature-btn"
              title="Go to Tools Observatory"
            >
              Explore
            </NuxtLink>
          </div>
        </div>
        <div
          class="col-12 col-md-6 col-lg-3 landing-feature-tease__col"
          data-aos="fade-up"
          data-aos-duration="1000"
          data-aos-delay="500"
        >
          <div class="landing-feature-tease__box">
            <div class="landing-feature-tease__box__image">
              <div
                class="landing-feature-tease__box__image__4"
                title="Scientific Benchmarking"
              ></div>
            </div>
          </div>
          <div class="landing-feature-tease__text-container-box">
            <div class="landing-feature-tease__title">Project Spaces</div>
            <p class="landing-feature-tease__body body-1">
              Community spaces for projects to collaborate on software in life
              sciences
            </p>
            <NuxtLink
              to="/projects"
              class="custom-btn primary btn-empty-filled landing-feature-btn"
              title="Go to Project Spaces"
            >
              Explore
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AOS from "aos";
AOS.init();
</script>

<style scoped lang="scss">
.landing-feature-tease {
  padding-top: 60px;
  padding-bottom: 80px;
  background-color: #fafafa;

  &__box {
    display: flex;
    justify-content: center;
    width: 100%;

    &__image {
      background-color: #0b579f;
      border: 1px solid #0b579f;
      border-radius: 50%;
      height: 50px;
      width: 50px;
      margin-bottom: 20px;
      cursor: pointer;
      transition: 0.5s;

      &:hover {
        border: 1px solid #0b579f;
        background-color: white;

        &__2 {
          color: #0b579f;
        }
      }

      &__1,
      &__3,
      &__4 {
        height: 50px;
        width: 50px;
        background-color: white;
        -webkit-mask: url("~/assets/icons/benchmark.svg") no-repeat center;
        mask: url("~/assets/icons/benchmark.svg") no-repeat center;

        &:hover {
          background-color: #0b579f;
        }
      }

      &__2 {
        height: 50px;
        width: 50px;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;

        &:hover {
          color: #0b579f;
        }
      }
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
    padding-bottom: 10px;
    padding-top: 10px;
    text-align: center;
  }

  &__body {
    text-align: center;
    padding-bottom: 17px;
    font-size: 15px;
  }

  &__col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 10px;
    margin-bottom: 30px; // Add some margin to the bottom for spacing on mobile
  }

  &__container {
    padding-top: 40px;
  }

  &__text-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
  }

  &__text-container-box {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    flex: 1;
    padding-bottom: 20px;
  }

  .landing-feature-btn {
    width: 100%;
    text-align: center;
    padding-bottom: 5px;
  }
}

@media (max-width: 768px) {
  .landing-feature-tease__col {
    text-align: center;
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
