<template>
    <div class="navbar w-full p-0">
        <div class="bg-white w-full ">
            <div class="mx-auto px-4">
                <div class="flex items-center justify-between">
                    <div class="text-lg font-bold md:py-0">
                        <NuxtLink to="/" class="navbar-brand">
                            <img src="/static/images/opeb_logo.gif" alt="OpenEBench" width="80" class="navbar-logo d-inline-block align-top" />
                        </NuxtLink>
                    </div>
                    <div class="hidden sm:flex sm:items-center">
                        <ul class="ml-auto mb-0 md:flex absolute md:relative top-full left-0 right-0">
                            <li>
                                <NuxtLink to="/benchmarking" class="nav-link flex md:inline-flex items-center hover:bg-gray-50">
                                    <span>Benchmarking</span>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/projects" class="nav-link flex md:inline-flex items-center hover:bg-gray-50">
                                    <span>Projects</span>
                                </NuxtLink>
                            </li>
                            <li>
                                <NuxtLink to="/tool" class="nav-link flex md:inline-flex items-center hover:bg-gray-50">
                                    <span>Tools</span>
                                </NuxtLink>
                            </li>
                            <li class="relative parent">
                                <a href="#" class="nav-link flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-2">
                                    <span>Observatory</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current pt-1" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>
                                </a>
                                <ul class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-white md:shadow-lg md:rounded-b">
                                    <li>
                                        <ul>
                                            <li v-for="(item, index) in subMenuEntriesObservatory"
                                                :key="index">
                                                <NuxtLink :to="item.to">
                                                    {{ item.title }}
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li class="relative parent">
                                <div href="#" class="nav-link flex justify-between md:inline-flex items-center hover:bg-gray-50 space-x-2">
                                    <span>About</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current pt-1" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>
                                </div>
                                <ul class="child transition duration-300 md:absolute top-full left-0 md:w-48 bg-white md:shadow-lg md:rounded-b">
                                    <li>
                                        <ul>
                                            <li v-for="(item, index) in subMenuEntriesAbout"
                                                :key="index">
                                                <NuxtLink :to="item.to">
                                                    {{ item.title }}
                                                </NuxtLink>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="hidden sm:flex sm:items-center">
                        <NuxtLink to="home" class="text-gray-800 text-sm font-semibold hover:text-purple-600 mr-4">
                            Login
                        </NuxtLink>
                        <NuxtLink to="home" class="text-gray-800 text-sm font-semibold border px-4 py-2 rounded-lg hover:text-purple-600 hover:border-purple-600">
                            Benchmark your tool
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import menuEntries from '~/components/Header/HeaderMenu/menuEntries';
import subMenuEntriesObservatory from './HeaderMenu/subMenuEntriesObservatory';
import subMenuEntriesAbout from './HeaderMenu/subMenuEntriesAbout';
</script>


<style scoped lang="scss">
    .navbar {
        /*height: 65px; */
        font-size: 18px;
        border-bottom: 1px solid rgb(229, 231, 235);
        position: fixed;
        top: 0;
        /*overflow: hidden; */
        z-index: 2;
        .navbar-brand {
            height: 65px;
            img {
                padding: 0px 10px;
                width: 85px;
            }
        }
        .nav-link {
            font-size: 18px;
            font-weight: 500;
            padding: 22px 10px 15px;
            display: flex;
            &:hover {
                color: #0b579f;
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
    
    .header-links li span {
        position: relative;
        z-index: 0;
      }
    
      .header-links li span::before {
        content: '';
        position: absolute;
        z-index: -1;
        bottom: 2px;
        left: -4px;
        right: -4px;
        display: block;
        height: 6px;
      }
    
      .header-links li.active span::before {
        background-color: #fcae04;
      }
    
      .header-links li:not(.active):hover span::before {
        background-color: #ccc;
      }
      
      .child {
        opacity:0;
        height:0;
        overflow:hidden;
        transform: translateY(-10%);
    }
        

      .parent:hover .child {
        opacity:1;
        height:auto;
        overflow:auto;
        transform: translateY(0);
    }
   

    /*:-moz-any-link

      @media only screen and (min-width: 768px){
        .parent:hover .child {
            opacity:1;
            height:auto;
            overflow:none;
            transform: translateY(0);
        }
        .child {
            opacity:0;
            height:0;
            overflow:hidden;
            transform: translateY(-10%);
        }
    }

    */
    
</style>