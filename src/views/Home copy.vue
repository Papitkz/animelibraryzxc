<template>
  <v-container fluid class="dark-bg">
    <br />
    <v-row>
      <!-- Main Content -->
      <v-col cols="12">
        <v-card elevation="3" style="border-radius:0%" min-height="85vh" class="dark-card">
          <v-card-text>
            <!-- Header Section -->
            <v-row align="center" class="mb-6">
              <v-col cols="12" class="d-flex align-center">
                <div>
                  <h1 class="text-h4 font-weight-bold text-white animate__animated animate__fadeInLeft">Anime Library</h1>
                  <p style="color:white !important" class="text-subtitle-1 text-medium-emphasis text-red-lighten-1 animate__animated animate__fadeInLeft animate__delay-1s">Your personal anime collection</p>
                </div>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="searchQuery"
                  label="Search anime..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="comfortable"
                  hide-details
                  clearable
                  bg-color="dark-red"
                  color="red-lighten-1"
                  class="text-white search-field animate__animated animate__fadeInDown"
                  @keyup.enter="fetchAnimeData"
                ></v-text-field>
              </v-col>
              
              <v-col cols="12" md="8" class="d-flex justify-end align-center">
                <!-- Status Filter -->
                <v-btn-toggle v-model="filterStatus" color="red-darken-2" rounded="0" class="mr-4 animate__animated animate__fadeInRight filter-toggle">
                  <v-btn value="all" class="text-white filter-btn">All</v-btn>
                  <v-btn value="watching" class="text-white filter-btn">Watching</v-btn>
                  <v-btn value="completed" class="text-white filter-btn">Completed</v-btn>
                  <v-btn value="planned" class="text-white filter-btn">Planned</v-btn>
                </v-btn-toggle>
                
                <!-- Advanced Filter Button -->
                <v-menu
                  v-model="filterMenu"
                  :close-on-content-click="false"
                  location="bottom end"
                  transition="slide-y-transition"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      color="red-darken-2"
                      class="text-white animate__animated animate__fadeInRight"
                      prepend-icon="mdi-filter-variant"
                      append-icon="mdi-chevron-down"
                    >
                      Filters
                    </v-btn>
                  </template>
                  
                  <v-card min-width="300" class="dark-card filter-menu-card">
                    <v-card-title class="text-white d-flex justify-space-between align-center">
                      Advanced Filters
                      <v-btn icon @click="filterMenu = false" size="small">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>
                    
                    <v-card-text>
                      <!-- Genre Filter -->
                      <div class="mb-4">
                        <h3 class="text-subtitle-1 font-weight-bold text-white mb-2">Genres</h3>
                        <v-select
                          v-model="selectedGenres"
                          :items="allGenres"
                          label="Select genres"
                          multiple
                          variant="outlined"
                          bg-color="dark-red"
                          color="red-lighten-1"
                          class="text-white"
                          hide-details
                        ></v-select>
                      </div>
                      
                      <!-- Year Filter -->
                      <div class="mb-4">
                        <h3 class="text-subtitle-1 font-weight-bold text-white mb-2">Year</h3>
                        <v-range-slider
                          v-model="yearRange"
                          :max="currentYear"
                          :min="2016"
                          :step="1"
                          thumb-label="always"
                          color="red-darken-2"
                          track-color="red-darken-2"
                          class="year-slider"
                        ></v-range-slider>
                        <div class="d-flex justify-space-between mt-2">
                          <span class="text-red-lighten-1">{{ yearRange[0] }}</span>
                          <span class="text-red-lighten-1">{{ yearRange[1] }}</span>
                        </div>
                      </div>
                      
                      <!-- Sort By -->
                      <div class="mb-4">
                        <h3 class="text-subtitle-1 font-weight-bold text-white mb-2">Sort By</h3>
                        <v-select
                          v-model="sortBy"
                          :items="sortOptions"
                          label="Sort by"
                          variant="outlined"
                          bg-color="dark-red"
                          color="red-lighten-1"
                          class="text-white"
                          hide-details
                        ></v-select>
                      </div>
                      
                      <!-- Season Selection -->
                      <div class="mb-4">
                        <h3 class="text-subtitle-1 font-weight-bold text-white mb-2">Season</h3>
                        <v-select
                          v-model="selectedSeason"
                          :items="seasonOptions"
                          label="Select season"
                          variant="outlined"
                          bg-color="dark-red"
                          color="red-lighten-1"
                          class="text-white"
                          hide-details
                        ></v-select>
                      </div>
                      
                      <!-- Load Filter Button -->
                      <v-btn
                        color="red-darken-2"
                        block
                        @click="applyFilters"
                        class="load-filter-btn"
                      >
                        Load Filter
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-menu>
              </v-col>
            </v-row>
            
            <!-- Featured Anime Carousel -->
            <v-row class="mb-8">
              <v-col cols="12">
                <h2 class="text-h5 font-weight-bold mb-4 text-white animate__animated animate__fadeInUp">Featured Anime</h2>
                <v-carousel
                  cycle
                  height="500"
                  hide-delimiter-background
                  show-arrows="hover"
                  class="rounded-lg carousel-container animate__animated animate__fadeInUp animate__delay-1s"
                  color="red-darken-2"
                >
                  <v-carousel-item
                    v-for="(anime, index) in featuredAnime"
                    :key="index"
                    :src="getProxiedImageUrl(anime.images?.jpg?.large_image_url)"
                    cover
                    @click="selectAnime(anime)"
                    style="cursor: pointer;"
                  >
                    <v-row
                      class="fill-height"
                      align="end"
                    >
                      <v-col class="pa-4 pa-md-6">
                        <div class="text-h4 text-h6-mobile font-weight-bold text-white mb-2 animate__animated animate__fadeInUp featured-text">
                          {{ anime.title }}
                        </div>
                        <div class="text-h6 text-subtitle-2-mobile text-white mb-3 mb-md-4 animate__animated animate__fadeInUp animate__delay-1s featured-text">
                          {{ anime.synopsis?.substring(0, 150) }}...
                        </div>
                        <div class="d-flex align-center mb-3 mb-md-4 animate__animated animate__fadeInUp animate__delay-2s">
                          <v-rating
                            :model-value="anime.score / 2"
                            color="amber"
                            density="compact"
                            half-increments
                            readonly
                            size="small"
                            class="mr-2"
                          ></v-rating>
                          <span class="text-white featured-text">{{ anime.score }}</span>
                        </div>
                        <div class="d-flex flex-wrap animate__animated animate__fadeInUp animate__delay-3s">
                          <v-btn
                            color="red-darken-2"
                            class="mr-2 mb-2 watch-btn"
                            prepend-icon="mdi-play"
                            size="small"
                            @click.stop="watchAnime(anime)"
                          >
                            Watch Now
                          </v-btn>
                          <v-btn
                            variant="outlined"
                            color="white"
                            class="mb-2 details-btn"
                            prepend-icon="mdi-information"
                            size="small"
                            @click.stop="selectAnime(anime)"
                          >
                            Details
                          </v-btn>
                        </div>
                      </v-col>
                    </v-row>
                    <div class="carousel-overlay"></div>
                  </v-carousel-item>
                </v-carousel>
              </v-col>
            </v-row>
            
            <!-- Loading Indicator -->
            <v-row v-if="loading" justify="center" class="my-12">
              <v-progress-circular
                indeterminate
                color="red-darken-2"
                size="70"
                width="7"
              ></v-progress-circular>
            </v-row>
            
            <!-- Error Message -->
            <v-row v-if="error" justify="center" class="my-12">
              <v-col cols="12" class="text-center">
                <v-icon icon="mdi-alert-circle" size="64" class="mb-4 text-red-lighten-1"></v-icon>
                <h3 class="text-h5 mb-2 text-white">Error Loading Anime</h3>
                <p class="text-medium-emphasis text-red-lighten-1">{{ error }}</p>
                <v-btn color="red-darken-2" class="mt-4" @click="fetchAnimeData">Retry</v-btn>
              </v-col>
            </v-row>
            
            <!-- Results Header -->
            <v-row v-if="!loading && !error" class="mb-4 align-center">
              <v-col cols="12" md="6">
                <h2 class="text-h5 font-weight-bold text-white">
                  Anime Collection
                  <span class="text-subtitle-1 text-red-lighten-1 ml-2">({{ filteredAnime.length }} results)</span>
                </h2>
              </v-col>
              <v-col cols="12" md="6" class="text-right">
                <v-btn-toggle v-model="viewMode" color="red-darken-2" rounded="0" class="view-toggle">
                  <v-btn value="grid" icon="mdi-grid" class="text-white"></v-btn>
                  <v-btn value="list" icon="mdi-format-list-bulleted" class="text-white"></v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            
            <!-- Anime Grid -->
            <v-row v-if="viewMode === 'grid' && !loading && !error">
              <v-col
                v-for="(anime, index) in filteredAnime"
                :key="anime.mal_id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="animate__animated animate__fadeInUp"
                :style="`animation-delay: ${index * 0.1}s`"
              >
                <v-card
                  class="mx-auto dark-card-anime anime-card"
                  max-width="344"
                  elevation="2"
                  hover
                  :ripple="false"
                  @click="selectAnime(anime)"
                  style="cursor: pointer;"
                >
                  <div class="anime-image-container">
                    <v-img
                      :src="getProxiedImageUrl(anime.images?.jpg?.large_image_url)"
                      height="200px"
                      cover
                      class="align-end"
                      :lazy-src="getProxiedImageUrl(anime.images?.jpg?.small_image_url)"
                    >
                      <v-chip
                        :color="getStatusColor(anime.status)"
                        size="small"
                        class="ma-2 status-chip"
                      >
                        {{ formatStatus(anime.status) }}
                      </v-chip>
                    </v-img>
                    <div class="anime-overlay">
                      <v-btn
                        icon="mdi-play-circle"
                        color="red-darken-2"
                        size="large"
                        class="play-overlay-btn"
                        @click.stop="watchAnime(anime)"
                      ></v-btn>
                    </div>
                  </div>
                  
                  <v-card-title class="text-truncate text-white">{{ anime.title }}</v-card-title>
                  
                  <v-card-subtitle class="text-red-lighten-1">
                    {{ anime.episodes || 'Unknown' }} episodes • {{ anime.year || 'N/A' }}
                  </v-card-subtitle>
                  
                  <v-card-text>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :model-value="anime.score / 2"
                        color="amber"
                        density="compact"
                        half-increments
                        readonly
                        size="small"
                      ></v-rating>
                      <div class="text-grey-lighten-1 ms-4">{{ anime.score }}</div>
                    </v-row>
                    
                    <div class="my-2 text-subtitle-2 text-red-lighten-1">
                      <v-icon icon="mdi-tag-multiple" size="small" class="mr-1"></v-icon>
                      {{ anime.genres?.slice(0, 2).map(g => g.name).join(', ') }}
                    </div>
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-btn
                      color="red-darken-2"
                      variant="flat"
                      prepend-icon="mdi-play-circle"
                      class="text-white watch-card-btn"
                      @click.stop="watchAnime(anime)"
                    >
                      Watch
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn 
                      icon="mdi-dots-vertical" 
                      variant="text" 
                      class="text-white menu-btn"
                      @click.stop="showMenu($event, anime)"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Anime List View -->
            <v-list v-else-if="!loading && !error" class="dark-list anime-list-view">
              <v-list-item
                v-for="(anime, index) in filteredAnime"
                :key="anime.mal_id"
                class="anime-list-item mb-4 animate__animated animate__fadeInUp"
                :style="`animation-delay: ${index * 0.1}s`"
                @click="selectAnime(anime)"
              >
                <template v-slot:prepend>
                  <v-img
                    :src="getProxiedImageUrl(anime.images?.jpg?.large_image_url)"
                    width="120"
                    height="170"
                    cover
                    class="rounded-lg mr-4"
                    :lazy-src="getProxiedImageUrl(anime.images?.jpg?.small_image_url)"
                  ></v-img>
                </template>
                
                <v-list-item-title class="text-h6 text-white mb-1">{{ anime.title }}</v-list-item-title>
                
                <v-list-item-subtitle class="text-red-lighten-1 mb-2">
                  {{ anime.episodes || 'Unknown' }} episodes • {{ anime.year || 'N/A' }} • {{ anime.genres?.slice(0, 3).map(g => g.name).join(', ') }}
                </v-list-item-subtitle>
                
                <div class="d-flex align-center mb-2">
                  <v-rating
                    :model-value="anime.score / 2"
                    color="amber"
                    density="compact"
                    half-increments
                    readonly
                    size="small"
                    class="mr-2"
                  ></v-rating>
                  <span class="text-white">{{ anime.score }}</span>
                  <v-chip
                    :color="getStatusColor(anime.status)"
                    size="small"
                    class="ml-4"
                  >
                    {{ formatStatus(anime.status) }}
                  </v-chip>
                </div>
                
                <p class="text-body-2 text-white text-truncate-2 mb-2">{{ anime.synopsis || 'No synopsis available.' }}</p>
                
                <template v-slot:append>
                  <div class="d-flex flex-column">
                    <v-btn
                      icon="mdi-play-circle"
                      color="red-darken-2"
                      size="large"
                      class="mb-2"
                      @click.stop="watchAnime(anime)"
                    ></v-btn>
                    <v-btn 
                      icon="mdi-dots-vertical" 
                      variant="text" 
                      class="text-white"
                      @click.stop="showMenu($event, anime)"
                    ></v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
            
            <!-- Load More Button -->
            <v-row v-if="hasMore && !loading && !error" justify="center" class="mt-6">
              <v-btn
                color="red-darken-2"
                @click="loadMoreAnime"
                :loading="loadingMore"
              >
                Load More
              </v-btn>
            </v-row>
            
            <!-- Empty State -->
            <v-row v-if="!loading && !error && filteredAnime.length === 0" justify="center">
              <v-col cols="12" class="text-center py-12">
                <v-icon icon="mdi-emoticon-sad-outline" size="64" class="mb-4 text-red-lighten-1 animate__animated animate__pulse animate__infinite"></v-icon>
                <h3 class="text-h5 mb-2 text-white">No anime found</h3>
                <p class="text-medium-emphasis text-red-lighten-1">Try adjusting your search or filters</p>
                <v-btn
                  color="red-darken-2"
                  class="mt-4"
                  @click="resetFilters"
                >
                  Reset All Filters
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Anime Detail Modal -->
    <v-dialog
      v-model="dialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="dark-card">
        <v-toolbar
          dark
          color="red-darken-2"
        >
          <v-btn
            icon
            dark
            @click="dialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ selectedAnime.title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              variant="text"
              dark
              @click="watchAnime(selectedAnime)"
            >
              <v-icon left>mdi-play</v-icon>
              Watch
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="4">
              <v-img
                :src="getProxiedImageUrl(selectedAnime.images?.jpg?.large_image_url)"
                height="500"
                cover
                class="rounded-lg"
                :lazy-src="getProxiedImageUrl(selectedAnime.images?.jpg?.small_image_url)"
              ></v-img>
              
              <v-card class="dark-card-tonal mt-4">
                <v-card-title class="text-white">Information</v-card-title>
                <v-card-text>
                  <v-list class="dark-list">
                    <v-list-item>
                      <v-list-item-title class="text-white">Episodes</v-list-item-title>
                      <v-list-item-subtitle class="text-red-lighten-1">{{ selectedAnime.episodes || 'Unknown' }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Year</v-list-item-title>
                      <v-list-item-subtitle class="text-red-lighten-1">{{ selectedAnime.year || 'N/A' }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Status</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip :color="getStatusColor(selectedAnime.status)" size="small">
                          {{ formatStatus(selectedAnime.status) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Rating</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-rating
                          :model-value="selectedAnime.score / 2"
                          color="amber"
                          density="compact"
                          half-increments
                          readonly
                        ></v-rating>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Genres</v-list-item-title>
                      <v-list-item-subtitle class="text-red-lighten-1">
                        {{ selectedAnime.genres?.map(g => g.name).join(', ') || 'N/A' }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="8">
              <v-card class="dark-card-tonal">
                <v-card-title class="text-white">Synopsis</v-card-title>
                <v-card-text>
                  <p class="text-white text-body-1">{{ selectedAnime.synopsis || 'No synopsis available.' }}</p>
                </v-card-text>
              </v-card>
              
              <v-card class="dark-card-tonal mt-4" v-if="selectedAnime.trailer?.url">
                <v-card-title class="text-white">Preview</v-card-title>
                <v-card-text>
                  <section class="iframe" style="display: block;">
                    <iframe 
                      :src="getYoutubeEmbedUrl(selectedAnime.trailer?.url)" 
                      allow="autoplay; encrypted-media" 
                      allowfullscreen=""
                      class="preview-iframe"
                    ></iframe>
                  </section>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    
    <!-- Context Menu -->
    <v-menu
      v-model="menu"
      :position-x="menuX"
      :position-y="menuY"
      absolute
      offset-y
    >
      <v-list class="dark-list">
        <v-list-item @click="addToWatchLater(menuAnime)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-clock-outline</v-icon>
            Watch Later
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="addToFavorites(menuAnime)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-heart-outline</v-icon>
            Add to Favorites
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="shareAnime(menuAnime)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-share-variant</v-icon>
            Share
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="selectAnime(menuAnime)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-information</v-icon>
            View Details
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    
    <!-- Footer -->
    <v-footer class="dark-footer mt-8">
      <v-container fluid>
        <v-row>
          <v-col cols="12" md="4">
            <h3 class="text-h5 font-weight-bold text-white mb-4">Anime Library</h3>
            <p class="text-red-lighten-1">Your personal collection of anime series and movies. Track, discover, and enjoy your favorite shows.</p>
            <div class="d-flex mt-4">
              <v-btn icon="mdi-facebook" color="red-darken-2" class="mr-2 social-btn"></v-btn>
              <v-btn icon="mdi-twitter" color="red-darken-2" class="mr-2 social-btn"></v-btn>
              <v-btn icon="mdi-instagram" color="red-darken-2" class="mr-2 social-btn"></v-btn>
              <v-btn icon="mdi-discord" color="red-darken-2" class="social-btn"></v-btn>
            </div>
          </v-col>
          
          <v-col cols="6" md="2">
            <h4 class="text-h6 font-weight-bold text-white mb-4">Navigation</h4>
            <ul class="footer-list">
              <li><a href="#" class="text-red-lighten-1">Home</a></li>
              <li><a href="#" class="text-red-lighten-1">Browse</a></li>
              <li><a href="#" class="text-red-lighten-1">My List</a></li>
              <li><a href="#" class="text-red-lighten-1">Recommendations</a></li>
            </ul>
          </v-col>
          
          <v-col cols="6" md="2">
            <h4 class="text-h6 font-weight-bold text-white mb-4">Categories</h4>
            <ul class="footer-list">
              <li><a href="#" class="text-red-lighten-1">Action</a></li>
              <li><a href="#" class="text-red-lighten-1">Romance</a></li>
              <li><a href="#" class="text-red-lighten-1">Sci-Fi</a></li>
              <li><a href="#" class="text-red-lighten-1">Fantasy</a></li>
            </ul>
          </v-col>
          
          <v-col cols="12" md="4">
            <h4 class="text-h6 font-weight-bold text-white mb-4">Subscribe to Newsletter</h4>
            <p class="text-red-lighten-1 mb-4">Get updates on new anime releases and recommendations.</p>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Your email"
                  variant="outlined"
                  density="compact"
                  bg-color="dark-red"
                  color="red-lighten-1"
                  class="text-white"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="red-darken-2" block class="subscribe-btn">Subscribe</v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        
        <v-divider class="my-6 border-opacity-25" color="red-darken-2"></v-divider>
        
        <v-row>
          <v-col cols="12" md="6" class="text-center text-md-left">
            <p class="text-red-lighten-1">© 2023 Anime Library. All rights reserved.</p>
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <div class="d-flex justify-center justify-md-end">
              <a href="#" class="text-red-lighten-1 mr-4">Terms of Service</a>
              <a href="#" class="text-red-lighten-1 mr-4">Privacy Policy</a>
              <a href="#" class="text-red-lighten-1">Cookie Policy</a>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-container>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

// State variables
const animeList = ref([]);
const featuredAnime = ref([]);
const loading = ref(true);
const loadingMore = ref(false);
const error = ref(null);
const hasMore = ref(true);
const currentPage = ref(1);

// Search and filter state
const searchQuery = ref('');
const filterStatus = ref('all');
const selectedGenres = ref([]);
const yearRange = ref([2016, new Date().getFullYear()]);
const sortBy = ref('newest'); // Changed default to newest
const filterMenu = ref(false);
const viewMode = ref('grid');
const selectedSeason = ref('spring');

// Modal state
const dialog = ref(false);
const selectedAnime = ref({});

// Menu state
const menu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const menuAnime = ref({});

// Constants
const currentYear = new Date().getFullYear();
const sortOptions = [
  { title: 'Newest', value: 'newest' },
  { title: 'Latest', value: 'latest' },
  { title: 'Top Rating', value: 'toprating' }
];
const seasonOptions = [
  { title: 'Spring', value: 'spring' },
  { title: 'Summer', value: 'summer' },
  { title: 'Fall', value: 'fall' },
  { title: 'Winter', value: 'winter' }
];

// Image proxy function to use AlphaCoders as alternative source
const getProxiedImageUrl = (url) => {
  if (!url) return '';
  
  // If the URL is already from a proxy or a different domain, return as is
  if (url.includes('proxy.') || url.includes('images.weserv.nl')) {
    return url;
  }
  
  // Use a proxy service to bypass the block
  // Using images.weserv.nl with higher quality settings
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=600&h=900&fit=cover&q=80`;
};

// YouTube embed URL function
const getYoutubeEmbedUrl = (youtubeUrl) => {
  if (!youtubeUrl) return '';
  
  // Extract YouTube video ID
  const videoId = youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (videoId && videoId[1]) {
    return `https://www.youtube-nocookie.com/embed/${videoId[1]}`;
  }
  
  return youtubeUrl;
};

// Format status function
const formatStatus = (status) => {
  if (!status) return 'Unknown';
  
  switch (status.toLowerCase()) {
    case 'currently airing':
      return 'Watching';
    case 'finished airing':
      return 'Completed';
    case 'not yet aired':
      return 'Planned';
    default:
      return status;
  }
};

// Get status color function
const getStatusColor = (status) => {
  if (!status) return 'grey-darken-2';
  
  switch (status.toLowerCase()) {
    case 'currently airing':
      return 'amber-darken-2';
    case 'finished airing':
      return 'green-darken-2';
    case 'not yet aired':
      return 'blue-darken-2';
    default:
      return 'grey-darken-2';
  }
};

// Fetch anime data from Jikan API
const fetchAnimeData = async (page = 1, reset = false) => {
  if (reset) {
    loading.value = true;
    animeList.value = [];
    currentPage.value = 1;
  } else if (page > 1) {
    loadingMore.value = true;
  }
  
  try {
    // Build query parameters
    const params = {
      page,
      limit: 24,
      sfw: true
    };
    
    if (searchQuery.value) {
      params.q = searchQuery.value;
    }
    
    if (selectedGenres.value.length > 0) {
      params.genres = selectedGenres.value.join(',');
    }
    
    if (yearRange.value[0] > 2016 || yearRange.value[1] < currentYear) {
      params.start_date = `${yearRange.value[0]}-01-01`;
      params.end_date = `${yearRange.value[1]}-12-31`;
    }
    
    // Apply sorting
    switch (sortBy.value) {
      case 'newest':
        params.order_by = 'start_date';
        params.sort = 'desc';
        break;
      case 'latest':
        params.order_by = 'start_date';
        params.sort = 'desc';
        break;
      case 'toprating':
        params.order_by = 'score';
        params.sort = 'desc';
        break;
      default:
        params.order_by = 'popularity';
        params.sort = 'desc';
    }
    
    let response;
    
    // Use seasonal anime endpoints if no search query
    if (!searchQuery.value && !selectedGenres.value.length && 
        yearRange.value[0] === 2016 && yearRange.value[1] === currentYear) {
      // Try to fetch from seasonal endpoints first
      try {
        response = await axios.get(`https://api.jikan.moe/v4/seasons/${currentYear}/${selectedSeason.value}`, { params });
      } catch (err) {
        console.log(`Failed to fetch ${selectedSeason.value} season, trying fall season`);
        try {
          response = await axios.get(`https://api.jikan.moe/v4/seasons/${currentYear}/fall`, { params });
        } catch (err) {
          console.log('Failed to fetch fall season, using general anime endpoint');
          response = await axios.get('https://api.jikan.moe/v4/anime', { params });
        }
      }
    } else {
      response = await axios.get('https://api.jikan.moe/v4/anime', { params });
    }
    
    if (response.data.data.length === 0) {
      hasMore.value = false;
    } else {
      // Process the data to add year property
      const processedData = response.data.data.map(anime => ({
        ...anime,
        year: anime.aired?.prop?.from?.year || null,
        status: anime.status?.toLowerCase() || 'unknown'
      }));
      
      if (reset) {
        animeList.value = processedData;
      } else {
        animeList.value = [...animeList.value, ...processedData];
      }
      
      // Set featured anime if on first page
      if (page === 1 && reset) {
        featuredAnime.value = processedData.slice(0, 5);
      }
      
      // Check if there are more pages
      hasMore.value = response.data.pagination.has_next_page;
      currentPage.value = page;
    }
    
    error.value = null;
  } catch (err) {
    console.error('Error fetching anime data:', err);
    error.value = 'Failed to load anime data. Please try again.';
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// Apply filters function
const applyFilters = () => {
  filterMenu.value = false;
  fetchAnimeData(1, true);
};

// Load more anime
const loadMoreAnime = () => {
  if (hasMore.value && !loadingMore.value) {
    fetchAnimeData(currentPage.value + 1);
  }
};

// Fetch initial data
onMounted(() => {
  fetchAnimeData(1, true);
});

// Watch for filter changes and refetch data
watch([searchQuery, selectedGenres, yearRange, sortBy, selectedSeason], () => {
  fetchAnimeData(1, true);
}, { deep: true });

// All genres from the anime list
const allGenres = computed(() => {
  const genres = new Set();
  animeList.value.forEach(anime => {
    anime.genres?.forEach(genre => {
      genres.add(genre.name);
    });
  });
  return Array.from(genres).sort();
});

// Filtered anime list
const filteredAnime = computed(() => {
  return animeList.value;
});

// Get sort label
const getSortLabel = (value) => {
  const option = sortOptions.find(opt => opt.value === value);
  return option ? option.title : value;
};

// Select anime for modal
const selectAnime = (anime) => {
  selectedAnime.value = anime;
  dialog.value = true;
};

// Watch anime
const watchAnime = (anime) => {
  console.log('Watching:', anime.title);
  // Implement watch functionality
};

// Show context menu
const showMenu = (e, anime) => {
  e.preventDefault();
  menuAnime.value = anime;
  menuX.value = e.clientX;
  menuY.value = e.clientY;
  menu.value = true;
};

// Add to watch later
const addToWatchLater = (anime) => {
  console.log('Added to watch later:', anime.title);
  menu.value = false;
};

// Add to favorites
const addToFavorites = (anime) => {
  console.log('Added to favorites:', anime.title);
  menu.value = false;
};

// Share anime
const shareAnime = (anime) => {
  console.log('Sharing:', anime.title);
  menu.value = false;
};

// Reset filters
const resetFilters = () => {
  searchQuery.value = '';
  selectedGenres.value = [];
  yearRange.value = [2016, currentYear];
  sortBy.value = 'newest';
  selectedSeason.value = 'spring';
  fetchAnimeData(1, true);
};
</script>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');
.dark-bg {
  background-color: #121212;
  background-image: 
    radial-gradient(circle at 10% 20%, rgba(139, 0, 0, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(139, 0, 0, 0.1) 0%, transparent 20%);
}
.dark-card {
  background-color: #1E1E1E !important;
  border: 1px solid rgba(139, 0, 0, 0.3) !important;
}
.dark-card-tonal {
  background-color: rgba(139, 0, 0, 0.2) !important;
  border: 1px solid rgba(139, 0, 0, 0.3) !important;
}
.dark-card-anime {
  background-color: #2A2A2A !important;
  border: 1px solid rgba(139, 0, 0, 0.4) !important;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.dark-card-anime:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(139, 0, 0, 0.4) !important;
}
.dark-list {
  background-color: transparent;
}
.dark-list .v-list-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.dark-list .v-list-item:last-child {
  border-bottom: none;
}
/* Filter Menu Styles */
.filter-menu-card {
  border-radius: 12px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
}
.year-slider {
  margin-top: 20px;
}
.reset-btn {
  transition: all 0.3s ease;
}
.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}
.load-filter-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}
.load-filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}
/* Button Styles */
.filter-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  color: white !important;
}
.filter-btn::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transition: left 0.3s ease;
}
.filter-btn:hover::before {
  left: 0;
}
/* Active filter button with inverted colors */
.filter-toggle .filter-btn.v-btn--active {
  background-color: #ff5252 !important; /* red-lighten-1 */
  color: #000 !important; /* black text for contrast */
  border-color: #ff5252 !important;
  font-weight: bold;
}
.view-toggle .v-btn {
  background-color: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  color: white !important;
}
.view-toggle .v-btn.v-btn--active {
  background-color: #ff5252 !important;
  color: #000 !important;
  border-color: #ff5252 !important;
}
.watch-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}
.watch-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}
.details-btn {
  transition: all 0.3s ease;
}
.details-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.1);
}
.watch-card-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}
.watch-card-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}
.menu-btn {
  transition: all 0.3s ease;
}
.menu-btn:hover {
  transform: rotate(90deg);
  background-color: rgba(139, 0, 0, 0.2);
}
.social-btn {
  transition: all 0.3s ease;
}
.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(139, 0, 0, 0.3);
}
.subscribe-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}
.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(139, 0, 0, 0.4);
}
/* Card Styles */
.anime-image-container {
  position: relative;
  overflow: hidden;
}
.anime-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.anime-image-container:hover .anime-overlay {
  opacity: 1;
}
.play-overlay-btn {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}
.anime-image-container:hover .play-overlay-btn {
  transform: scale(1);
}
.status-chip {
  transition: all 0.3s ease;
}
.status-chip:hover {
  transform: scale(1.1);
}
/* Carousel Styles */
.carousel-container {
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(139, 0, 0, 0.3);
}
.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  pointer-events: none;
}
/* Featured text visibility */
.featured-text {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  font-weight: 600;
  color: #ffffff !important;
}
/* Search Field */
.search-field {
  transition: all 0.3s ease;
}
.search-field:focus-within {
  box-shadow: 0 0 0 2px rgba(139, 0, 0, 0.5);
}
/* List View Styles */
.anime-list-view {
  background-color: transparent;
}
.anime-list-item {
  background-color: rgba(42, 42, 42, 0.7);
  border-radius: 8px;
  border: 1px solid rgba(139, 0, 0, 0.3);
  transition: all 0.3s ease;
}
.anime-list-item:hover {
  background-color: rgba(139, 0, 0, 0.2);
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(139, 0, 0, 0.3);
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
/* Modal Styles */
.preview-container {
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}
.preview-iframe {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  border: none;
  pointer-events: auto;
}
/* Footer Styles */
.dark-footer {
  background-color: #1A1A1A;
  border-top: 1px solid rgba(139, 0, 0, 0.3);
  padding: 40px 0 20px;
}
.footer-list {
  list-style-type: none;
  padding-left: 0;
}
.footer-list li {
  margin-bottom: 10px;
}
.footer-list a {
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}
.footer-list a::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #8B0000;
  transition: width 0.3s ease;
}
.footer-list a:hover::after {
  width: 100%;
}
/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .text-h6-mobile {
    font-size: 1rem !important;
    line-height: 1.2;
  }
  
  .text-subtitle-2-mobile {
    font-size: 0.875rem !important;
    line-height: 1.2;
  }
  
  .mobile-toggle {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .mobile-toggle .v-btn {
    flex: 1 0 auto;
    padding: 0 8px;
    font-size: 0.75rem;
  }
}
</style>