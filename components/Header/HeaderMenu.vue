<template>
    <nav class="navbar navbar-expand-lg navbar-light">
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
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <NuxtLink to="/login" class=" btn btn-link btn-outline-primary">
                        Login
                    </NuxtLink>
                </li>
                <li class="nav-item">
                    <a href="https://openebench.bsc.es/vre/home/" 
                        class="btn"
                        target="_blank">
                        <font-awesome-icon
                            :icon="['fas', 'fa-up-right-from-square']" />
                            Benchmark your Tool
                    </a>
                </li>
                
            </ul>
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
        padding: 0px 25px;
        height: 65px;
        background-color: white;
        font-size: 18px;
        border-bottom: 1px solid rgba(0,0,0,.1);
        .navbar-brand {
            height: 65px;
            img {
                padding: 0px 10px;
                width: 85px;
            }
        }
        .navbar-nav {
            display: flex;
            height: 100%;
            .nav-item {
                height: 100%;
                .nav-link {
                    font-size: 18px;
                    font-weight: 600;
                    padding: 22px 20px 15px;
                    &:hover {
                        color: #0b579f;
                    }
                }
            }
        }
        #navbarSupportedContent {
            height: 100%;
        }
        .form-inline {
            display: flex;
            gap: 30px;
            align-items: center;
            a {
                color: #0b579f;
                &.btn:hover {
                    color: #0b579f;
                }
                &.btn-link:hover {
                    color: white;
                    background-color: #0b579f;
                }
            }
        }
        a {
            text-decoration: none;
            color: rgba(0, 0, 0, .65);
            font-size: 1rem;
            font-weight: 500;
        }
    }

    .header-menu-right {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        gap: 10px;
    }
    
    
    
</style>