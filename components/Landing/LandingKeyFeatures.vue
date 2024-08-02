<template>
  <div class="w-100 landingkey-features">
    <div class="container">
      <h2 class="text-h4 mb-15">What does OpenEBench offer?</h2>
      <div class="row">
        <div class="col col-6">
          <div
            class="welcome-header-image"
            data-aos="fade-up"
            data-aos-duration="3000"
          >
            <NuxtImg
              src="/images/illustrations/404.svg"
              alt="welcome-header-image"
            />
          </div>
        </div>
        <div class="col col-6 landingkey-features__box">
          <div class="col-row">
            <div class="rounder-icon">
              <UIcon name="i-heroicons-check-16-solid" />
            </div>
            <div class="landingkey-features__text">
              <span> Supporting community-driven benchmarking </span>
            </div>
          </div>
          <div class="col-row">
            <div class="rounder-icon">
              <UIcon name="i-heroicons-check-16-solid" />
            </div>
            <div class="landingkey-features__text">
              <span> Monitoring of software quality in life sciences </span>
            </div>
          </div>
          <div class="col-row">
            <div class="rounder-icon">
              <UIcon name="i-heroicons-check-16-solid" />
            </div>
            <div class="landingkey-features__text">
              <span>
                Contributing towards the adoption of best practices for research
                software development
              </span>
            </div>
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
.landingkey-features {
  padding-top: 40px;
  padding-bottom: 80px;
  .col-row {
    display: flex;
    font-size: 18px;
    align-items: center;
    cursor: pointer;
    position: relative;
    padding-bottom: 20px;
    text-align: center;
    .rounder-icon {
      border-radius: 50%;
      background-color: #f47c21;
      height: 35px;
      width: 35px;
      min-width: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      span {
        color: white;
        font-size: 25px;
        font-weight: 600;
      }
    }
    span {
      padding-left: 20px;
    }
    &:not(:first-child) {
      margin-top: 20px;
    }

    .landingkey-features__text {
      text-align: left;
      span {
        padding-left: 0px;
        transition: background-size 1s ease;
        width: calc(100% + 20px);
        padding-bottom: 2px;
        background-image: linear-gradient(
          transparent calc(100% - 2px),
          #f47c21 2px
        );
        background-repeat: no-repeat;
        background-size: 0% 100%;
      }
      &:hover {
        span {
          background-size: 100% 100%;
        }
      }
    }
  }
  &__box {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
