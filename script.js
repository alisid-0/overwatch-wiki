// global variables

const $header = $(`header`)
const $body = $(`body`)

const $heroDiv = $(`#hero-div`)
const $gamemodeDiv = $(`#gamemode-div`)
const $mapDiv = $(`#map-div`)

const divsArray = [$heroDiv, $gamemodeDiv, $mapDiv]

const $heroImg = $(`.hero-img`)
const $gamemodeImg = $(`.gamemode-img`)
const $mapImg = $(`.map-img`)

const imgArray =[$heroImg, $gamemodeImg, $mapImg]


const $heroPage = $(`#heroes-page`)
$heroPage.remove()

const $gamemodesPage = $(`#gamemodes-page`)
$gamemodesPage.remove()

const $mapsPage = $(`#maps-page`)
$mapsPage.remove()

const $infoPage = $(`.info-page`)
$infoPage.remove()

const $sectionTitle = $(`.section-title`)

// animation section

const observer = new IntersectionObserver((i)=>{
    i.forEach((j) =>{
        if (j.isIntersecting){
            j.target.classList.add(`show`)
        } else {
            j.target.classList.remove(`show`)
        }
    })
})


const hiddenElements = document.querySelectorAll(`.hidden`)
hiddenElements.forEach((i)=> observer.observe(i))

// functions

const pageClear = ()=>{
    $header.addClass(`hidden`)
    divsArray.forEach((div)=>{
        $(div).removeClass(`show`)
        setTimeout(()=>{
            $(div).remove()
            $header.remove()
        },500)
    })
}

const contentClear = ()=>{
    $(`.section-spread`).addClass(`hidden`)
    setTimeout(()=>{
        $(`.section-spread`).remove()
    },500)
}

const pageAdd = (page)=>{
    $(page).appendTo($body)
    $(page).addClass(`hidden`)
    setTimeout(()=>{
        $(page).addClass(`show`)
    },500)
}

$(`#button-home`).on(`click`, ()=>{
    $(`.page`).removeClass(`show`)
})

const heroesGet = async()=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes`)
    console.log(apiGet)
    return apiGet
}

const heroGet = async(hero)=>{
    const apiGet = await axios.get(`https://overfast-api.tekrop.fr/heroes/${hero}`)
    console.log(apiGet.data)
    return apiGet.data
}

function extractVideoIdFromLink(link) {
    const match = link.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&]+)/);
    return match ? match[1] : '';
  }

const infoSetHero = async(key)=>{
    const getApi = await heroGet(key)
    const $abilityDiv = $(`#ability-div`)
    const $storyDiv = $(`#story-div`)
    for (let i of getApi.abilities){
        console.log(i.name)
        const $abilityContainer = $(`<div>`)
        const $abilityName = $(`<h4 class="ability-name">`)
        const $abilityImg = $(`<img>`)
        const $abilityDesc = $(`<h4>`)

        const $abilityVideo = $('<video />', {
            id: 'video',
            src: i.video.link.mp4,
            type: 'video/mp4',
            controls: false,
            loop: true,
            autoplay: true,
        })

        $abilityContainer.attr(`class`, `ability-container`)
        $abilityName.html(i.name)
        $abilityImg.attr(`src`, i.icon)
        $abilityDesc.addClass(`ability-desc`)
        $abilityDesc.html(i.description)
        $abilityContainer.append($abilityName)
        $abilityContainer.append($abilityImg)
        $abilityContainer.append($abilityDesc)
        $abilityContainer.append($abilityVideo)
        $abilityDiv.append($abilityContainer)
    }

    const $summary = $(`.summary`)
    $summary.html(getApi.story.summary)
    
    const link = getApi.story.media.link
    console.log(link)
    console.log(link.substring(17))
    console.log(extractVideoIdFromLink(link))
    console.log(link.substring(link-11))
    const idVideo = extractVideoIdFromLink(link)

    const $heroVideo = $('<div />', {
        id: 'player'
      }).appendTo('#story-div');
      
      // Load the YouTube IFrame API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      
      // Function called when YouTube API is ready
      window.onYouTubeIframeAPIReady = function() {
        new YT.Player('player', {
          videoId: idVideo, // Extract the video ID from the YouTube link
          playerVars: {
            autoplay: 1,
            controls: 1,
            loop: 1,
            playlist: idVideo // Repeat the same video
          }
        });
      };

    for (let j of getApi.story.chapters){
        const $chapterContainer = $(`<div class="chapter-container">`)
        const $chapterTitle = $(`<h3 class="chapter-title">`)
        const $chapterImg = $(`<img class="chapter-img">`)
        const $chapterDesc = $(`<h4 class="chapter-desc">`)
        $chapterTitle.html(j.title)
        $chapterImg.attr(`src`, j.picture)
        $chapterDesc.html(j.content)
        $chapterContainer.append($chapterTitle)
        $chapterContainer.append($chapterImg)
        $chapterContainer.append($chapterDesc)
        $storyDiv.append($chapterContainer)
    }
}

const imgAdd = async(link, key, className) =>{
    const $img = $(`<img>`)  
    $img.attr(`src`, `${link}`)
    $img.attr(`class`, `section-img`)
    $(`.section-spread`).append($img)
    $img.on(`click`, async()=>{
        const heroInfo = await heroGet(key)
        pageAdd($infoPage)
        infoSetHero(key)
        $(`.section-title`).html(heroInfo.name)
        $(`.info-img`).attr(`src`,heroInfo.portrait)
        $(`.info-img`).attr(`class`, `info-img ${className}`)
        $(`#desc`).html(`Description: ${heroInfo.description}`)
        $(`#location`).html(`Location: ${heroInfo.location}`)
        $(`#role`).html(`Role: ${heroInfo.role}`)
        contentClear()
    })
}

// event listeners

for (let i of $heroImg){ 
    $(i).on(`click`, async()=>{
        pageClear()
        pageAdd($heroPage)
        const heroesApi = await heroesGet()
        const heroesData = heroesApi.data
        console.log(heroesData)
        // const $backButtonHome = $(`<button class="button-home">`)
        // $backButtonHome.html(`Back`)
        // $body.append($backButtonHome)
        if ($(i).attr(`id`) == `rein`){
            $(`#hero-section-title`).html(`Tank`)
            for (let j of heroesData){
                j.role == `tank` ? imgAdd(j.portrait, j.key, `hero`) : null
            }
            $(`.section-spread`).attr(`id`, `section-spread-tank`)
        } else if ($(i).attr(`id`) == `genji`){
            $(`#hero-section-title`).html(`Damage`)
            for (let j of heroesData){
                j.role == `damage` ? imgAdd(j.portrait, j.key, `hero`) : null
            }
        } else if ($(i).attr(`id`) == `mercy`){
            $(`#hero-section-title`).html(`Support`)
            for (let j of heroesData){
                j.role == `support` ? imgAdd(j.portrait, j.key, `hero`) : null
            }
        }
    })
}

for (let i of $gamemodeImg){
    $(i).on(`click`, ()=>{
    pageClear()
    pageAdd($gamemodesPage)
    })
}

for (let i of $mapImg){
    $(i).on(`click`, ()=>{
    pageClear()
    pageAdd($mapsPage)
    })
}

