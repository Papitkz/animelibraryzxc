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
                          <v-btn
                            color="red-darken-2"
                            class="mr-2 mb-2 manga-btn"
                            prepend-icon="mdi-book-open-page-variant"
                            size="small"
                            @click.stop="fetchMangaByAnimeId(anime.mal_id)"
                          >
                            Read Manga
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
                      <v-btn
                        icon="mdi-book-open-page-variant"
                        color="red-darken-2"
                        size="large"
                        class="manga-overlay-btn ml-2"
                        @click.stop="fetchMangaByAnimeId(anime.mal_id)"
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
                      icon="mdi-book-open-page-variant"
                      color="red-darken-2"
                      size="large"
                      class="mb-2"
                      @click.stop="fetchMangaByAnimeId(anime.mal_id)"
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
            
            <!-- Manga Section -->
            <v-row v-if="mangaList.length > 0" class="mt-8">
              <v-col cols="12">
                <h2 class="text-h5 font-weight-bold mb-4 text-white">Related Manga</h2>
              </v-col>
              
              <v-col
                v-for="(manga, index) in mangaList"
                :key="manga.mal_id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="animate__animated animate__fadeInUp"
                :style="`animation-delay: ${index * 0.1}s`"
              >
                <v-card
                  class="mx-auto dark-card-anime manga-card"
                  max-width="344"
                  elevation="2"
                  hover
                  :ripple="false"
                  @click="selectManga(manga)"
                  style="cursor: pointer;"
                >
                  <div class="manga-image-container">
                    <v-img
                      :src="getProxiedImageUrl(manga.images?.jpg?.large_image_url)"
                      height="200px"
                      cover
                      class="align-end"
                      :lazy-src="getProxiedImageUrl(manga.images?.jpg?.small_image_url)"
                    >
                      <v-chip
                        :color="getStatusColor(manga.status)"
                        size="small"
                        class="ma-2 status-chip"
                      >
                        {{ formatStatus(manga.status) }}
                      </v-chip>
                    </v-img>
                    <div class="manga-overlay">
                      <v-btn
                        icon="mdi-book-open-page-variant"
                        color="red-darken-2"
                        size="large"
                        class="read-overlay-btn"
                        @click.stop="selectManga(manga)"
                      ></v-btn>
                    </div>
                  </div>
                  
                  <v-card-title class="text-truncate text-white">{{ manga.title }}</v-card-title>
                  
                  <v-card-subtitle class="text-red-lighten-1">
                    {{ manga.chapters || 'Unknown' }} chapters • {{ manga.volumes || 'Unknown' }} volumes
                  </v-card-subtitle>
                  
                  <v-card-text>
                    <v-row align="center" class="mx-0">
                      <v-rating
                        :model-value="manga.score / 2"
                        color="amber"
                        density="compact"
                        half-increments
                        readonly
                        size="small"
                      ></v-rating>
                      <div class="text-grey-lighten-1 ms-4">{{ manga.score }}</div>
                    </v-row>
                    
                    <div class="my-2 text-subtitle-2 text-red-lighten-1">
                      <v-icon icon="mdi-tag-multiple" size="small" class="mr-1"></v-icon>
                      {{ manga.genres?.slice(0, 2).map(g => g.name).join(', ') }}
                    </div>
                  </v-card-text>
                  
                  <v-card-actions>
                    <v-btn
                      color="red-darken-2"
                      variant="flat"
                      prepend-icon="mdi-book-open-page-variant"
                      class="text-white read-card-btn"
                      @click.stop="selectManga(manga)"
                    >
                      Read
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn 
                      icon="mdi-dots-vertical" 
                      variant="text" 
                      class="text-white menu-btn"
                      @click.stop="showMangaMenu($event, manga)"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
            
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
            <v-btn
              variant="text"
              dark
              @click="fetchMangaByAnimeId(selectedAnime.mal_id)"
            >
              <v-icon left>mdi-book-open-page-variant</v-icon>
              Read Manga
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
              
              <!-- Related Manga Section in Modal -->
              <v-card class="dark-card-tonal mt-4" v-if="mangaList.length > 0">
                <v-card-title class="text-white">Related Manga</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="(manga, index) in mangaList"
                      :key="manga.mal_id"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card
                        class="dark-card-anime manga-card"
                        elevation="2"
                        hover
                        @click="selectManga(manga)"
                      >
                        <v-img
                          :src="getProxiedImageUrl(manga.images?.jpg?.large_image_url)"
                          height="150"
                          cover
                          class="align-end"
                          :lazy-src="getProxiedImageUrl(manga.images?.jpg?.small_image_url)"
                        ></v-img>
                        <v-card-title class="text-truncate text-white text-subtitle-1">{{ manga.title }}</v-card-title>
                        <v-card-subtitle class="text-red-lighten-1">
                          {{ manga.chapters || 'Unknown' }} chapters
                        </v-card-subtitle>
                        <v-card-actions>
                          <v-btn
                            color="red-darken-2"
                            variant="flat"
                            prepend-icon="mdi-book-open-page-variant"
                            class="text-white"
                            size="small"
                            @click.stop="selectManga(manga)"
                          >
                            Read
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    
    <!-- Manga Detail Modal -->
    <v-dialog
      v-model="mangaDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="dark-card">
        <v-toolbar dark color="red-darken-2">
          <v-btn icon dark @click="mangaDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ mangaData.title }}</v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
          <v-row>
            <v-col cols="12" md="4">
              <v-img
                :src="getProxiedImageUrl(mangaData.images?.jpg?.large_image_url)"
                height="500"
                cover
                class="rounded-lg"
                :lazy-src="getProxiedImageUrl(mangaData.images?.jpg?.small_image_url)"
              ></v-img>
              
              <v-card class="dark-card-tonal mt-4">
                <v-card-title class="text-white">Information</v-card-title>
                <v-card-text>
                  <v-list class="dark-list">
                    <v-list-item>
                      <v-list-item-title class="text-white">Chapters</v-list-item-title>
                      <v-list-item-subtitle class="text-red-lighten-1">{{ mangaData.chapters || 'Unknown' }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Volumes</v-list-item-title>
                      <v-list-item-subtitle class="text-red-lighten-1">{{ mangaData.volumes || 'Unknown' }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Status</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-chip :color="getStatusColor(mangaData.status)" size="small">
                          {{ formatStatus(mangaData.status) }}
                        </v-chip>
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="text-white">Rating</v-list-item-title>
                      <v-list-item-subtitle>
                        <v-rating
                          :model-value="mangaData.score / 2"
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
                        {{ mangaData.genres?.map(g => g.name).join(', ') || 'N/A' }}
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
                  <p class="text-white text-body-1">{{ mangaData.synopsis || 'No synopsis available.' }}</p>
                </v-card-text>
              </v-card>
              
              <v-card class="dark-card-tonal mt-4" v-if="mangaNews.length > 0">
                <v-card-title class="text-white">News</v-card-title>
                <v-card-text>
                  <v-list class="dark-list">
                    <v-list-item
                      v-for="news in mangaNews"
                      :key="news.mal_id"
                      @click="openNewsLink(news.url)"
                    >
                      <v-list-item-title class="text-white">{{ news.title }}</v-list-item-title>
                      <v-list-item-subtitle class="text-red-lighten-1">
                        {{ news.date }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
              
              <v-card class="dark-card-tonal mt-4" v-if="mangaPictures.length > 0">
                <v-card-title class="text-white">Pictures</v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="(picture, index) in mangaPictures"
                      :key="index"
                      cols="6"
                      md="4"
                    >
                      <v-img
                        :src="getProxiedImageUrl(picture.jpg?.large_image_url)"
                        aspect-ratio="1"
                        cover
                        class="rounded-lg"
                        :lazy-src="getProxiedImageUrl(picture.jpg?.small_image_url)"
                      ></v-img>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    
    <!-- Episodes Modal -->
    <v-dialog
      v-model="episodesDialog"
      fullscreen
      :scrim="false"
      transition="dialog-bottom-transition"
    >
      <v-card class="dark-card">
        <v-toolbar dark color="red-darken-2">
          <v-btn icon dark @click="episodesDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Episodes - {{ selectedAnimeForEpisodes.title }}</v-toolbar-title>
        </v-toolbar>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-list class="dark-list">
                <v-list-item
                  v-for="episode in episodes"
                  :key="episode.mal_id"
                  @click="selectEpisode(episode)"
                  class="episode-list-item"
                >
                  <v-list-item-title class="text-white">{{ episode.title }}</v-list-item-title>
                  <v-list-item-subtitle class="text-red-lighten-1">
                    Episode {{ episode.episode }} • Aired: {{ episode.aired }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    <v-icon color="red-darken-2">mdi-play-circle</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-dialog>
    
    <!-- Episode Detail Modal -->
    <v-dialog
      v-model="episodeDetailDialog"
      max-width="800"
    >
      <v-card class="dark-card">
        <v-toolbar dark color="red-darken-2">
          <v-toolbar-title>Episode Details</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon dark @click="episodeDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <h2 class="text-h5 text-white">{{ selectedEpisode.title }}</h2>
              <p class="text-red-lighten-1">Episode {{ selectedEpisode.episode }}</p>
              <p class="text-white">{{ selectedEpisode.synopsis || 'No synopsis available.' }}</p>
              <div class="mt-4">
                <v-chip
                  :color="selectedEpisode.filler ? 'orange' : 'green'"
                  class="mr-2"
                >
                  {{ selectedEpisode.filler ? 'Filler' : 'Canon' }}
                </v-chip>
                <v-chip color="blue">
                  Score: {{ selectedEpisode.score }}
                </v-chip>
              </div>
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
        <v-list-item @click="fetchMangaByAnimeId(menuAnime.mal_id)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-book-open-page-variant</v-icon>
            Read Manga
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
    
    <!-- Manga Context Menu -->
    <v-menu
      v-model="mangaMenu"
      :position-x="mangaMenuX"
      :position-y="mangaMenuY"
      absolute
      offset-y
    >
      <v-list class="dark-list">
        <v-list-item @click="addToMangaReadLater(menuManga)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-clock-outline</v-icon>
            Read Later
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="addToMangaFavorites(menuManga)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-heart-outline</v-icon>
            Add to Favorites
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="shareManga(menuManga)">
          <v-list-item-title class="text-white">
            <v-icon left>mdi-share-variant</v-icon>
            Share
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="selectManga(menuManga)">
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
            <p class="text-red-lighten-1">© 2025 Anime Library. All rights reserved.</p>
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
const mangaList = ref([]);
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
const sortBy = ref('newest');
const filterMenu = ref(false);
const viewMode = ref('grid');
const selectedSeason = ref('spring');

// Modal state
const dialog = ref(false);
const selectedAnime = ref({});
const mangaDialog = ref(false);
const mangaData = ref({});
const mangaNews = ref([]);
const mangaPictures = ref([]);

// Episodes state
const episodesDialog = ref(false);
const selectedAnimeForEpisodes = ref({});
const episodes = ref([]);
const episodeDetailDialog = ref(false);
const selectedEpisode = ref({});

// Menu state
const menu = ref(false);
const menuX = ref(0);
const menuY = ref(0);
const menuAnime = ref({});

// Manga menu state
const mangaMenu = ref(false);
const mangaMenuX = ref(0);
const mangaMenuY = ref(0);
const menuManga = ref({});

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
  console.log(url,'haha');
  
  // if (!url) return '';
  
  // If the URL is already from a proxy or a different domain, return as is
  // if (url.includes('proxy.') || url.includes('images.weserv.nl')) {
  //   return url;
  // }
  
  // Use a proxy service to bypass the block
  // Using images.weserv.nl with higher quality settings
  // return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=600&h=900&fit=cover&q=80`;
  return url;

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
    mangaList.value = [];
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

// Fetch manga by anime ID
const fetchMangaByAnimeId = async (animeId) => {
  try {
    // First, get the anime details to find related manga
    const animeResponse = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/full`);
    const animeData = animeResponse.data.data;
    
    // Find related manga in the anime's related property
    const relatedManga = [];
    if (animeData.related) {
      for (const relationType in animeData.related) {
        const items = animeData.related[relationType];
        for (const item of items) {
          if (item.type === 'manga') {
            relatedManga.push(item);
          }
        }
      }
    }
    
    if (relatedManga.length === 0) {
      alert('No related manga found for this anime.');
      return;
    }
    
    // Fetch details for each related manga
    const mangaPromises = relatedManga.map(manga => 
      axios.get(`https://api.jikan.moe/v4/manga/${manga.mal_id}`)
    );
    
    const mangaResponses = await Promise.all(mangaPromises);
    
    // Process the manga data
    const processedManga = mangaResponses.map(response => {
      const manga = response.data.data;
      return {
        ...manga,
        status: manga.status?.toLowerCase() || 'unknown'
      };
    });
    
    mangaList.value = processedManga;
    
    // If we're not already in the anime detail modal, open it
    if (!dialog.value) {
      // Find the anime in our list
      const anime = animeList.value.find(a => a.mal_id === animeId);
      if (anime) {
        selectAnime(anime);
      }
    }
  } catch (error) {
    console.error('Error fetching manga by anime ID:', error);
    alert('Error fetching manga data.');
  }
};

// Fetch manga data for detail modal
const fetchMangaData = async (mangaId) => {
  console.log(mangaId);
  
  try {
    const [detailsRes, fullRes, newsRes, picturesRes] = await Promise.all([
      axios.get(`https://api.jikan.moe/v4/manga/${mangaId}`),
      axios.get(`https://api.jikan.moe/v4/manga/${mangaId}/full`),
      axios.get(`https://api.jikan.moe/v4/manga/${mangaId}/news`),
      axios.get(`https://api.jikan.moe/v4/manga/${mangaId}/pictures`)
    ]);
    mangaData.value = {
      ...detailsRes.data.data,
      ...fullRes.data.data
    };
    mangaNews.value = newsRes.data.data;
    mangaPictures.value = picturesRes.data.data;
    mangaDialog.value = true;
  } catch (error) {
    console.error('Error fetching manga data:', error);
    alert('Error fetching manga data.');
  }
};

// Fetch episodes for an anime
const fetchEpisodes = async (animeId) => {
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/episodes`);
    episodes.value = response.data.data;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    alert('Error fetching episodes.');
  }
};

// Fetch episode details
const fetchEpisodeDetails = async (animeId, episodeId) => {
  try {
    const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeId}/episodes/${episodeId}`);
    selectedEpisode.value = response.data.data;
    episodeDetailDialog.value = true;
  } catch (error) {
    console.error('Error fetching episode details:', error);
    alert('Error fetching episode details.');
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

// Select manga for modal
const selectManga = (manga) => {
  console.log(manga);
  
  fetchMangaData(manga.mal_id);
};

// Watch anime - show episodes
const watchAnime = (anime) => {
  dialog.value = false;
  selectedAnimeForEpisodes.value = anime;
  episodesDialog.value = true;
  fetchEpisodes(anime.mal_id);
};

// Select episode for details
const selectEpisode = (episode) => {
  fetchEpisodeDetails(selectedAnimeForEpisodes.value.mal_id, episode.mal_id);
};

// Open news link
const openNewsLink = (url) => {
  window.open(url, '_blank');
};

// Show context menu
const showMenu = (e, anime) => {
  e.preventDefault();
  menuAnime.value = anime;
  menuX.value = e.clientX;
  menuY.value = e.clientY;
  menu.value = true;
};

// Show manga context menu
const showMangaMenu = (e, manga) => {
  e.preventDefault();
  menuManga.value = manga;
  mangaMenuX.value = e.clientX;
  mangaMenuY.value = e.clientY;
  mangaMenu.value = true;
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

// Add manga to read later
const addToMangaReadLater = (manga) => {
  console.log('Added to read later:', manga.title);
  mangaMenu.value = false;
};

// Add manga to favorites
const addToMangaFavorites = (manga) => {
  console.log('Added to favorites:', manga.title);
  mangaMenu.value = false;
};

// Share manga
const shareManga = (manga) => {
  console.log('Sharing:', manga.title);
  mangaMenu.value = false;
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
.watch-btn, .manga-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}
.watch-btn:hover, .manga-btn:hover {
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
.watch-card-btn, .read-card-btn {
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
}
.watch-card-btn:hover, .read-card-btn:hover {
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
.anime-image-container, .manga-image-container {
  position: relative;
  overflow: hidden;
}
.anime-overlay, .manga-overlay {
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
.anime-image-container:hover .anime-overlay,
.manga-image-container:hover .manga-overlay {
  opacity: 1;
}
.play-overlay-btn, .manga-overlay-btn, .read-overlay-btn {
  transform: scale(0.8);
  transition: transform 0.3s ease;
}
.anime-image-container:hover .play-overlay-btn,
.anime-image-container:hover .manga-overlay-btn,
.manga-image-container:hover .read-overlay-btn {
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
/* Episode List Styles */
.episode-list-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.episode-list-item:hover {
  background-color: rgba(139, 0, 0, 0.2);
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