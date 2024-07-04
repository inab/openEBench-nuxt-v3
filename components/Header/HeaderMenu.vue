<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <NuxtLink to="/" class="navbar-brand">
            <img src="/static/images/opeb_logo.gif" alt="OpenEBench" width="80" class="navbar-logo d-inline-block align-top" />
        </NuxtLink>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
      
        <div class="navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <NuxtLink to="/benchmarking" class="nav-link">
                    Benchmarking
                </NuxtLink>
            </li>
            <li class="nav-item">
                <NuxtLink to="/projects" class="nav-link">
                    Projects
                </NuxtLink>
            </li>
            <li class="nav-item dropdown">
                <NuxtLink to="/tool" class="nav-link">
                    Tools
                </NuxtLink>
            </li>
            <li class="nav-item dropdown">
                <NuxtLink to="/tool" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Observatory
                </NuxtLink>
                <ul class="dropdown-menu">
                    <li v-for="(item, index) in subMenuEntriesObservatory"
                        :key="index">
                        <a class="dropdown-item" href="#">
                            {{ item.title }}
                        </a>
                    </li>
                </ul>
            </li>
            <li class="nav-item dropdown">
                <NuxtLink to="/tool" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Docs
                </NuxtLink>
                <ul class="dropdown-menu">
                    <li v-for="(item, index) in subMenuEntriesDocs"
                        :key="index">
                        <a class="dropdown-item" href="#">
                            {{ item.title }}
                        </a>
                    </li>
                </ul>
            </li>
            <li class="nav-item dropdown">
                <NuxtLink to="/tool" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    About
                </NuxtLink>
                <ul class="dropdown-menu">
                    <li v-for="(item, index) in subMenuEntriesAbout"
                        :key="index">
                        <a class="dropdown-item" href="#">
                            {{ item.title }}
                        </a>
                    </li>
                </ul>
            </li>
          </ul>
          <div class="form-inline my-2 my-lg-0">
            <button class="btn btn-outline-primary my-2 my-sm-0" type="button">
                <font-awesome-icon
                    :icon="['fas', 'fa-up-right-from-square']" />
                    Benchmark your Tool
            </button>
            <button class="btn btn-outline-primary my-2 my-sm-0" type="button">
                <font-awesome-icon
                    :icon="['fas', 'fa-arrow-right-to-bracket']" />
                    Login
            </button>
          </div>
        </div>
      </nav>
</template>

<script setup lang="ts">
import menuEntries from '~/components/Header/HeaderMenu/menuEntries';
import subMenuEntriesObservatory from './HeaderMenu/subMenuEntriesObservatory';
import subMenuEntriesDocs from './HeaderMenu/subMenuEntriesDocs';
import subMenuEntriesAbout from './HeaderMenu/subMenuEntriesAbout';
</script>


<style scoped lang="scss">
.navbar {
    padding: 7px 20px;
}
    .header-menu-right {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        gap: 10px;
    }
</style>