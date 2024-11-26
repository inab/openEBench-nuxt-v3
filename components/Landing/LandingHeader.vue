<template>
  <div class="w-100">
    <div class="welcome-header-box">
      <div class="container container-padding">
        <div class="row">
          <h1 class="text-h3 mb-4 primary--text">Welcome to OpenEBench</h1>
          <div class="col-lg-7 welcome-left mb-4 mb-lg-0">
            <div class="w-100">
              <h2 class="text-subtitle-1 mb-5">
                The ELIXIR gateway to benchmarking communities, software
                monitoring, and quality metrics for life sciences tools and
                workflows.
              </h2>
            </div>
            <div class="row justify-content-center text-center">
              <div
                class="col-md-6 mb-4 mb-md-0 d-flex flex-column align-items-center gap-4"
              >
                <div class="welcome-avatar">
                  <div
                    class="welcome-avatar__image secondary"
                    title="Scientific Benchmarking"
                  ></div>
                </div>
                <p class="body-1">
                  I want to search for benchmarking communities and results
                </p>
                <NuxtLink
                  to="/benchmarking"
                  class="custom-btn primary welcome-header-btn"
                  title="Go to Scientific Benchmarking"
                >
                  Scientific Benchmarking
                </NuxtLink>
              </div>
              <div class="col-md-6 d-flex flex-column align-items-center gap-4">
                <div class="welcome-avatar secondary">
                  <div
                    class="welcome-avatar__image_secondary"
                    title="Tools Observatory"
                  ></div>
                </div>
                <p class="body-1">
                  I want to see how to develop sustainable research tools
                </p>
                <NuxtLink
                  to="/observatory"
                  class="custom-btn secondary welcome-header-btn "
                  title="Go to Tools Observatory"
                >
                  Tools Observatory
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="col-lg-5 d-none d-lg-block">
            <div class="welcome-header-image">
              <CommunityImg />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CommunityImg from "../../public/images/illustrations/chart-person.svg?component";
</script>

<style scoped lang="scss">
.welcome-avatar {
  border-radius: 50%;
  background-color: #0b579f;
  height: 60px;
  width: 60px;
  padding: 5px;
  transition: 0.5s;
  color: white;
  &.secondary {
    background-color: #f47c21;
  }
  &__image {
    background-color: white;
    height: 100%;
    -webkit-mask: url("~/assets/icons/benchmark.svg") no-repeat center;
    mask: url("~/assets/icons/benchmark.svg") no-repeat center;
    transition: transform 0.7s ease-in-out;
  }
  &__image_secondary {
    background-color: white;
    height: 100%;
    -webkit-mask: url("~/assets/icons/observatory.svg") no-repeat center;
    mask: url("~/assets/icons/observatory.svg") no-repeat center;
    transition: transform 0.7s ease-in-out;
  }
}
.welcome-header-image {
  img {
    width: 100%;
    max-height: 350px;
  }
}
.welcome-header-box {
  padding-bottom: 50px;
  h1 {
    font-weight: 600;
    font-size: 3rem !important;
    line-height: 3.125rem;
  }
  h2 {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.75rem;
    letter-spacing: 0.009375em;
  }
  .welcome-left {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    .row {
      flex-grow: 1;
      padding-top: 20px;
      .col {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
      }
    }
  }
}
.welcome-header-btn {
  width: 100%;
  min-height: 40px;
  padding: 12px 30px;
  color: white;
  text-decoration: none;
  padding: 5px;
  cursor: pointer;
  transition: 0.5s;
  border: 1px solid #0b579f;
  &:hover {
    background-color: white;
    color: #0b579f;
  }
  &.secondary {
    background-color: #f47c21;
    color: white;
    border: 1px solid #f47c21;
    &:hover {
      background-color: white;
      color: #f47c21;
    }
  }
}
</style>
